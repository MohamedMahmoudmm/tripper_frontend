import { Container, Typography, Box, Grid, Card, CardMedia, CardContent, Chip, Avatar, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Blog() {
  const navigate = useNavigate();

  const posts = [
    { id: 1, title: "15 Hidden Cafés in Cairo You’ll Wish You Knew Sooner", author: "Sarah M.", date: "Dec 1, 2025", tag: "Cairo", image: "cafe" },
    { id: 2, title: "How to Spend 48 Hours in Beirut Like a Local", author: "Ali K.", date: "Nov 28, 2025", tag: "Lebanon", image: "beirut" },
    { id: 3, title: "The Ultimate Dubai Staycation Guide (Under $300)", author: "Noor A.", date: "Nov 25, 2025", tag: "UAE", image: "dubai" },
    { id: 4, title: "Why Alexandria is Egypt’s Most Underrated City", author: "Omar H.", date: "Nov 20, 2025", tag: "Egypt", image: "alexandria" },
  ];

  const handleReadMore = (id) => {
    navigate(`/blog/${id}`);
    // أو افتح modal لو عايز
  };

  return (
    <Box sx={{ bgcolor: "#f8fafc", minHeight: "100vh", py: { xs: 12, md: 20 } }}>
      <Container maxWidth="lg">
        <Box textAlign="center" mb={{ xs: 12, md: 16 }}>
          <Typography variant="h2" fontWeight="bold" sx={{ fontSize: { xs: "3rem", md: "5.5rem" } }}>
            Tripper Stories
          </Typography>
          <Typography variant="h5" color="text.secondary" sx={{ mt: 4, maxWidth: 900, mx: "auto" }}>
            Real stories from real travelers and local experts.
          </Typography>
        </Box>

        <Grid container spacing={{ xs: 6, md: 8 }}>
          {posts.map((post) => (
            <Grid item xs={12} md={6} key={post.id}>
              <Card
                sx={{
                  borderRadius: 6,
                  overflow: "hidden",
                  boxShadow: "0 20px 50px rgba(0,0,0,0.1)",
                  height: "100%",
                  transition: "all 0.4s ease",
                  "&:hover": {
                    transform: "translateY(-16px)",
                    boxShadow: "0 35px 80px rgba(74,108,247,0.2)",
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="320"
                  image={`https://source.unsplash.com/random/800x600/?${post.image},city,night`}
                  alt={post.title}
                />
                <CardContent sx={{ p: { xs: 4, md: 6 } }}>
                  <Chip label={post.tag} color="primary" size="small" sx={{ mb: 3 }} />
                  <Typography variant="h4" fontWeight="bold" sx={{ mb: 3, lineHeight: 1.4, minHeight: 100 }}>
                    {post.title}
                  </Typography>
                  <Box display="flex" alignItems="center" gap={2} sx={{ mb: 4 }}>
                    <Avatar src={`https://i.pravatar.cc/150?u=${post.id}`} sx={{ width: 50, height: 50 }} />
                    <Box>
                      <Typography fontWeight="bold">{post.author}</Typography>
                      <Typography variant="body2" color="text.secondary">{post.date}</Typography>
                    </Box>
                  </Box>
                  <Button
                    variant="text"
                    color="primary"
                    sx={{ fontWeight: "bold", fontSize: "1.1rem", p: 0 }}
                    onClick={() => handleReadMore(post.id)}
                  >
                    Read Full Story →
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}