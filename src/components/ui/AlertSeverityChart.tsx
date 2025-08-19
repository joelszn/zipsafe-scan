import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { AlertData } from './AlertCard';

interface AlertSeverityChartProps {
  alerts: AlertData[];
}

const AlertSeverityChart = ({ alerts }: AlertSeverityChartProps) => {
  // Count alerts by severity
  const severityCounts = alerts.reduce((acc, alert) => {
    const severity = alert.severity?.toLowerCase() || 'unknown';
    acc[severity] = (acc[severity] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Convert to chart data with proper ordering
  const chartData = [
    { severity: 'Extreme', count: severityCounts.extreme || 0, color: 'hsl(var(--destructive))' },
    { severity: 'Severe', count: severityCounts.severe || 0, color: 'hsl(var(--destructive))' },
    { severity: 'Moderate', count: severityCounts.moderate || 0, color: 'hsl(var(--warning))' },
    { severity: 'Minor', count: severityCounts.minor || 0, color: 'hsl(var(--info))' },
    { severity: 'Unknown', count: severityCounts.unknown || 0, color: 'hsl(var(--muted))' },
  ].filter(item => item.count > 0); // Only show severities that have alerts

  if (chartData.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Alert Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="severity" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px',
                  color: 'hsl(var(--foreground))'
                }}
              />
              <Bar 
                dataKey="count" 
                fill="hsl(var(--primary))"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default AlertSeverityChart;