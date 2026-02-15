"use client";

import { useState, useEffect } from "react";
import {
  isBookmarked,
  addBookmark,
  removeBookmark,
} from "@/lib/bookmarks";

interface BookmarkButtonProps {
  book: {
    isbn13: string;
    bookname: string;
    authors: string;
    publisher: string;
    publication_year: string;
    bookImageURL: string;
    class_nm: string;
  };
}

export default function BookmarkButton({ book }: BookmarkButtonProps) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(isBookmarked(book.isbn13));
  }, [book.isbn13]);

  const toggle = () => {
    if (saved) {
      removeBookmark(book.isbn13);
      setSaved(false);
    } else {
      addBookmark(book);
      setSaved(true);
    }
  };

  return (
    <button
      onClick={toggle}
      title={saved ? "즐겨찾기 해제" : "즐겨찾기 추가"}
      className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
        saved
          ? "border-yellow-300 bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
          : "border-gray-300 bg-white text-gray-500 hover:bg-gray-50"
      }`}
    >
      <svg
        className="w-3.5 h-3.5"
        fill={saved ? "currentColor" : "none"}
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
        />
      </svg>
      {saved ? "저장됨" : "즐겨찾기"}
    </button>
  );
}
