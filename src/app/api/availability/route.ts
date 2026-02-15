import { NextRequest, NextResponse } from "next/server";
import { checkBookAvailability } from "@/lib/api-client";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const libCode = searchParams.get("libCode");
  const isbn13 = searchParams.get("isbn13");

  if (!libCode || !isbn13) {
    return NextResponse.json(
      { error: "libCode와 isbn13 파라미터가 모두 필요합니다." },
      { status: 400 }
    );
  }

  try {
    const result = await checkBookAvailability(libCode, isbn13);

    return NextResponse.json({
      hasBook: result.response.result.hasBook === "Y",
      loanAvailable: result.response.result.loanAvailable === "Y",
    });
  } catch (error) {
    console.error("대출 가능 여부 조회 오류:", error);
    const message =
      error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
