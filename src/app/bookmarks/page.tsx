"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getBookmarks, removeBookmark, BookmarkItem } from "@/lib/bookmarks";

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);

  useEffect(() => {
    setBookmarks(getBookmarks());
  }, []);

  const handleRemove = (isbn13: string) => {
    removeBookmark(isbn13);
    setBookmarks(getBookmarks());
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">즐겨찾기</h1>
      <p className="text-sm text-gray-500 mb-6">
        저장한 관심 도서 목록입니다. ({bookmarks.length}권)
      </p>

      {bookmarks.length === 0 && (
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-yellow-50 rounded-full mb-4">
            <svg
              className="w-10 h-10 text-yellow-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-700">
            저장된 도서가 없습니다
          </h2>
          <p className="mt-2 text-gray-500 max-w-md mx-auto">
            검색 결과에서 즐겨찾기 버튼을 눌러 관심 도서를 저장해 보세요.
          </p>
          <Link
            href="/"
            className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
          >
            도서 검색하기
          </Link>
        </div>
      )}

      {bookmarks.length > 0 && (
        <div className="space-y-3">
          {bookmarks.map((book) => {
            const cleanTitle = book.bookname.replace(/<[^>]*>/g, "");
            return (
              <div
                key={book.isbn13}
                className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow flex gap-4"
              >
                {/* 이미지 */}
                <div className="flex-shrink-0">
                  {book.bookImageURL ? (
                    <img
                      src={book.bookImageURL}
                      alt={cleanTitle}
                      className="w-20 h-28 object-cover rounded-lg shadow-sm"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="w-20 h-28 bg-gray-100 rounded-lg flex items-center justify-center">
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
                    className="text-base font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                  >
                    {cleanTitle}
                  </Link>
                  <div className="mt-1 space-y-0.5 text-sm text-gray-500">
                    <p>{book.authors || "-"}</p>
                    <p>
                      {book.publisher}
                      {book.publication_year &&
                        ` (${book.publication_year})`}
                    </p>
                    {book.class_nm && (
                      <p className="text-xs text-gray-400">{book.class_nm}</p>
                    )}
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <Link
                      href={`/book/${book.isbn13}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium border border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                    >
                      상세보기
                    </Link>
                    <button
                      onClick={() => handleRemove(book.isbn13)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                    >
                      삭제
                    </button>
                  </div>
                </div>

                {/* 저장 날짜 */}
                <div className="flex-shrink-0 text-xs text-gray-400">
                  {new Date(book.savedAt).toLocaleDateString("ko-KR")}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
