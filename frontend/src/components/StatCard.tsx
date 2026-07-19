import { Card, CardContent, Typography, Box, Skeleton } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import type { StatSummary } from '../types';

export default function StatCard({ stat, loading }: { stat?: StatSummary; loading?: boolean }) {
  if (loading || !stat) {
    return (
      <Card>
        <CardContent>
          <Skeleton width={90} height={18} />
          <Skeleton width={120} height={36} sx={{ mt: 1 }} />
          <Skeleton width={70} height={18} sx={{ mt: 1 }} />
        </CardContent>
      </Card>
    );
  }

  const isPositive = stat.delta >= 0;

  return (
    <Card>
      <CardContent>
        <Typography variant="subtitle2" color="text.secondary">
          {stat.label}
        </Typography>
        <Typography variant="h4" sx={{ mt: 0.5, fontSize: 28 }}>
          {stat.value}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              color: isPositive ? 'success.main' : 'error.main',
            }}
          >
            {isPositive ? (
              <ArrowUpwardIcon sx={{ fontSize: 14 }} />
            ) : (
              <ArrowDownwardIcon sx={{ fontSize: 14 }} />
            )}
            <Typography variant="caption" fontWeight={700} sx={{ ml: 0.25 }}>
              {Math.abs(stat.delta)}%
            </Typography>
          </Box>
          <Typography variant="caption" color="text.secondary">
            vs last period
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
