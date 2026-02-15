import { NextRequest, NextResponse } from "next/server";
import { searchPopularBooks } from "@/lib/api-client";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const region = searchParams.get("region") ?? undefined;
  const dtl_region = searchParams.get("dtl_region") ?? undefined;
  const kdc = searchParams.get("kdc") ?? undefined;
  const pageNo = parseInt(searchParams.get("pageNo") ?? "1");
  const pageSize = parseInt(searchParams.get("pageSize") ?? "20");

  try {
    const result = await searchPopularBooks({
      region,
      dtl_region,
      kdc,
      pageNo,
      pageSize,
    });

    const docs = result.response.docs ?? [];
    const books = docs.map((d) => d.doc);

    return NextResponse.json({
      books,
      totalCount: result.response.numFound,
      resultCount: result.response.resultNum,
      pageNo,
      pageSize,
    });
  } catch (error) {
    console.error("인기 도서 조회 오류:", error);
    const message =
      error instanceof Error
        ? error.message
        : "알 수 없는 오류가 발생했습니다.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
