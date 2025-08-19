import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { processAlertDescription } from "@/lib/utils";
import { AlertData } from "./AlertCard";

interface OngoingEventSectionProps {
  zipCode: string;
  location: string;
  alerts: AlertData[];
}

const OngoingEventSection = ({ zipCode, location, alerts }: OngoingEventSectionProps) => {
  // Filter for Severe/Extreme alerts within 24 hours
  const now = new Date();
  const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  
  const severeAlerts = alerts.filter(alert => {
    const severity = (alert.severity || '').toLowerCase();
    const isSevereOrExtreme = severity === 'severe' || severity === 'extreme';
    
    if (!isSevereOrExtreme) return false;
    
    // Check if alert is within 24 hours
    if (alert.effective) {
      const effectiveDate = new Date(alert.effective);
      return effectiveDate >= twentyFourHoursAgo;
    }
    
    return true; // Include if no effective date (assume recent)
  });

  // Extract all links from severe alert descriptions
  const allLinks: string[] = [];
  severeAlerts.forEach(alert => {
    if (alert.description) {
      const { links } = processAlertDescription(alert.description);
      allLinks.push(...links);
    }
  });

  // Remove duplicates
  const uniqueLinks = [...new Set(allLinks)];

  // Only render if we have severe alerts with links
  if (severeAlerts.length === 0 || uniqueLinks.length === 0) {
    return null;
  }

  return (
    <Card className="bg-destructive/5 border-destructive/20">
      <CardHeader>
        <CardTitle className="text-destructive">Ongoing Severe Weather Event</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium">ZIP:</span> {zipCode}
          </div>
          <div>
            <span className="font-medium">Location:</span> {location}
          </div>
        </div>
        
        <div>
          <h4 className="font-medium text-sm mb-2">Official Information Links:</h4>
          <div className="space-y-1">
            {uniqueLinks.map((link, index) => (
              <a
                key={index}
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-primary hover:text-primary/80 underline break-words text-sm"
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OngoingEventSection;