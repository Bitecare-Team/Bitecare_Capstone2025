
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { SidebarNav } from "./sidebar-nav";
import { Header } from "./header";
import { cn } from "@/lib/utils";

export function AppLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed((prev) => !prev);
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={cn(
          "bg-muted border-r transition-all duration-300 ease-in-out",
          sidebarCollapsed ? "w-[60px]" : "w-[250px]"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo area */}
          <div className={cn(
            "h-16 border-b flex items-center px-4 transition-all duration-300",
            sidebarCollapsed ? "justify-center" : "justify-start"
          )}>
            {sidebarCollapsed ? (
              <span className="text-2xl font-bold text-primary">DD</span>
            ) : (
              <span className="text-xl font-semibold text-primary">
                DoseDash <span className="text-healthcare-secondary">RHU</span>
              </span>
            )}
          </div>
          
          {/* Navigation */}
          <SidebarNav collapsed={sidebarCollapsed} className="px-2" />
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onToggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
