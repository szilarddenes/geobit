import Link from 'next/link';
import { Logo } from '../ui/icons';

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <div className="flex flex-1 items-center justify-start">
          <Link href="/" className="flex items-center space-x-2">
            <Logo className="h-8 w-8" />
            <span className="hidden font-bold sm:inline-block">
              GeoBit
            </span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end">
          {/* Navigation items can be added here */}
        </div>
      </div>
    </header>
  );
} 