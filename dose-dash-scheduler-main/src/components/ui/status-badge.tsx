
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { AppointmentStatus, PaymentStatus } from "@/types";

interface StatusBadgeProps {
  status: AppointmentStatus | PaymentStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  let variant:
    | "default"
    | "secondary"
    | "destructive"
    | "outline" = "default";
  
  switch (status) {
    // Appointment statuses
    case AppointmentStatus.UPCOMING:
      variant = "default";
      break;
    case AppointmentStatus.COMPLETED:
      variant = "secondary";
      break;
    case AppointmentStatus.CANCELLED:
    case AppointmentStatus.MISSED:
      variant = "destructive";
      break;
    
    // Payment statuses
    case PaymentStatus.PAID:
      variant = "secondary";
      break;
    case PaymentStatus.PARTIAL:
      variant = "default";
      break;
    case PaymentStatus.UNPAID:
      variant = "destructive";
      break;
    
    default:
      variant = "outline";
  }

  return (
    <Badge 
      variant={variant}
      className={cn(
        "capitalize",
        status === AppointmentStatus.UPCOMING && "bg-healthcare-accent text-primary-foreground",
        status === AppointmentStatus.COMPLETED && "bg-healthcare-secondary text-primary-foreground",
        status === PaymentStatus.PAID && "bg-healthcare-secondary text-primary-foreground",
        status === PaymentStatus.PARTIAL && "bg-healthcare-warning text-background",
        className
      )}
    >
      {status.toLowerCase().replace("_", " ")}
    </Badge>
  );
}
