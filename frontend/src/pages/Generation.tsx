import { Box, Typography, Card, CardContent, Grid } from "@mui/material";
import Layout from "../components/Layout";

export default function Generation() {
    return (
        <Layout>
            <Box sx={{ p: 2 }}>
                <Typography variant="h3" fontWeight="bold" gutterBottom>
                    AI Generation
                </Typography>

                <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
                    Choose an AI generation feature.
                </Typography>

                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Card sx={{ height: "100%" }}>
                            <CardContent>
                                <Typography variant="h5">🖼️ Image Generation</Typography>

                                <Typography sx={{ mt: 2 }}>
                                    Generate AI images from text prompts.
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <Card sx={{ height: "100%" }}>
                            <CardContent>
                                <Typography variant="h5">🔊 Voice Creation</Typography>

                                <Typography sx={{ mt: 2 }}>
                                    Convert text into natural speech.
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <Card sx={{ height: "100%" }}>
                            <CardContent>
                                <Typography variant="h5">🎤 Voice to Text</Typography>

                                <Typography sx={{ mt: 2 }}>
                                    Convert audio recordings into text.
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Box>
        </Layout>
    );
}