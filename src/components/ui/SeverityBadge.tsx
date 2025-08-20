import { Badge } from "./badge";

export interface SeverityBadgeProps {
  severity: string;
}

function getSeverityConfig(severity: string) {
  const s = (severity || '').toLowerCase();
  
  if (s === 'extreme') {
    return {
      variant: 'extreme' as const,
      label: 'Extreme',
      action: 'Evacuate if ordered'
    };
  } else if (s === 'severe') {
    return {
      variant: 'destructive' as const,
      label: 'Severe', 
      action: 'Take shelter immediately'
    };
  } else if (s === 'moderate') {
    return {
      variant: 'warning' as const,
      label: 'Moderate',
      action: 'Avoid unnecessary travel'
    };
  } else {
    return {
      variant: 'secondary' as const,
      label: severity,
      action: null
    };
  }
}

const SeverityBadge = ({ severity }: SeverityBadgeProps) => {
  const config = getSeverityConfig(severity);
  
  return (
    <div className="flex flex-col items-center text-center">
      <Badge variant={config.variant} className="font-semibold">
        {config.label}
      </Badge>
      {config.action && (
        <span className="text-[10px] text-muted-foreground mt-1 leading-tight">{config.action}</span>
      )}
    </div>
  );
};

export default SeverityBadge;