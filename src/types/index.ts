// 정보나루 API 응답 타입 정의

export interface Book {
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
}

export interface BookDetail {
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
}

export interface Library {
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
}

export interface BookAvailability {
  hasBook: string; // Y or N
  loanAvailable: string; // Y or N
}

export interface SearchBooksResponse {
  response: {
    request: Record<string, string>;
    resultNum: number;
    numFound: number;
    docs?: Array<{ doc: Book }>;
  };
}

export interface LibrarySearchResponse {
  response: {
    request: Record<string, string>;
    pageNo: number;
    pageSize: number;
    numFound: number;
    libs?: Array<{ lib: Library }>;
  };
}

export interface LibSrchByBookResponse {
  response: {
    request: Record<string, string>;
    numFound: number;
    libs?: Array<{ lib: Library }>;
  };
}

export interface BookExistResponse {
  response: {
    request: Record<string, string>;
    result: BookAvailability;
  };
}

export interface BookDetailResponse {
  response: {
    request: Record<string, string>;
    detail?: Array<{ book: BookDetail }>;
  };
}

export interface LoanItemResponse {
  response: {
    request: Record<string, string>;
    resultNum: number;
    numFound: number;
    docs?: Array<{ doc: Book }>;
  };
}

// 프론트엔드용 타입

export interface BookWithLibraries extends Book {
  libraries?: LibraryWithAvailability[];
  loadingLibraries?: boolean;
}

export interface LibraryWithAvailability extends Library {
  hasBook: boolean;
  loanAvailable: boolean;
}

export interface Region {
  code: string;
  name: string;
}

export interface DetailRegion {
  code: string;
  name: string;
}
