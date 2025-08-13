import { Link } from "react-router-dom";
import { Progress } from "./progress";
import { Card, CardContent, CardHeader, CardTitle } from "./card";

export interface RiskItem {
  name: string;
  score: number; // 0-100
  why?: string;
}

const titleCase = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const RiskBar = ({ item }: { item: RiskItem }) => {
  return (
    <Card>
      <CardHeader className="flex items-center justify-between gap-3 sm:flex-row sm:items-center p-4 pb-2">
        <CardTitle className="text-base">
          <Link to={`/prep/${item.name}`} className="hover:underline">
            {titleCase(item.name)}
          </Link>
        </CardTitle>
        <div className="text-sm text-muted-foreground">Score: {item.score}</div>
      </CardHeader>
      <CardContent>
        <Progress value={item.score} />
        {item.why && <p className="mt-2 text-sm text-muted-foreground">Why: {item.why}</p>}
      </CardContent>
    </Card>
  );
};

export default RiskBar;
