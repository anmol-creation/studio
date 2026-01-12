'use client';

import { SidebarTrigger } from '@/components/ui/sidebar';
import { usePathname } from 'next/navigation';
import { UserNav } from './user-nav';

export function Header() {
  const pathname = usePathname();

  const getTitle = () => {
    if (pathname.includes('/memory')) return 'Memory';
    if (pathname.includes('/chat')) return 'Chat';
    return 'Dashboard';
  };

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
      <div className="md:hidden">
        <SidebarTrigger />
      </div>
      <h1 className="text-xl font-semibold">{getTitle()}</h1>
      <div className="ml-auto flex items-center gap-4">
        <UserNav />
      </div>
    </header>
  );
}
