import {
    Paper,
    Typography,
    Box,
} from "@mui/material";

import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from "recharts";

const data = [
    { day: "Mon", uploads: 4 },
    { day: "Tue", uploads: 7 },
    { day: "Wed", uploads: 5 },
    { day: "Thu", uploads: 9 },
    { day: "Fri", uploads: 12 },
    { day: "Sat", uploads: 8 },
    { day: "Sun", uploads: 11 },
];

export default function ActivityChart() {
    return (
        <Paper
            elevation={0}
            sx={{
                p: 3,
                borderRadius: 4,
                border: "1px solid #E5E7EB",
                mb: 4,
            }}
        >
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={3}
            >
                <Typography
                    variant="h6"
                    fontWeight={700}
                >
                    Weekly Upload Activity
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    Last 7 Days
                </Typography>
            </Box>

            <ResponsiveContainer
                width="100%"
                height={320}
            >
                <AreaChart data={data}>
                    <defs>
                        <linearGradient
                            id="uploadGradient"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                        >
                            <stop
                                offset="5%"
                                stopColor="#1976d2"
                                stopOpacity={0.4}
                            />
                            <stop
                                offset="95%"
                                stopColor="#1976d2"
                                stopOpacity={0}
                            />
                        </linearGradient>
                    </defs>

                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis dataKey="day" />

                    <YAxis />

                    <Tooltip />

                    <Area
                        type="monotone"
                        dataKey="uploads"
                        stroke="#1976d2"
                        strokeWidth={3}
                        fill="url(#uploadGradient)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </Paper>
    );
}