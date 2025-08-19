import { Badge } from "./badge";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { processAlertDescription, ProcessedAlert } from "@/lib/utils";

export interface AlertData {
  title: string;
  severity: string;
  effective?: string | null;
  expires?: string | null;
  instructions?: string | null;
  description?: string | null;
  source?: string;
}

function severityToVariant(sev: string): "destructive" | "warning" | "info" | "secondary" {
  const s = (sev || '').toLowerCase();
  if (s === 'extreme' || s === 'severe') return 'destructive';
  if (s === 'moderate') return 'warning';
  if (s === 'minor' || s === 'unknown') return 'info';
  return 'secondary';
}

const AlertCard = ({ alert }: { alert: AlertData }) => {
  const { title, severity, effective, expires, instructions, description, source } = alert;
  const showSeverityBadge = severity === 'Severe' || severity === 'Extreme' || severity === 'Moderate';
  
  // Process description for summary and links
  const processedAlert: ProcessedAlert = instructions 
    ? { text: instructions, links: [] }
    : processAlertDescription(description || '');
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-3">
        <CardTitle className="text-base leading-snug flex-1">{title}</CardTitle>
        {showSeverityBadge && (
          <Badge variant={severityToVariant(severity)}>{severity}</Badge>
        )}
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        {(instructions || description) && (
          <div className="space-y-2">
            <p className="leading-relaxed">{processedAlert.text}</p>
            {processedAlert.links.length > 0 && (
              <div className="space-y-1">
                {processedAlert.links.map((link, index) => (
                  <a
                    key={index}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-primary hover:text-primary/80 underline break-words"
                  >
                    {link}
                  </a>
                ))}
              </div>
            )}
          </div>
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
