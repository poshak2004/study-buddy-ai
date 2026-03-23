import { AlertTriangle, CheckCircle } from "lucide-react";

interface DropoffBadgeProps {
  isHighRisk: boolean;
}

export function DropoffBadge({ isHighRisk }: DropoffBadgeProps) {
  if (isHighRisk) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-danger/40 bg-danger/10 px-4 py-3">
        <AlertTriangle className="h-4 w-4 text-danger" />
        <span className="text-sm font-mono font-medium text-danger">High drop-off risk</span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-2 rounded-lg border border-success/40 bg-success/10 px-4 py-3">
      <CheckCircle className="h-4 w-4 text-success" />
      <span className="text-sm font-mono font-medium text-success">On track</span>
    </div>
  );
}
