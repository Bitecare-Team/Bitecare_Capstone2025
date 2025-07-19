
import { useState } from "react";
import { Bell } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Notification, NotificationType } from "@/types";
import { notifications as mockNotifications } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export function NotificationList() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  
  const unreadCount = notifications.filter((notification) => !notification.read).length;
  
  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };
  
  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, read: true }))
    );
  };
  
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-[1.2rem] w-[1.2rem]" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-healthcare-critical text-[10px] text-white">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-medium">Notifications</h4>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead}>
              Mark all read
            </Button>
          )}
        </div>
        <ScrollArea className="h-[300px]">
          {notifications.length > 0 ? (
            <div className="space-y-2">
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onRead={() => markAsRead(notification.id)}
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              No notifications
            </p>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}

interface NotificationItemProps {
  notification: Notification;
  onRead: () => void;
}

function NotificationItem({ notification, onRead }: NotificationItemProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-2 p-2 rounded-lg cursor-pointer hover:bg-muted transition-colors",
        !notification.read && "bg-muted"
      )}
      onClick={onRead}
    >
      <div
        className={cn(
          "mt-1 p-1 rounded-full",
          notification.type === NotificationType.APPOINTMENT_REMINDER && "bg-healthcare-primary/20 text-healthcare-primary",
          notification.type === NotificationType.PAYMENT_REMINDER && "bg-healthcare-warning/20 text-healthcare-warning",
          notification.type === NotificationType.GENERAL && "bg-healthcare-secondary/20 text-healthcare-secondary"
        )}
      >
        <Bell className="h-3 w-3" />
      </div>
      <div className="flex-1 space-y-1">
        <p className="text-sm">{notification.message}</p>
        <p className="text-xs text-muted-foreground">
          {format(notification.date, "MMM d, h:mm a")}
        </p>
      </div>
      {!notification.read && (
        <div className="h-2 w-2 rounded-full bg-healthcare-primary mt-1" />
      )}
    </div>
  );
}
