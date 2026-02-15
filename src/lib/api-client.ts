// 정보나루(data4library.kr) API 클라이언트

const BASE_URL = "http://data4library.kr/api";

function getAuthKey(): string {
  const key = process.env.DATA4LIBRARY_AUTH_KEY;
  if (!key) {
    throw new Error("DATA4LIBRARY_AUTH_KEY 환경변수가 설정되지 않았습니다.");
  }
  return key;
}

async function apiRequest<T>(
  endpoint: string,
  params: Record<string, string>
): Promise<T> {
  const authKey = getAuthKey();
  const searchParams = new URLSearchParams({
    authKey,
    format: "json",
    ...params,
  });

  const url = `${BASE_URL}/${endpoint}?${searchParams.toString()}`;

  const response = await fetch(url, {
    next: { revalidate: 300 }, // 5분 캐시
  });

  if (!response.ok) {
    throw new Error(`API 요청 실패: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * 키워드로 도서 검색
 */
export async function searchBooks(
  keyword: string,
  pageNo = 1,
  pageSize = 10,
  sort = "accuracy"
) {
  const params: Record<string, string> = {
    keyword,
    pageNo: String(pageNo),
    pageSize: String(pageSize),
  };
  if (sort && sort !== "accuracy") {
    params.sort = sort;
  }

  return apiRequest<{
    response: {
      resultNum: number;
      numFound: number;
      docs?: Array<{
        doc: {
          no: number;
          bookname: string;
          authors: string;
          publisher: string;
          publication_year: string;
          isbn13: string;
          addition_symbol: string;
          vol: string;
          class_no: string;
          class_nm: string;
          bookImageURL: string;
          bookDtlUrl: string;
          loan_count: number;
        };
      }>;
    };
  }>("srchBooks", params);
}

/**
 * 인기 대출 도서 조회
 */
export async function searchPopularBooks(params: {
  startDt?: string;
  endDt?: string;
  region?: string;
  dtl_region?: string;
  kdc?: string;
  pageNo?: number;
  pageSize?: number;
}) {
  const queryParams: Record<string, string> = {};
  if (params.startDt) queryParams.startDt = params.startDt;
  if (params.endDt) queryParams.endDt = params.endDt;
  if (params.region) queryParams.region = params.region;
  if (params.dtl_region) queryParams.dtl_region = params.dtl_region;
  if (params.kdc) queryParams.kdc = params.kdc;
  queryParams.pageNo = String(params.pageNo ?? 1);
  queryParams.pageSize = String(params.pageSize ?? 10);

  return apiRequest<{
    response: {
      resultNum: number;
      numFound: number;
      docs?: Array<{
        doc: {
          no: number;
          ranking: string;
          bookname: string;
          authors: string;
          publisher: string;
          publication_year: string;
          isbn13: string;
          addition_symbol: string;
          class_no: string;
          class_nm: string;
          bookImageURL: string;
          bookDtlUrl: string;
          loan_count: number;
        };
      }>;
    };
  }>("loanItemSrch", queryParams);
}

/**
 * ISBN으로 도서를 소장한 도서관 검색
 */
export async function searchLibrariesByBook(
  isbn13: string,
  region?: string,
  dtl_region?: string
) {
  const params: Record<string, string> = { isbn: isbn13 };
  if (region) params.region = region;
  if (dtl_region) params.dtl_region = dtl_region;

  return apiRequest<{
    response: {
      numFound: number;
      libs?: Array<{
        lib: {
          libCode: string;
          libName: string;
          address: string;
          tel: string;
          fax: string;
          latitude: string;
          longitude: string;
          homepage: string;
          closed: string;
          operatingTime: string;
        };
      }>;
    };
  }>("libSrchByBook", params);
}

/**
 * 특정 도서관에서 도서의 소장/대출 가능 여부 확인
 */
export async function checkBookAvailability(
  libCode: string,
  isbn13: string
) {
  return apiRequest<{
    response: {
      result: {
        hasBook: string;
        loanAvailable: string;
      };
    };
  }>("bookExist", { libCode, isbn13 });
}

/**
 * 도서 상세 정보 조회
 */
export async function getBookDetail(isbn13: string) {
  return apiRequest<{
    response: {
      detail?: Array<{
        book: {
          bookname: string;
          authors: string;
          publisher: string;
          publication_year: string;
          isbn13: string;
          vol: string;
          class_no: string;
          class_nm: string;
          bookImageURL: string;
          description: string;
          loanCnt: number;
        };
      }>;
    };
  }>("srchDtlList", { isbn13, loaninfoYN: "Y" });
}

/**
 * 추천 도서 목록 조회
 */
export async function getRecommendations(isbn13: string) {
  return apiRequest<{
    response: {
      docs?: Array<{
        doc: {
          bookname: string;
          authors: string;
          publisher: string;
          publication_year: string;
          isbn13: string;
          bookImageURL: string;
        };
      }>;
    };
  }>("recommandList", { isbn13, type: "reader" });
}

/**
 * 도서관 검색 (지역 기반)
 */
export async function searchLibraries(params: {
  region?: string;
  dtl_region?: string;
  pageNo?: number;
  pageSize?: number;
}) {
  const queryParams: Record<string, string> = {};
  if (params.region) queryParams.region = params.region;
  if (params.dtl_region) queryParams.dtl_region = params.dtl_region;
  queryParams.pageNo = String(params.pageNo ?? 1);
  queryParams.pageSize = String(params.pageSize ?? 10);

  return apiRequest<{
    response: {
      numFound: number;
      libs?: Array<{
        lib: {
          libCode: string;
          libName: string;
          address: string;
          tel: string;
          fax: string;
          latitude: string;
          longitude: string;
          homepage: string;
          closed: string;
          operatingTime: string;
        };
      }>;
    };
  }>("libSrch", queryParams);
}
