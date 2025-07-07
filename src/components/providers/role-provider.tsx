"use client";

import { createContext } from "react";
import { UserRole } from "@/lib/auth";

interface RoleContextType {
  role: UserRole;
}

export const RoleContext = createContext<RoleContextType | undefined>(undefined);

interface RoleProviderProps {
  children: React.ReactNode;
  role: UserRole;
}

export function RoleProvider({ children, role }: RoleProviderProps) {
  return (
    <RoleContext.Provider value={{ role }}>
      {children}
    </RoleContext.Provider>
  );
}