"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import BookmarkButton from "@/components/BookmarkButton";

interface BookDetail {
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

interface RecommendedBook {
  bookname: string;
  authors: string;
  publisher: string;
  publication_year: string;
  isbn13: string;
  bookImageURL: string;
}

export default function BookDetailPage() {
  const params = useParams();
  const isbn = params.isbn as string;

  const [detail, setDetail] = useState<BookDetail | null>(null);
  const [recommendations, setRecommendations] = useState<RecommendedBook[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isbn) return;

    async function fetchDetail() {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/book-detail?isbn13=${isbn}`);
        const data = await response.json();

        if (data.error) throw new Error(data.error);

        setDetail(data.detail);
        setRecommendations(data.recommendations ?? []);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "도서 정보를 불러올 수 없습니다."
        );
      } finally {
        setIsLoading(false);
      }
    }

    fetchDetail();
  }, [isbn]);

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="flex items-center gap-2 text-gray-500">
          <svg
            className="animate-spin h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          도서 정보를 불러오는 중...
        </div>
      </div>
    );
  }

  if (error || !detail) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error || "도서 정보를 찾을 수 없습니다."}
        </div>
        <Link
          href="/"
          className="inline-block mt-4 text-blue-600 hover:underline text-sm"
        >
          검색으로 돌아가기
        </Link>
      </div>
    );
  }

  const cleanTitle = detail.bookname.replace(/<[^>]*>/g, "");

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* 뒤로가기 */}
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19l-7-7 7-7"
          />
        </svg>
        검색으로 돌아가기
      </Link>

      {/* 도서 상세 정보 */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex gap-6 flex-col sm:flex-row">
          {/* 책 이미지 */}
          <div className="flex-shrink-0">
            {detail.bookImageURL ? (
              <img
                src={detail.bookImageURL}
                alt={cleanTitle}
                className="w-48 h-64 object-cover rounded-lg shadow-md"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            ) : (
              <div className="w-48 h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-gray-400"
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

          {/* 책 정보 */}
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 leading-tight">
              {cleanTitle}
            </h1>

            <div className="mt-4 space-y-2 text-sm">
              <div className="flex gap-2">
                <span className="text-gray-400 w-16 flex-shrink-0">저자</span>
                <span className="text-gray-700">
                  {detail.authors || "-"}
                </span>
              </div>
              <div className="flex gap-2">
                <span className="text-gray-400 w-16 flex-shrink-0">출판사</span>
                <span className="text-gray-700">
                  {detail.publisher || "-"}
                </span>
              </div>
              <div className="flex gap-2">
                <span className="text-gray-400 w-16 flex-shrink-0">출판년</span>
                <span className="text-gray-700">
                  {detail.publication_year || "-"}
                </span>
              </div>
              <div className="flex gap-2">
                <span className="text-gray-400 w-16 flex-shrink-0">ISBN</span>
                <span className="text-gray-700 font-mono text-xs">
                  {detail.isbn13}
                </span>
              </div>
              {detail.class_nm && (
                <div className="flex gap-2">
                  <span className="text-gray-400 w-16 flex-shrink-0">분류</span>
                  <span className="text-gray-700">{detail.class_nm}</span>
                </div>
              )}
              {detail.loanCnt > 0 && (
                <div className="flex gap-2">
                  <span className="text-gray-400 w-16 flex-shrink-0">대출</span>
                  <span className="text-gray-700">
                    누적 {detail.loanCnt.toLocaleString()}회
                  </span>
                </div>
              )}
            </div>

            <div className="mt-4">
              <BookmarkButton
                book={{
                  isbn13: detail.isbn13,
                  bookname: detail.bookname,
                  authors: detail.authors,
                  publisher: detail.publisher,
                  publication_year: detail.publication_year,
                  bookImageURL: detail.bookImageURL,
                  class_nm: detail.class_nm,
                }}
              />
            </div>
          </div>
        </div>

        {/* 도서 소개 */}
        {detail.description && (
          <div className="mt-6 pt-6 border-t border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              도서 소개
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
              {detail.description}
            </p>
          </div>
        )}
      </div>

      {/* 추천 도서 */}
      {recommendations.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            이 책을 읽은 사람들이 함께 읽은 책
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {recommendations.map((book) => {
              const title = book.bookname.replace(/<[^>]*>/g, "");
              return (
                <Link
                  key={book.isbn13}
                  href={`/book/${book.isbn13}`}
                  className="group bg-white rounded-lg border border-gray-200 p-3 hover:shadow-md transition-shadow"
                >
                  {book.bookImageURL ? (
                    <img
                      src={book.bookImageURL}
                      alt={title}
                      className="w-full h-40 object-cover rounded"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="w-full h-40 bg-gray-100 rounded flex items-center justify-center">
                      <svg
                        className="w-8 h-8 text-gray-400"
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
                  <h3 className="mt-2 text-xs font-medium text-gray-900 line-clamp-2 group-hover:text-blue-600">
                    {title}
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5 truncate">
                    {book.authors}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
