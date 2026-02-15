export interface BookmarkItem {
  isbn13: string;
  bookname: string;
  authors: string;
  publisher: string;
  publication_year: string;
  bookImageURL: string;
  class_nm: string;
  savedAt: string;
}

const STORAGE_KEY = "library-bookmarks";

export function getBookmarks(): BookmarkItem[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function addBookmark(book: Omit<BookmarkItem, "savedAt">): void {
  const bookmarks = getBookmarks();
  if (!bookmarks.find((b) => b.isbn13 === book.isbn13)) {
    bookmarks.unshift({ ...book, savedAt: new Date().toISOString() });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
  }
}

export function removeBookmark(isbn13: string): void {
  const bookmarks = getBookmarks().filter((b) => b.isbn13 !== isbn13);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
}

export function isBookmarked(isbn13: string): boolean {
  return getBookmarks().some((b) => b.isbn13 === isbn13);
}
