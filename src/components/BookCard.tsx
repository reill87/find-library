"use client";

import { useState } from "react";
import Link from "next/link";
import LibraryList from "./LibraryList";
import BookmarkButton from "./BookmarkButton";

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

interface LibraryInfo {
  libCode: string;
  libName: string;
  address: string;
  tel: string;
  latitude: string;
  longitude: string;
  homepage: string;
  closed: string;
  operatingTime: string;
  hasBook: boolean;
  loanAvailable: boolean;
}

interface BookCardProps {
  book: BookInfo;
  region: string;
  dtlRegion: string;
}

export default function BookCard({ book, region, dtlRegion }: BookCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [libraries, setLibraries] = useState<LibraryInfo[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const handleToggle = async () => {
    if (!expanded && !loaded) {
      setExpanded(true);
      setIsLoading(true);
      try {
        const params = new URLSearchParams({ isbn13: book.isbn13 });
        if (region) params.set("region", region);
        if (dtlRegion) params.set("dtl_region", dtlRegion);

        const response = await fetch(`/api/libraries?${params.toString()}`);
        const data = await response.json();

        if (data.error) {
          throw new Error(data.error);
        }

        setLibraries(data.libraries ?? []);
        setTotalCount(data.totalCount ?? 0);
        setLoaded(true);
      } catch (error) {
        console.error("도서관 검색 실패:", error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setExpanded(!expanded);
    }
  };

  const cleanTitle = book.bookname.replace(/<[^>]*>/g, "");

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
      <div className="flex gap-4">
        {/* 책 이미지 */}
        <div className="flex-shrink-0">
          {book.bookImageURL ? (
            <img
              src={book.bookImageURL}
              alt={cleanTitle}
              className="w-24 h-32 object-cover rounded-lg shadow-sm"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          ) : (
            <div className="w-24 h-32 bg-gray-100 rounded-lg flex items-center justify-center">
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
        </div>

        {/* 책 정보 */}
        <div className="flex-1 min-w-0">
          <Link
            href={`/book/${book.isbn13}`}
            className="text-lg font-semibold text-gray-900 leading-tight hover:text-blue-600 transition-colors"
          >
            {cleanTitle}
          </Link>
          <div className="mt-1.5 space-y-0.5 text-sm text-gray-600">
            <p>
              <span className="text-gray-400">저자</span>{" "}
              {book.authors || "-"}
            </p>
            <p>
              <span className="text-gray-400">출판</span>{" "}
              {book.publisher || "-"}
              {book.publication_year && ` (${book.publication_year})`}
            </p>
            {book.class_nm && (
              <p>
                <span className="text-gray-400">분류</span> {book.class_nm}
              </p>
            )}
          </div>

          <div className="mt-3 flex items-center gap-2 flex-wrap">
            <button
              onClick={handleToggle}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                expanded
                  ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"
                />
              </svg>
              {expanded ? "도서관 숨기기" : "소장 도서관 찾기"}
            </button>
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
            {book.loan_count > 0 && (
              <span className="text-xs text-gray-400">
                누적 대출 {book.loan_count.toLocaleString()}회
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 도서관 목록 */}
      {expanded && (
        <LibraryList
          libraries={libraries}
          totalCount={totalCount}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}
