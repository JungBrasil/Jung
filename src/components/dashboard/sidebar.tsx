"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Briefcase, Calendar, Home, LogOut, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { logout } from "@/app/actions";
import { ThemeToggle } from "../theme-toggle";
import { UserRole } from "@/lib/supabase/user";

const navItems = [
  { href: "/dashboard", label: "Início", icon: Home, requiredRole: ["admin", "editor", "viewer"] },
  { href: "/dashboard/edicoes", label: "Edições", icon: Calendar, requiredRole: ["admin", "editor", "viewer"] },
  { href: "/dashboard/setores", label: "Setores", icon: Briefcase, requiredRole: ["admin"] },
  { href: "/dashboard/tribos", label: "Tribos", icon: Shield, requiredRole: ["admin"] },
];

interface SidebarProps {
  userRole: UserRole;
}

export function Sidebar({ userRole }: SidebarProps) {
  const pathname = usePathname();

  const accessibleNavItems = navItems.filter(item => item.requiredRole.includes(userRole));

  return (
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span className="">HdH Acampamento</span>
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {accessibleNavItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                  { "bg-muted text-primary": pathname.startsWith(href) && (href !== '/dashboard' || pathname === '/dashboard') },
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="mt-auto p-4 space-y-2">
           <ThemeToggle />
           <form action={logout}>
            <Button variant="ghost" className="w-full justify-start">
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}