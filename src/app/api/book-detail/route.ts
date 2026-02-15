import { NextRequest, NextResponse } from "next/server";
import { getBookDetail, getRecommendations } from "@/lib/api-client";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const isbn13 = searchParams.get("isbn13");

  if (!isbn13) {
    return NextResponse.json(
      { error: "isbn13 파라미터가 필요합니다." },
      { status: 400 }
    );
  }

  try {
    const [detailResult, recommendResult] = await Promise.all([
      getBookDetail(isbn13),
      getRecommendations(isbn13).catch(() => null),
    ]);

    const detail = detailResult.response.detail?.[0]?.book ?? null;
    const recommendations =
      recommendResult?.response.docs?.map((d) => d.doc) ?? [];

    return NextResponse.json({
      detail,
      recommendations,
    });
  } catch (error) {
    console.error("도서 상세 정보 조회 오류:", error);
    const message =
      error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
