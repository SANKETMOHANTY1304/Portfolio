import type { SVGProps } from "react";
type Props = SVGProps<SVGSVGElement> & { size?: number };
export function Github({ size = 20, ...props }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M9 19c-4.5 1.3-4.5-2.5-6.3-3M15.5 22v-3.4a3 3 0 0 0-.9-2.4c3.2-.4 6.5-1.6 6.5-7.1a5.5 5.5 0 0 0-1.5-3.8 5 5 0 0 0-.1-3.8s-1.2-.4-4 1.5a13.8 13.8 0 0 0-7 0c-2.8-1.9-4-1.5-4-1.5a5 5 0 0 0-.1 3.8A5.5 5.5 0 0 0 2.9 9c0 5.5 3.3 6.7 6.5 7.1a3 3 0 0 0-.9 2.4V22" />
    </svg>
  );
}
export function Linkedin({ size = 20, ...props }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M7 10v7m4-7v7m0-4a3 3 0 0 1 6 0v4" />
      <circle cx="7" cy="7" r=".8" fill="currentColor" stroke="none" />
    </svg>
  );
}
