import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseMiddlewareClient } from "@/lib/supabase/middleware";
import { getUserRole } from "./lib/auth";

const ADMIN_ONLY_PATHS = [
  "/dashboard/edicoes",
  "/dashboard/setores",
  "/dashboard/tribos",
];

export async function middleware(request: NextRequest) {
  const { supabase, response } = createSupabaseMiddlewareClient(request);

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { pathname } = request.nextUrl;

  // Se não houver sessão e o usuário tentar acessar o dashboard, redirecione para o login
  if (!session && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Se houver sessão e o usuário tentar acessar a página de login, redirecione para o dashboard
  if (session && pathname === "/login") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Proteção de rotas baseada em função
  if (session && pathname.startsWith("/dashboard")) {
    const role = await getUserRole();
    
    if (role !== 'admin' && ADMIN_ONLY_PATHS.some(path => pathname.startsWith(path))) {
       // Redireciona para o dashboard principal se não for admin
       return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};