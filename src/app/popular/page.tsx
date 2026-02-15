"use client";

import { useState } from "react";
import Link from "next/link";
import RegionSelect from "@/components/RegionSelect";
import BookmarkButton from "@/components/BookmarkButton";
import { KDC_CATEGORIES } from "@/lib/kdc";

interface PopularBook {
  no: number;
  ranking: string;
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

export default function PopularPage() {
  const [books, setBooks] = useState<PopularBook[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [region, setRegion] = useState("");
  const [dtlRegion, setDtlRegion] = useState("");
  const [kdc, setKdc] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({ pageSize: "20" });
      if (region) params.set("region", region);
      if (dtlRegion) params.set("dtl_region", dtlRegion);
      if (kdc) params.set("kdc", kdc);

      const response = await fetch(`/api/popular?${params.toString()}`);
      const data = await response.json();

      if (data.error) throw new Error(data.error);

      setBooks(data.books ?? []);
      setHasSearched(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "인기 도서를 불러올 수 없습니다."
      );
      setBooks([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">인기 도서</h1>
      <p className="text-sm text-gray-500 mb-6">
        지역별, 분류별 인기 대출 도서를 확인하세요.
      </p>

      {/* 필터 영역 */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-8">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-sm text-gray-600 font-medium w-16">
              지역
            </span>
            <RegionSelect
              region={region}
              dtlRegion={dtlRegion}
              onRegionChange={setRegion}
              onDtlRegionChange={setDtlRegion}
            />
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-sm text-gray-600 font-medium w-16">
              분류
            </span>
            <select
              value={kdc}
              onChange={(e) => setKdc(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">전체 분류</option>
              {KDC_CATEGORIES.map((cat) => (
                <option key={cat.code} value={cat.code}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleSearch}
            disabled={isLoading}
            className="self-start px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium text-sm"
          >
            {isLoading ? "조회 중..." : "인기 도서 조회"}
          </button>
        </div>
      </div>

      {/* 에러 */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          <strong>오류:</strong> {error}
        </div>
      )}

      {/* 초기 상태 */}
      {!hasSearched && !isLoading && (
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-50 rounded-full mb-4">
            <svg
              className="w-10 h-10 text-orange-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-700">
            어떤 인기 도서를 찾고 계신가요?
          </h2>
          <p className="mt-2 text-gray-500 max-w-md mx-auto">
            지역이나 분류를 선택하고 조회 버튼을 눌러주세요. 최근 인기 대출
            도서 순위를 확인할 수 있습니다.
          </p>
        </div>
      )}

      {/* 결과 없음 */}
      {hasSearched && books.length === 0 && !isLoading && (
        <div className="text-center py-16">
          <p className="text-gray-500">조건에 맞는 인기 도서가 없습니다.</p>
        </div>
      )}

      {/* 인기 도서 목록 */}
      {books.length > 0 && (
        <div className="space-y-3">
          {books.map((book, index) => {
            const cleanTitle = book.bookname.replace(/<[^>]*>/g, "");
            return (
              <div
                key={`${book.isbn13}-${index}`}
                className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow flex gap-4"
              >
                {/* 순위 */}
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                  {book.ranking || index + 1}
                </div>

                {/* 이미지 */}
                <div className="flex-shrink-0">
                  {book.bookImageURL ? (
                    <img
                      src={book.bookImageURL}
                      alt={cleanTitle}
                      className="w-16 h-22 object-cover rounded"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="w-16 h-22 bg-gray-100 rounded flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                        />
                      </svg>
                    </div>
                  )}
                </div>

                {/* 정보 */}
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/book/${book.isbn13}`}
                    className="text-base font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-1"
                  >
                    {cleanTitle}
                  </Link>
                  <div className="mt-1 text-sm text-gray-500">
                    <span>{book.authors || "-"}</span>
                    <span className="mx-1 text-gray-300">|</span>
                    <span>{book.publisher}</span>
                    {book.publication_year && (
                      <span> ({book.publication_year})</span>
                    )}
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    {book.loan_count > 0 && (
                      <span className="text-xs text-gray-400">
                        대출 {book.loan_count.toLocaleString()}회
                      </span>
                    )}
                    <BookmarkButton
                      book={{
                        isbn13: book.isbn13,
                        bookname: book.bookname,
                        authors: book.authors,
                        publisher: book.publisher,
                        publication_year: book.publication_year,
                        bookImageURL: book.bookImageURL,
                        class_nm: book.class_nm,
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
