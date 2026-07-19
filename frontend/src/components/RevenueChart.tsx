import { Card, CardContent, Typography, Box, Skeleton } from '@mui/material';
import { LineChart } from '@mui/x-charts/LineChart';
import type { RevenuePoint } from '../types';

export default function RevenueChart({
  data,
  loading,
}: {
  data: RevenuePoint[];
  loading?: boolean;
}) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="subtitle2" color="text.secondary">
          Revenue trend
        </Typography>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Monthly revenue
        </Typography>

        {loading ? (
          <Skeleton variant="rounded" height={260} />
        ) : (
          <Box sx={{ width: '100%', height: 260 }}>
            <LineChart
              xAxis={[{ data: data.map((d) => d.label), scaleType: 'point' }]}
              series={[
                {
                  data: data.map((d) => d.revenue),
                  color: '#1976d2',
                  area: true,
                  showMark: false,
                  curve: 'monotoneX',
                },
              ]}
              grid={{ horizontal: true }}
              margin={{ left: 50, right: 20, top: 20, bottom: 30 }}
            />
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
