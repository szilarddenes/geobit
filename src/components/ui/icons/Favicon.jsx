export function Favicon({ className, width = 32, height = 32 }) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Simplified version of the logo for smaller sizes */}
      <circle cx="16" cy="16" r="15" fill="#2A6D82" />
      <circle cx="16" cy="16" r="10" fill="#4A8FA6" />
      
      {/* Simplified grid lines */}
      <path
        d="M8 16H24"
        stroke="#E6E6E6"
        strokeWidth="0.5"
      />
      <path
        d="M16 8V24"
        stroke="#E6E6E6"
        strokeWidth="0.5"
      />
      
      {/* Simplified binary elements */}
      <rect x="13" y="13" width="2" height="2" fill="#F0F0F0" />
      <rect x="17" y="13" width="2" height="2" fill="#F0F0F0" />
      <rect x="13" y="17" width="2" height="2" fill="#F0F0F0" />
      <rect x="17" y="17" width="2" height="2" fill="#F0F0F0" />
    </svg>
  );
} 