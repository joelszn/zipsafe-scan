import { Badge } from "./badge";
import { AlertTriangle, Shield, AlertCircle } from "lucide-react";

export interface SeverityBadgeProps {
  severity: string;
}

function getSeverityConfig(severity: string) {
  const s = (severity || '').toLowerCase();
  
  if (s === 'extreme') {
    return {
      variant: 'extreme' as const,
      label: 'Extreme',
      action: 'Evacuate if ordered',
      icon: AlertTriangle,
      ariaLabel: 'Extreme severity alert - Evacuate if ordered'
    };
  } else if (s === 'severe') {
    return {
      variant: 'destructive' as const,
      label: 'Severe', 
      action: 'Take shelter immediately',
      icon: AlertCircle,
      ariaLabel: 'Severe alert - Take shelter immediately'
    };
  } else if (s === 'moderate') {
    return {
      variant: 'warning' as const,
      label: 'Moderate',
      action: 'Avoid unnecessary travel',
      icon: Shield,
      ariaLabel: 'Moderate severity alert - Avoid unnecessary travel'
    };
  } else {
    return {
      variant: 'secondary' as const,
      label: severity,
      action: null,
      icon: null,
      ariaLabel: `${severity} severity alert`
    };
  }
}

const SeverityBadge = ({ severity }: SeverityBadgeProps) => {
  const config = getSeverityConfig(severity);
  const IconComponent = config.icon;
  
  return (
    <div className="flex flex-col items-center text-center" role="alert" aria-label={config.ariaLabel}>
      <Badge variant={config.variant} className="font-semibold flex items-center gap-1">
        {IconComponent && <IconComponent className="h-3 w-3" aria-hidden="true" />}
        {config.label}
      </Badge>
      {config.action && (
        <span className="text-[10px] text-foreground/80 mt-1 leading-tight font-medium">{config.action}</span>
      )}
    </div>
  );
};

export default SeverityBadge;