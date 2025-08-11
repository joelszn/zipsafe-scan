import { Badge } from "./badge";

export interface FloodDataUI {
  likelihood: 'High' | 'Moderate' | 'Low' | 'Unknown';
  rationale?: string;
  disclaimer?: string;
}

function likelihoodVariant(l: FloodDataUI['likelihood']): "destructive" | "warning" | "success" | "secondary" {
  if (l === 'High') return 'destructive';
  if (l === 'Moderate') return 'warning';
  if (l === 'Low') return 'success';
  return 'secondary';
}

const FloodLikelihoodBadge = ({ data }: { data: FloodDataUI }) => {
  return (
    <div className="space-y-2">
      <Badge variant={likelihoodVariant(data.likelihood)}>
        Flood Insurance Likelihood: {data.likelihood}
      </Badge>
      {data.rationale && <p className="text-sm">{data.rationale}</p>}
      <p className="text-xs text-muted-foreground">
        {data.disclaimer || 'Informational only. Confirm with local officials or your lender.'}
      </p>
    </div>
  );
};

export default FloodLikelihoodBadge;
