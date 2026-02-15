import { NextRequest, NextResponse } from "next/server";
import {
  searchLibrariesByBook,
  checkBookAvailability,
} from "@/lib/api-client";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const isbn13 = searchParams.get("isbn13");
  const region = searchParams.get("region") ?? undefined;
  const dtl_region = searchParams.get("dtl_region") ?? undefined;

  if (!isbn13) {
    return NextResponse.json(
      { error: "isbn13 파라미터가 필요합니다." },
      { status: 400 }
    );
  }

  try {
    // ISBN으로 도서를 소장한 도서관 검색
    const result = await searchLibrariesByBook(isbn13, region, dtl_region);
    const libs = result.response.libs ?? [];

    // 각 도서관의 대출 가능 여부 병렬 조회 (최대 10개)
    const librariesWithAvailability = await Promise.all(
      libs.slice(0, 10).map(async ({ lib }) => {
        try {
          const availability = await checkBookAvailability(
            lib.libCode,
            isbn13
          );
          return {
            ...lib,
            hasBook: availability.response.result.hasBook === "Y",
            loanAvailable:
              availability.response.result.loanAvailable === "Y",
          };
        } catch {
          return {
            ...lib,
            hasBook: true,
            loanAvailable: false,
          };
        }
      })
    );

    return NextResponse.json({
      libraries: librariesWithAvailability,
      totalCount: result.response.numFound,
    });
  } catch (error) {
    console.error("도서관 검색 오류:", error);
    const message =
      error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
