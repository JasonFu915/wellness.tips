# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added
- **PWA Support**: Added `manifest.js` and `icon.tsx` for Progressive Web App capabilities.
- **Headline Strategy**: Implemented "Hook + Value" strategy in content generation script (`scripts/generate_daily_tip.py`).
- **Image Search**: Added `image_search_query` field to AI generation for more accurate Unsplash image matching.

### Changed
- **Pagination**: Updated `postsPerPage` from 10 to 9 in `lib/posts.js` to align with the 3-column grid layout.
- **SEO**: Fixed hardcoded description in `app/[lang]/layout.js` to support multi-language metadata.
- **UI**: Fixed `z-index` issue in `app/[lang]/page.js` to prevent the search dropdown from being clipped by the Hero section.
- **Git**: Removed `requirements.txt` and `scripts/*.py` from git tracking (cached removal) while keeping local files.

### Fixed
- **Script**: Fixed `SyntaxError` in `scripts/generate_daily_tip.py` caused by triple-quoted strings.
