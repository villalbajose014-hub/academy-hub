import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { useAuth } from "@/lib/auth-context";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { userName, role } = useAuth();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-16 flex items-center justify-between border-b border-border/50 px-4 md:px-6 flex-shrink-0 backdrop-blur-sm bg-background/80">
            <div className="flex items-center gap-3">
              <SidebarTrigger />
              <div className="hidden sm:block">
                <p className="text-sm font-semibold text-foreground">
                  {role === "mentor" ? "Command Center" : "Mi Panel"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">
                {userName?.slice(0, 2).toUpperCase() || "U"}
              </div>
            </div>
          </header>
          <main className="flex-1 overflow-auto p-4 md:p-8">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
