export function Logo({ className, width = 40, height = 40 }) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="GeoBit Logo"
    >
      {/* Earth/Globe element */}
      <circle cx="50" cy="50" r="45" fill="#2A6D82" />
      <path
        d="M25 50C25 36.19 36.19 25 50 25C63.81 25 75 36.19 75 50C75 63.81 63.81 75 50 75C36.19 75 25 63.81 25 50Z"
        fill="#4A8FA6"
      />
      
      {/* Grid lines representing latitude/longitude */}
      <path
        d="M30 50H70"
        stroke="#E6E6E6"
        strokeWidth="1"
        strokeDasharray="2 2"
      />
      <path
        d="M50 30V70"
        stroke="#E6E6E6"
        strokeWidth="1"
        strokeDasharray="2 2"
      />
      <path
        d="M35 35C40.5228 29.4772 59.4772 29.4772 65 35C70.5228 40.5228 70.5228 59.4772 65 65C59.4772 70.5228 40.5228 70.5228 35 65C29.4772 59.4772 29.4772 40.5228 35 35Z"
        stroke="#E6E6E6"
        strokeWidth="1"
        strokeDasharray="3 3"
      />
      
      {/* Binary/Digital overlay element */}
      <path
        d="M45 42H48V45H45V42Z"
        fill="#F0F0F0"
      />
      <path
        d="M52 42H55V45H52V42Z"
        fill="#F0F0F0"
      />
      <path
        d="M45 52H48V55H45V52Z"
        fill="#F0F0F0"
      />
      <path
        d="M52 52H55V55H52V52Z"
        fill="#F0F0F0"
      />
      <path
        d="M58 47H61V50H58V47Z"
        fill="#F0F0F0"
      />
      <path
        d="M39 47H42V50H39V47Z"
        fill="#F0F0F0"
      />
      <path
        d="M45 60H55V63H45V60Z"
        fill="#F0F0F0"
      />
    </svg>
  );
} 