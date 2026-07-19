import { Card, CardContent, Typography, Box, Skeleton } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import type { CategoryTotal } from '../types';

export default function CategoryChart({
  data,
  loading,
}: {
  data: CategoryTotal[];
  loading?: boolean;
}) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="subtitle2" color="text.secondary">
          Breakdown
        </Typography>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Revenue by category
        </Typography>

        {loading ? (
          <Skeleton variant="rounded" height={260} />
        ) : (
          <Box sx={{ width: '100%', height: 260 }}>
            <BarChart
              layout="horizontal"
              yAxis={[{ data: data.map((d) => d.category), scaleType: 'band' }]}
              series={[{ data: data.map((d) => d.total), color: '#1976d2' }]}
              margin={{ left: 90, right: 20, top: 10, bottom: 30 }}
            />
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
