'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { projects } from '@/lib/data';
import { cn } from '@/lib/utils';
import { BrainCircuit, Bot, MessageSquare, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

const navItems = [
  { href: '/dashboard/chat', icon: MessageSquare, label: 'Chat' },
  { href: '/dashboard/memory', icon: BrainCircuit, label: 'Memory' },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2 p-2">
           <Image src="/logo.svg" alt="Ani AI Logo" width={32} height={32} />
          <div className="text-lg font-semibold tracking-tight group-data-[collapsible=icon]:hidden">
            Ani AI
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-2">
        <div className="mb-2">
           <Select defaultValue={projects[0].id}>
              <SelectTrigger className="h-10 group-data-[collapsible=icon]:w-10 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center">
                <div className="flex items-center gap-2 group-data-[collapsible=icon]:hidden">
                    <span className="inline-block w-2 h-2 bg-primary rounded-full"></span>
                    <SelectValue placeholder="Select a project" />
                </div>
                <ChevronDown className="h-4 w-4 opacity-50 group-data-[collapsible=icon]:hidden"/>
              </SelectTrigger>
              <SelectContent>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
        </div>

        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} legacyBehavior passHref>
                <SidebarMenuButton
                  isActive={pathname === item.href}
                  tooltip={{ children: item.label, side: 'right' }}
                >
                  <item.icon />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-2">
        {/* Can add footer items here, e.g. settings, help */}
      </SidebarFooter>
    </>
  );
}
