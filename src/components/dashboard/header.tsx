"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Briefcase, Calendar, Home, LogOut, Menu, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { logout } from "@/app/actions";
import { ThemeToggle } from "../theme-toggle";

const navItems = [
  { href: "/dashboard", label: "Início", icon: Home },
  { href: "/dashboard/edicoes", label: "Edições", icon: Calendar },
  { href: "/dashboard/setores", label: "Setores", icon: Briefcase },
  { href: "/dashboard/tribos", label: "Tribos", icon: Shield },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Abrir menu de navegação</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col">
          <nav className="grid gap-2 text-lg font-medium">
            <Link
              href="/"
              className="flex items-center gap-2 text-lg font-semibold mb-4"
            >
              <span className="">HdH Acampamento</span>
            </Link>
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground",
                  { "bg-muted text-foreground": pathname === href }
                )}
              >
                <Icon className="h-5 w-5" />
                {label}
              </Link>
            ))}
          </nav>
          <div className="mt-auto space-y-2">
            <ThemeToggle />
            <form action={logout}>
              <Button variant="ghost" className="w-full justify-start text-lg font-medium">
                <LogOut className="mr-4 h-5 w-5" />
                Sair
              </Button>
            </form>
          </div>
        </SheetContent>
      </Sheet>
      <div className="w-full flex-1">
        <h1 className="text-lg font-semibold">HdH Acampamento</h1>
      </div>
    </header>
  );
}