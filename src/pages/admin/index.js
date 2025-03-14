// This file has been moved to src/app/admin/page.js
// The entire src/pages directory is deprecated and will be removed
// This is a placeholder to prevent immediate build errors 
// but should be deleted once migration is complete

export default function DeprecatedAdmin() {
  // Redirect to the new route
  if (typeof window !== 'undefined') {
    window.location.href = '/admin';
  }
  return null;
}
