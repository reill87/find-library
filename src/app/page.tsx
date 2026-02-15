"use client";

import { useState } from "react";
import SearchForm from "@/components/SearchForm";
import BookCard from "@/components/BookCard";

interface BookInfo {
  no: number;
  bookname: string;
  authors: string;
  publisher: string;
  publication_year: string;
  isbn13: string;
  class_no: string;
  class_nm: string;
  bookImageURL: string;
  bookDtlUrl: string;
  loan_count: number;
}

export default function Home() {
  const [books, setBooks] = useState<BookInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchRegion, setSearchRegion] = useState("");
  const [searchDtlRegion, setSearchDtlRegion] = useState("");
  const [searchSort, setSearchSort] = useState("accuracy");
  const [error, setError] = useState<string | null>(null);

  const PAGE_SIZE = 10;

  const handleSearch = async (
    keyword: string,
    region: string,
    dtlRegion: string,
    sort: string,
    page = 1
  ) => {
    setIsLoading(true);
    setError(null);
    setSearchKeyword(keyword);
    setSearchRegion(region);
    setSearchDtlRegion(dtlRegion);
    setSearchSort(sort);
    setCurrentPage(page);

    try {
      const params = new URLSearchParams({
        keyword,
        pageNo: String(page),
        pageSize: String(PAGE_SIZE),
      });
      if (region) params.set("region", region);
      if (sort && sort !== "accuracy") params.set("sort", sort);

      const response = await fetch(`/api/search?${params.toString()}`);
      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setBooks(data.books ?? []);
      setTotalCount(data.totalCount ?? 0);
      setHasSearched(true);
    } catch (err) {
      console.error("검색 실패:", err);
      setError(
        err instanceof Error ? err.message : "검색 중 오류가 발생했습니다."
      );
      setBooks([]);
    } finally {
      setIsLoading(false);
    }
  };

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  return (
    <div className="min-h-screen">
      {/* 검색 영역 */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <p className="mb-4 text-sm text-gray-500">
            읽고 싶은 주제를 입력하면, 주변 도서관에서 대출 가능한 책을
            찾아드립니다.
          </p>
          <SearchForm
            onSearch={(keyword, region, dtlRegion, sort) =>
              handleSearch(keyword, region, dtlRegion, sort, 1)
            }
            isLoading={isLoading}
          />
        </div>
      </div>

      {/* 결과 영역 */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            <strong>오류:</strong> {error}
          </div>
        )}

        {!hasSearched && !isLoading && (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-50 rounded-full mb-4">
              <svg
                className="w-10 h-10 text-blue-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-700">
              어떤 책을 찾고 계신가요?
            </h2>
            <p className="mt-2 text-gray-500 max-w-md mx-auto">
              책 제목뿐만 아니라 &quot;독서법&quot;, &quot;자기계발&quot;,
              &quot;한국사&quot; 같은 주제로도 검색할 수 있습니다. 지역을 선택하면
              해당 지역 도서관의 소장 여부를 확인할 수 있습니다.
            </p>
          </div>
        )}

        {hasSearched && books.length === 0 && !isLoading && (
          <div className="text-center py-16">
            <p className="text-gray-500">
              &quot;{searchKeyword}&quot;에 대한 검색 결과가 없습니다.
            </p>
            <p className="mt-1 text-sm text-gray-400">
              다른 키워드로 검색해 보세요.
            </p>
          </div>
        )}

        {hasSearched && books.length > 0 && (
          <>
            <div className="mb-4 text-sm text-gray-600">
              &quot;{searchKeyword}&quot; 검색 결과{" "}
              <strong>{totalCount.toLocaleString()}</strong>건
            </div>

            <div className="space-y-4">
              {books.map((book) => (
                <BookCard
                  key={`${book.isbn13}-${book.no}`}
                  book={book}
                  region={searchRegion}
                  dtlRegion={searchDtlRegion}
                />
              ))}
            </div>

            {/* 페이지네이션 */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center items-center gap-2">
                <button
                  onClick={() =>
                    handleSearch(
                      searchKeyword,
                      searchRegion,
                      searchDtlRegion,
                      searchSort,
                      currentPage - 1
                    )
                  }
                  disabled={currentPage <= 1 || isLoading}
                  className="px-3 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  이전
                </button>

                {Array.from(
                  { length: Math.min(5, totalPages) },
                  (_, i) => {
                    let page: number;
                    if (totalPages <= 5) {
                      page = i + 1;
                    } else if (currentPage <= 3) {
                      page = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      page = totalPages - 4 + i;
                    } else {
                      page = currentPage - 2 + i;
                    }
                    return page;
                  }
                ).map((page) => (
                  <button
                    key={page}
                    onClick={() =>
                      handleSearch(
                        searchKeyword,
                        searchRegion,
                        searchDtlRegion,
                        searchSort,
                        page
                      )
                    }
                    disabled={isLoading}
                    className={`px-3 py-2 text-sm rounded-lg border ${
                      page === currentPage
                        ? "bg-blue-600 text-white border-blue-600"
                        : "border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() =>
                    handleSearch(
                      searchKeyword,
                      searchRegion,
                      searchDtlRegion,
                      searchSort,
                      currentPage + 1
                    )
                  }
                  disabled={currentPage >= totalPages || isLoading}
                  className="px-3 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  다음
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* 푸터 */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-5xl mx-auto px-4 py-6 text-center text-xs text-gray-400">
          <p>
            본 서비스는{" "}
            <a
              href="https://www.data4library.kr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              도서관 정보나루
            </a>
            (국립중앙도서관) Open API를 활용합니다.
          </p>
        </div>
      </footer>
    </div>
  );
}
