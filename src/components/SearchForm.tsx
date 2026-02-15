"use client";

import { useState, FormEvent } from "react";
import RegionSelect from "./RegionSelect";

interface SearchFormProps {
  onSearch: (keyword: string, region: string, dtlRegion: string) => void;
  isLoading: boolean;
}

export default function SearchForm({ onSearch, isLoading }: SearchFormProps) {
  const [keyword, setKeyword] = useState("");
  const [region, setRegion] = useState("");
  const [dtlRegion, setDtlRegion] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!keyword.trim()) return;
    onSearch(keyword.trim(), region, dtlRegion);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto">
      <div className="flex flex-col gap-4">
        <div className="relative">
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="읽고 싶은 주제나 키워드를 입력하세요 (예: 독서법, 자기계발, 한국사)"
            className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !keyword.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg
                  className="animate-spin h-4 w-4"
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
                검색 중
              </span>
            ) : (
              "검색"
            )}
          </button>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-sm text-gray-600 font-medium">지역 선택:</span>
          <RegionSelect
            region={region}
            dtlRegion={dtlRegion}
            onRegionChange={setRegion}
            onDtlRegionChange={setDtlRegion}
          />
        </div>
      </div>
    </form>
  );
}
