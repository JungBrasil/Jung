"use client";

import { useRole } from "@/hooks/use-role";
import { UserRole } from "@/lib/auth";

interface RoleGateProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

export function RoleGate({ children, allowedRoles }: RoleGateProps) {
  const { role } = useRole();

  if (!role || !allowedRoles.includes(role)) {
    return null;
  }

  return <>{children}</>;
}