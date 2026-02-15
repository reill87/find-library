"use client";

interface LibraryInfo {
  libCode: string;
  libName: string;
  address: string;
  tel: string;
  homepage: string;
  closed: string;
  operatingTime: string;
  hasBook: boolean;
  loanAvailable: boolean;
}

interface LibraryListProps {
  libraries: LibraryInfo[];
  totalCount: number;
  isLoading: boolean;
}

export default function LibraryList({
  libraries,
  totalCount,
  isLoading,
}: LibraryListProps) {
  if (isLoading) {
    return (
      <div className="mt-3 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2 text-gray-500">
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
          소장 도서관을 검색하고 대출 가능 여부를 확인하는 중...
        </div>
      </div>
    );
  }

  if (libraries.length === 0) {
    return (
      <div className="mt-3 p-4 bg-gray-50 rounded-lg text-gray-500 text-sm">
        선택한 지역에서 이 도서를 소장한 도서관을 찾을 수 없습니다.
      </div>
    );
  }

  const availableCount = libraries.filter((l) => l.loanAvailable).length;

  return (
    <div className="mt-3 space-y-2">
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
        <span>
          총 <strong>{totalCount}</strong>개 도서관 소장
        </span>
        {availableCount > 0 && (
          <span className="text-green-600 font-medium">
            ({availableCount}곳 대출 가능)
          </span>
        )}
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {libraries.map((lib) => (
          <div
            key={lib.libCode}
            className={`p-3 rounded-lg border text-sm ${
              lib.loanAvailable
                ? "border-green-200 bg-green-50"
                : "border-gray-200 bg-gray-50"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900">
                    {lib.libName}
                  </span>
                  {lib.loanAvailable ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                      대출 가능
                    </span>
                  ) : lib.hasBook ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                      대출 중
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
                      미소장
                    </span>
                  )}
                </div>
                <p className="text-gray-500 mt-1 truncate">{lib.address}</p>
                <div className="flex items-center gap-4 mt-1 text-xs text-gray-400">
                  {lib.tel && <span>TEL: {lib.tel}</span>}
                  {lib.closed && <span>휴관: {lib.closed}</span>}
                </div>
              </div>
              {lib.homepage && (
                <a
                  href={
                    lib.homepage.startsWith("http")
                      ? lib.homepage
                      : `http://${lib.homepage}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-700 text-xs whitespace-nowrap"
                >
                  홈페이지
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {totalCount > libraries.length && (
        <p className="text-xs text-gray-400 text-center mt-2">
          상위 {libraries.length}개 도서관만 표시됩니다. (전체 {totalCount}개)
        </p>
      )}

      <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
        <p className="text-xs text-blue-700">
          <strong>상호대차 안내:</strong> 원하는 도서관에 책이 없더라도, 다른
          도서관에서 상호대차 서비스를 통해 대출받을 수 있습니다. 해당 도서관
          홈페이지에서 상호대차 신청이 가능한지 확인해 보세요.
        </p>
      </div>
    </div>
  );
}
