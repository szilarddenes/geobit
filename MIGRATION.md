# Migrating from Pages Router to App Router

This project is in the process of migrating from Next.js Pages Router (`src/pages`) to App Router (`src/app`).

## Migration Status

- ✅ Admin main page (`/admin`) - Migrated to `src/app/admin/page.js`
- ⏳ Other admin routes - Still using Pages Router temporarily

## How to Fix Compilation Errors

If you encounter compilation errors like:

```
Conflicting app and page file was found, please remove the conflicting files to continue:
"src/pages/admin/index.js" - "src/app/admin/page.js"
```

This is because Next.js doesn't allow the same route to exist in both the Pages Router and App Router.

### Solution

1. **Remove outdated files**: Delete the file in `src/pages/` that conflicts with your `src/app/` implementation
2. **Clean build directory**: Delete the `.next` folder and run `npm run build` again

## Migration Guide

When migrating a page from Pages Router to App Router:

1. Create the new file in `src/app/` following the App Router conventions
2. Update the existing file in `src/pages/` with a redirect placeholder
3. Once the App Router version is working, delete the placeholder in `src/pages/`

## Preventing Nested App Structures

The project is configured to prevent nested app folders like `src/app/app/admin` that cause build errors:

- `.gitignore` has entries to prevent nested app folders
- `.cursorrules` has validation rules for proper structure
- `next.config.js` has settings to prioritize App Router

## Long-term Plan

The entire `src/pages` directory will eventually be removed once migration is complete.
