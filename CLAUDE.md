# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Korean library book finder service ("내 주변 도서관 책 찾기"). Users search for books and find nearby libraries that have them available for loan. Built on the **정보나루 (data4library.kr) Open API** from the National Library of Korea.

## Commands

```bash
npm run dev      # Start dev server (Next.js)
npm run build    # Production build
npm run lint     # ESLint
npm start        # Start production server
```

## Environment

Requires `DATA4LIBRARY_AUTH_KEY` env var (정보나루 API auth key).

## Architecture

**Next.js 14 App Router** with TypeScript and Tailwind CSS. No external state management or component libraries.

### API Layer (`src/lib/api-client.ts` → `src/app/api/`)

All external API calls go through `api-client.ts`, which wraps the 정보나루 REST API with 5-minute revalidation cache. The Next.js API routes in `src/app/api/` are thin wrappers that call `api-client.ts` functions and reshape responses for the frontend.

Key API endpoints:
- `/api/search` — book keyword search (`srchBooks`)
- `/api/libraries` — find libraries holding a specific ISBN (`libSrchByBook`) + availability check (`bookExist`)
- `/api/availability` — single library book availability
- `/api/book-detail` — book detail + recommendations (`srchDtlList`, `recommandList`)
- `/api/popular` — popular loan books (`loanItemSrch`)

### Pages

- `/` — main search page with pagination
- `/book/[isbn]` — book detail with library availability list, map, and recommendations
- `/popular` — popular books by region/category (KDC classification)
- `/bookmarks` — localStorage-based bookmarks

### Key Libraries (`src/lib/`)

- `regions.ts` — Korean region/sub-region code mappings for 정보나루 API
- `kdc.ts` — Korean Decimal Classification codes
- `bookmarks.ts` — localStorage bookmark persistence

### Components

- `BookCard` — book result card, fetches library availability on expand
- `LibraryMap` — Kakao Maps integration for library locations
- `RegionSelect` — cascading region/sub-region dropdown
- `SearchForm` — search input with region and sort options

### External Dependencies

- **Kakao Maps JS SDK** — loaded via script tag in `LibraryMap` component for displaying library locations
- **정보나루 API** — all book/library data source
