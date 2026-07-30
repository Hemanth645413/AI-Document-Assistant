import {
  Card,
  CardContent,
  Typography,
  Box,
  Skeleton,
  Chip,
} from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

import type { StatSummary } from "../types";

interface StatCardProps {
  stat?: StatSummary;
  loading?: boolean;
}

export default function StatCard({
  stat,
  loading = false,
}: StatCardProps) {
  if (loading || !stat) {
    return (
      <Card
        elevation={0}
        sx={{
          borderRadius: 4,
          border: "1px solid #e5e7eb",
          height: "100%",
        }}
      >
        <CardContent>
          <Skeleton width={90} height={18} />
          <Skeleton width={120} height={40} sx={{ mt: 1 }} />
          <Skeleton width={100} height={24} sx={{ mt: 2 }} />
        </CardContent>
      </Card>
    );
  }

  const isPositive = stat.delta >= 0;

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 4,
        border: "1px solid #e5e7eb",
        transition: "all .3s ease",
        cursor: "pointer",
        overflow: "hidden",

        "&:hover": {
          transform: "translateY(-6px)",
          boxShadow: "0 12px 30px rgba(0,0,0,0.10)",
          borderColor: "#1976d2",
        },
      }}
    >
      <CardContent>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography
            sx={{
              fontSize: 13,
              fontWeight: 700,
              color: "text.secondary",
              letterSpacing: 1,
              textTransform: "uppercase",
            }}
          >
            {stat.label}
          </Typography>

          <Box
            sx={{
              bgcolor: "#E3F2FD",
              color: "#1976d2",
              p: 1,
              borderRadius: 2,
            }}
          >
            <TrendingUpIcon fontSize="small" />
          </Box>
        </Box>

        <Typography
          variant="h4"
          fontWeight={700}
          sx={{
            mt: 2,
            fontSize: 30,
          }}
        >
          {stat.value}
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mt: 2,
            gap: 1,
          }}
        >
          <Chip
            size="small"
            icon={
              isPositive ? (
                <ArrowUpwardIcon />
              ) : (
                <ArrowDownwardIcon />
              )
            }
            label={`${Math.abs(stat.delta)}%`}
            color={isPositive ? "success" : "error"}
            variant="filled"
          />

          <Typography
            variant="caption"
            color="text.secondary"
          >
            Compared to last period
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}