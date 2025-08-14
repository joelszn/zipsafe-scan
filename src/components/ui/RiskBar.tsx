import { Link } from "react-router-dom";
import { Progress } from "./progress";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Badge } from "./badge";
import { getRiskLevel } from "@/lib/riskUtils";

export interface RiskItem {
  name: string;
  score: number; // 0-100
  why?: string;
  dataSource?: string;
}

const titleCase = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const RiskBar = ({ item }: { item: RiskItem }) => {
  const riskLevel = getRiskLevel(item.score);
  
  return (
    <Card>
      <CardHeader className="flex items-center justify-between gap-3 sm:flex-row sm:items-center">
        <CardTitle className="text-base">
          <Link to={`/prep/${item.name}`} className="hover:underline">
            {titleCase(item.name)}
          </Link>
        </CardTitle>
        <div className="flex items-center gap-2">
          <Badge 
            variant="outline" 
            className={`border-${riskLevel.color} text-${riskLevel.color}`}
          >
            {riskLevel.label}
          </Badge>
          <div className="text-sm text-muted-foreground">Score: {item.score}</div>
        </div>
      </CardHeader>
      <CardContent>
        <Progress 
          value={item.score} 
          variant={`risk-${riskLevel.level}` as any}
        />
        <div className="mt-2 space-y-1">
          <p className="text-sm font-medium text-muted-foreground">
            {riskLevel.description}
          </p>
          {item.why && (
            <p className="text-sm text-muted-foreground">
              <span className="font-medium">Why:</span> {item.why}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RiskBar;
