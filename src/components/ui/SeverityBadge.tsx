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
    <Badge variant={config.variant} className="flex flex-col items-center text-center leading-tight py-1.5 px-3 min-h-[2.5rem]">
      <span className="font-semibold text-xs">{config.label}</span>
      {config.action && (
        <span className="text-[10px] opacity-90 mt-0.5">{config.action}</span>
      )}
    </Badge>
  );
};

export default SeverityBadge;