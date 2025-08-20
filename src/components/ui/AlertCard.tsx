import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { processAlertDescription, ProcessedAlert } from "@/lib/utils";
import SeverityBadge from "./SeverityBadge";

export interface AlertData {
  title: string;
  severity: string;
  effective?: string | null;
  expires?: string | null;
  instructions?: string | null;
  description?: string | null;
  source?: string;
}


const AlertCard = ({ alert }: { alert: AlertData }) => {
  const { title, severity, effective, expires, instructions, description, source } = alert;
  const showSeverityBadge = severity === 'Severe' || severity === 'Extreme' || severity === 'Moderate';
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-3">
        <CardTitle className="text-base leading-snug flex-1">{title}</CardTitle>
        {showSeverityBadge && (
          <SeverityBadge severity={severity} />
        )}
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        {instructions && (
          <p className="leading-relaxed line-clamp-3">{instructions}</p>
        )}
        <div className="text-muted-foreground">
          {effective && <span>Effective: {new Date(effective).toLocaleString()}</span>}
          {expires && <span className="ml-3">Expires: {new Date(expires).toLocaleString()}</span>}
          {source && <span className="ml-3">Source: {source}</span>}
        </div>
      </CardContent>
    </Card>
  );
};

export default AlertCard;
