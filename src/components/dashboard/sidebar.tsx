"use client";

import Link from "next/link";
import {
  Bell,
  Home,
  Users,
  Calendar,
  Briefcase,
  BarChart3,
  Shield,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { RoleGate } from "@/components/auth/role-gate";

const navItems = [
  { href: "/dashboard", icon: Home, label: "Início" },
  { href: "/dashboard/edicoes", icon: Calendar, label: "Edições", roles: ['admin', 'editor', 'viewer'] },
  { href: "/dashboard/setores", icon: Briefcase, label: "Setores", roles: ['admin'] },
  { href: "/dashboard/tribos", icon: Shield, label: "Tribos", roles: ['admin'] },
  { href: "/dashboard/relatorios", icon: BarChart3, label: "Relatórios", roles: ['admin', 'editor'] },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Users className="h-6 w-6" />
            <span className="">Gestão HdH</span>
          </Link>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {navItems.map((item) => (
              <RoleGate key={item.href} allowedRoles={item.roles || ['admin', 'editor', 'viewer']}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                    pathname === item.href && "bg-muted text-primary"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              </RoleGate>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}