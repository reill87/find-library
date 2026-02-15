import { NextRequest, NextResponse } from "next/server";
import { searchBooks, searchPopularBooks } from "@/lib/api-client";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const keyword = searchParams.get("keyword");
  const pageNo = parseInt(searchParams.get("pageNo") ?? "1");
  const pageSize = parseInt(searchParams.get("pageSize") ?? "10");
  const region = searchParams.get("region") ?? undefined;
  const sort = searchParams.get("sort") ?? "accuracy";

  if (!keyword) {
    return NextResponse.json(
      { error: "keyword 파라미터가 필요합니다." },
      { status: 400 }
    );
  }

  try {
    // 키워드로 도서 검색
    const result = await searchBooks(keyword, pageNo, pageSize, sort);
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
    console.error("도서 검색 오류:", error);
    const message =
      error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
