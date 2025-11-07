/**
 * System/Admin Layout
 * Layout with sidebar navigation for admin area
 */

import { ReactNode } from "react";
import { SysLayoutClient as SystemLayoutClient } from "./SystemLayoutClient";

interface SysLayoutProps {
  children: ReactNode;
}

export default function SysLayout({ children }: SysLayoutProps) {
  return <SystemLayoutClient>{children}</SystemLayoutClient>;
}
