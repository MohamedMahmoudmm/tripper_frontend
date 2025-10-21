import { useState } from "react";
import {
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Avatar,
  Rating,
} from "@mui/material";

export default function PlaceReviews() {
  const reviews = [
    {
      name: "John Doe",
      date: "2 weeks ago",
      comment:
        "Amazing place! The view was incredible and the host was super friendly. Highly recommended! The staff was also very helpful and the overall atmosphere was just perfect for a peaceful getaway.",
      rating: 5,
      img: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      name: "Emily Smith",
      date: "1 month ago",
      comment:
        "Loved the location and the cleanliness. Will definitely come again. Everything was beyond expectations!",
      rating: 4,
      img: "https://randomuser.me/api/portraits/women/45.jpg",
    },
    {
      name: "David Wilson",
      date: "3 weeks ago",
      comment:
        "The experience was good overall, but the Wi-Fi was a bit slow at times. The view made up for it though!",
      rating: 4,
      img: "https://randomuser.me/api/portraits/men/22.jpg",
    },
    {
      name: "Sophia Brown",
      date: "2 months ago",
      comment:
        "Absolutely beautiful resort! Great amenities and peaceful atmosphere. The pool area was clean and relaxing.",
      rating: 5,
      img: "https://randomuser.me/api/portraits/women/68.jpg",
    },
  ];

  const ReviewCard = ({ review }) => {
    const [expanded, setExpanded] = useState(false);

    const toggleExpanded = () => setExpanded(!expanded);

    const shortText =
      review.comment.length > 120
        ? review.comment.substring(0, 120) + "..."
        : review.comment;

    return (
      <Card
        sx={{
          borderRadius: 4,
          overflow: "hidden",
          width: "100%",
          maxWidth: 600, 
          margin: "0 auto",
          boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
          textAlign: "left",
        }}
      >
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Avatar
              src={review.img}
              alt={review.name}
              sx={{ width: 64, height: 64, mr: 2 }}
            />
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                {review.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {review.date}
              </Typography>
            </Box>
          </Box>

          <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.6 }}>
            {expanded ? review.comment : shortText}
            {review.comment.length > 120 && (
              <Typography
                component="span"
                sx={{
                  color: "#1976d2",
                  cursor: "pointer",
                  fontWeight: 600,
                  ml: 1,
                }}
                onClick={toggleExpanded}
              >
                {expanded ? "Show Less" : "Show More"}
              </Typography>
            )}
          </Typography>

          <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
            <Rating value={review.rating} readOnly />
          </Box>
        </CardContent>
      </Card>
    );
  };

  return (
    <Box sx={{ textAlign: "center", py: 6, backgroundColor: "#f9f9f9" }}>
      <Typography
        variant="subtitle2"
        sx={{
          textTransform: "uppercase",
          color: "#5E6282",
          fontWeight: 600,
          letterSpacing: 2,
          mb: 1,
        }}
      >
        Customer Feedback
      </Typography>

      <Typography
        variant="h4"
        sx={{
          fontWeight: 800,
          color: "#14183E",
          mb: 6,
        }}
      >
        What Our Guests Say
      </Typography>

      <Grid
        container
        spacing={5}
        justifyContent="center"
        alignItems="flex-start"
      >
        {reviews.map((review, index) => (
          <Grid item xs={12} sm={10} md={6} lg={5} key={index}>
            <ReviewCard review={review} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
