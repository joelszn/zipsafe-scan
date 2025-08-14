import { useState, useMemo } from 'react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScatterChart, Scatter, XAxis, YAxis, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { CalendarDays, BarChart3, List } from 'lucide-react';

export interface QuakeItem {
  magnitude: number | null;
  timeISO: string | null;
  place: string;
  url: string;
}

interface EarthquakeVisualizationProps {
  earthquakes: QuakeItem[];
  onTimeRangeChange: (range: string) => void;
  isLoading: boolean;
  error?: string;
  timeRange: string;
}

const TIME_RANGES = [
  { value: '72h', label: '72 Hours', hours: 72 },
  { value: '7d', label: '7 Days', hours: 168 },
  { value: '30d', label: '30 Days', hours: 720 },
  { value: '6m', label: '6 Months', hours: 4380 }
];

const getMagnitudeColor = (magnitude: number | null) => {
  if (!magnitude) return 'hsl(var(--muted))';
  if (magnitude < 3) return 'hsl(142, 76%, 36%)'; // green
  if (magnitude < 5) return 'hsl(48, 96%, 53%)'; // yellow
  return 'hsl(0, 84%, 60%)'; // red
};

const getMagnitudeBadgeVariant = (magnitude: number | null) => {
  if (!magnitude) return 'secondary';
  if (magnitude < 3) return 'default';
  if (magnitude < 5) return 'secondary';
  return 'destructive';
};

export function EarthquakeVisualization({ 
  earthquakes, 
  onTimeRangeChange, 
  isLoading, 
  error, 
  timeRange 
}: EarthquakeVisualizationProps) {
  const [viewMode, setViewMode] = useState<'list' | 'timeline' | 'distribution'>('list');

  const chartData = useMemo(() => {
    return earthquakes
      .filter(eq => eq.magnitude !== null && eq.timeISO)
      .map((eq, index) => ({
        id: index,
        magnitude: eq.magnitude!,
        time: new Date(eq.timeISO!).getTime(),
        timeFormatted: new Date(eq.timeISO!).toLocaleDateString(),
        place: eq.place,
        url: eq.url
      }))
      .sort((a, b) => a.time - b.time);
  }, [earthquakes]);

  const distributionData = useMemo(() => {
    const ranges = [
      { range: '0-2.9', min: 0, max: 2.9, count: 0 },
      { range: '3-3.9', min: 3, max: 3.9, count: 0 },
      { range: '4-4.9', min: 4, max: 4.9, count: 0 },
      { range: '5-5.9', min: 5, max: 5.9, count: 0 },
      { range: '6+', min: 6, max: 10, count: 0 }
    ];

    earthquakes.forEach(eq => {
      if (eq.magnitude !== null) {
        const range = ranges.find(r => eq.magnitude! >= r.min && eq.magnitude! <= r.max);
        if (range) range.count++;
      }
    });

    return ranges.filter(r => r.count > 0);
  }, [earthquakes]);

  const formatTimeAxis = (timestamp: number) => {
    const date = new Date(timestamp);
    const range = TIME_RANGES.find(r => r.value === timeRange);
    
    if (range && range.hours <= 168) { // 7 days or less
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
    return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="font-medium">Magnitude: {data.magnitude}</p>
          <p className="text-sm text-muted-foreground">{data.timeFormatted}</p>
          <p className="text-sm">{data.place}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5" />
            Recent Earthquakes Nearby
          </CardTitle>
          <div className="flex gap-2">
            <Select value={timeRange} onValueChange={onTimeRangeChange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TIME_RANGES.map(range => (
                  <SelectItem key={range.value} value={range.value}>
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex border rounded-md">
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-r-none"
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'timeline' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('timeline')}
                className="rounded-none"
              >
                <CalendarDays className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'distribution' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('distribution')}
                className="rounded-l-none"
              >
                <BarChart3 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="h-32 bg-muted/50 rounded animate-pulse" />
        )}
        
        {error && (
          <p className="text-sm text-muted-foreground">{error}</p>
        )}
        
        {!isLoading && !error && earthquakes.length === 0 && (
          <p className="text-sm text-muted-foreground">No earthquakes found in the selected time range</p>
        )}
        
        {!isLoading && !error && earthquakes.length > 0 && (
          <>
            {viewMode === 'list' && (
              <div className="space-y-3">
                {earthquakes.slice(0, 10).map((earthquake, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant={getMagnitudeBadgeVariant(earthquake.magnitude)}>
                          {earthquake.magnitude ? `M${earthquake.magnitude.toFixed(1)}` : 'M?'}
                        </Badge>
                        {earthquake.timeISO && (
                          <span className="text-sm text-muted-foreground">
                            {new Date(earthquake.timeISO).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      <p className="text-sm">{earthquake.place}</p>
                    </div>
                    {earthquake.url && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={earthquake.url} target="_blank" rel="noopener noreferrer">
                          Details
                        </a>
                      </Button>
                    )}
                  </div>
                ))}
                {earthquakes.length > 10 && (
                  <p className="text-sm text-muted-foreground text-center">
                    Showing 10 of {earthquakes.length} earthquakes
                  </p>
                )}
              </div>
            )}
            
            {viewMode === 'timeline' && chartData.length > 0 && (
              <div className="h-80">
                <ChartContainer
                  config={{
                    magnitude: {
                      label: "Magnitude",
                      color: "hsl(var(--primary))",
                    },
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart data={chartData}>
                      <XAxis
                        type="number"
                        dataKey="time"
                        domain={['dataMin', 'dataMax']}
                        tickFormatter={formatTimeAxis}
                        className="text-xs"
                      />
                      <YAxis
                        type="number"
                        dataKey="magnitude"
                        domain={['dataMin - 0.5', 'dataMax + 0.5']}
                        label={{ value: 'Magnitude', angle: -90, position: 'insideLeft' }}
                        className="text-xs"
                      />
                      <ChartTooltip content={<CustomTooltip />} />
                      <Scatter
                        dataKey="magnitude"
                        fill="hsl(var(--primary))"
                        shape={(props: any) => {
                          const { cx, cy, payload } = props;
                          const size = Math.max(4, (payload.magnitude || 1) * 3);
                          return (
                            <circle
                              cx={cx}
                              cy={cy}
                              r={size}
                              fill={getMagnitudeColor(payload.magnitude)}
                              opacity={0.7}
                            />
                          );
                        }}
                      />
                    </ScatterChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            )}
            
            {viewMode === 'distribution' && distributionData.length > 0 && (
              <div className="h-64">
                <ChartContainer
                  config={{
                    count: {
                      label: "Count",
                      color: "hsl(var(--primary))",
                    },
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={distributionData}>
                      <XAxis
                        dataKey="range"
                        className="text-xs"
                        label={{ value: 'Magnitude Range', position: 'insideBottom', offset: -10 }}
                      />
                      <YAxis
                        className="text-xs"
                        label={{ value: 'Count', angle: -90, position: 'insideLeft' }}
                      />
                      <ChartTooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-background border rounded-lg p-2 shadow-lg">
                                <p className="font-medium">Magnitude {data.range}</p>
                                <p className="text-sm">Count: {data.count}</p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}