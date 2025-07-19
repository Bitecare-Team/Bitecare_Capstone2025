
import { NavLink } from "react-router-dom";
import {
  Users,
  Calendar,
  ClipboardList,
  CreditCard,
  Settings,
  Home,
  PlusCircle,
  FileText,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useState } from "react";

interface SidebarNavProps {
  collapsed?: boolean;
  className?: string;
}

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/",
    icon: Home,
  },
  {
    title: "Patients",
    href: "/patients",
    icon: Users,
  },
  {
    title: "Appointments",
    href: "/appointments",
    icon: Calendar,
  },
  {
    title: "Slot Management",
    href: "/slots",
    icon: ClipboardList,
  },
  {
    title: "Payments",
    href: "/payments",
    icon: CreditCard,
  },
  {
    title: "Incidents",
    href: "/incidents",
    icon: AlertCircle,
  },
  {
    title: "Reports",
    href: "/reports",
    icon: FileText,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export function SidebarNav({ collapsed = false, className }: SidebarNavProps) {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(collapsed);

  return (
    <div className={cn("flex flex-col h-full", className)}>
      <div className="space-y-1 py-2">
        {navItems.map((item) => (
          <NavItem
            key={item.href}
            item={item}
            collapsed={isCollapsed}
          />
        ))}
      </div>
      <div className="mt-auto pb-4">
        <Button 
          variant="secondary" 
          className="w-full flex items-center justify-center gap-2"
          size={isCollapsed ? "icon" : "default"}
        >
          <PlusCircle className="h-4 w-4" />
          {!isCollapsed && <span>New Patient</span>}
        </Button>
      </div>
    </div>
  );
}

interface NavItemProps {
  item: NavItem;
  collapsed: boolean;
}

function NavItem({ item, collapsed }: NavItemProps) {
  if (collapsed) {
    return (
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <NavLink
            to={item.href}
            className={({ isActive }) =>
              cn(
                "flex h-9 w-9 items-center justify-center rounded-md hover:bg-muted transition-colors",
                isActive ? "bg-primary text-primary-foreground hover:bg-primary/90" : "transparent"
              )
            }
          >
            <item.icon className="h-5 w-5" />
            <span className="sr-only">{item.title}</span>
          </NavLink>
        </TooltipTrigger>
        <TooltipContent side="right">
          {item.title}
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <NavLink
      to={item.href}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-muted transition-colors",
          isActive ? "bg-primary text-primary-foreground hover:bg-primary/90" : "transparent"
        )
      }
    >
      <item.icon className="h-4 w-4" />
      {item.title}
    </NavLink>
  );
}
