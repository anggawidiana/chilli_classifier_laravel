import { Head } from '@inertiajs/react';
import { dashboard } from '@/routes';
import { Activity, BarChart3, Droplets, Target, ShieldCheck, AlertTriangle } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Legend } from 'recharts';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";

interface KPIProps {
    totalScans: number;
    averageConfidence: number;
    averageSeverity: number;
    mostCommonDisease: string;
}

interface ChartProps {
    diseaseDistribution: { name: string; value: number }[];
    recentActivity: { date: string; scans: number }[];
}

interface DetectionProps {
    id: number;
    predicted_class: string;
    confidence: number;
    severity_percent: number;
    created_at_human: string;
    created_at_raw: string;
}

interface DashboardProps {
    kpis: KPIProps;
    charts: ChartProps;
    latestDetections: DetectionProps[];
}

const pieChartConfig = {
    value: {
        label: "Count",
    }
} satisfies ChartConfig;

const barChartConfig = {
    scans: {
        label: "Scans",
        color: "var(--chart-1)",
    }
} satisfies ChartConfig;

export default function Dashboard({ kpis = { totalScans: 0, averageConfidence: 0, averageSeverity: 0, mostCommonDisease: 'None' }, charts = { diseaseDistribution: [], recentActivity: [] }, latestDetections = [] }: DashboardProps) {
    return (
        <>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-6 bg-background">
                
                {/* KPI Cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Scans</CardTitle>
                            <Activity className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{kpis.totalScans}</div>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Avg Confidence</CardTitle>
                            <Target className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{kpis.averageConfidence}%</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Avg Severity</CardTitle>
                            <Droplets className="h-4 w-4 text-orange-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{kpis.averageSeverity}%</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Most Common</CardTitle>
                            <BarChart3 className="h-4 w-4 text-purple-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-xl font-bold truncate" title={kpis.mostCommonDisease}>{kpis.mostCommonDisease}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Disease Distribution */}
                    <Card className="col-span-1 flex flex-col">
                        <CardHeader>
                            <CardTitle>Disease Distribution</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 pb-0">
                            {charts.diseaseDistribution.length > 0 ? (
                                <ChartContainer config={pieChartConfig} className="mx-auto aspect-square min-h-[250px]">
                                    <PieChart>
                                        <ChartTooltip
                                            cursor={false}
                                            content={<ChartTooltipContent hideLabel />}
                                        />
                                        <Pie
                                            data={charts.diseaseDistribution.map((item, index) => ({
                                                ...item,
                                                fill: `var(--chart-${(index % 5) + 1})`
                                            }))}
                                            dataKey="value"
                                            nameKey="name"
                                            innerRadius={60}
                                            outerRadius={80}
                                        />
                                    </PieChart>
                                </ChartContainer>
                            ) : (
                                <div className="h-[250px] flex items-center justify-center text-muted-foreground">No data available</div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Recent Activity */}
                    <Card className="col-span-2 flex flex-col">
                        <CardHeader>
                            <CardTitle>Recent Activity (Last 7 Days)</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 pb-0">
                            <ChartContainer config={barChartConfig} className="min-h-[250px] w-full">
                                <BarChart accessibilityLayer data={charts.recentActivity}>
                                    <XAxis
                                        dataKey="date"
                                        tickLine={false}
                                        tickMargin={10}
                                        axisLine={false}
                                    />
                                    <YAxis 
                                        tickLine={false} 
                                        axisLine={false} 
                                        allowDecimals={false} 
                                    />
                                    <ChartTooltip
                                        cursor={false}
                                        content={<ChartTooltipContent hideLabel />}
                                    />
                                    <Bar dataKey="scans" fill="var(--color-scans)" radius={[4, 4, 0, 0]} maxBarSize={40} />
                                </BarChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Detections Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Latest Detections</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Result</TableHead>
                                    <TableHead>Confidence</TableHead>
                                    <TableHead>Severity</TableHead>
                                    <TableHead className="text-right">Time</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {latestDetections.map((detection) => (
                                    <TableRow key={detection.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                {detection.predicted_class.toLowerCase() === 'healthy' ? (
                                                    <ShieldCheck className="w-4 h-4 text-green-500" />
                                                ) : (
                                                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                                                )}
                                                <span className="font-medium">{detection.predicted_class}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="font-normal">{detection.confidence}%</Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge 
                                                variant={detection.severity_percent > 50 ? 'destructive' : (detection.severity_percent > 0 ? 'default' : 'secondary')}
                                                className="font-normal"
                                            >
                                                {detection.severity_percent}%
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right text-muted-foreground" title={detection.created_at_raw}>
                                            {detection.created_at_human}
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {latestDetections.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                                            No detections found. Run a prediction to see results here.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
