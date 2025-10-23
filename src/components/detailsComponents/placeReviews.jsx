import { useState } from "react";
import {
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Avatar,
  Rating,
  TextField,
  Button,
} from "@mui/material";

export default function PlaceReviews() {
  const [reviews, setReviews] = useState([
    {
      date: "2 weeks ago",
      comment:
        "Amazing place! The view was incredible and the host was super friendly. Highly recommended! The staff was also very helpful and the overall atmosphere was just perfect for a peaceful getaway.",
      rating: 5,
      img: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      date: "1 month ago",
      comment:
        "Loved the location and the cleanliness. Will definitely come again. Everything was beyond expectations!",
      rating: 4,
      img: "https://randomuser.me/api/portraits/women/45.jpg",
    },
    {
      date: "3 weeks ago",
      comment:
        "The experience was good overall, but the Wi-Fi was a bit slow at times. The view made up for it though!",
      rating: 4,
      img: "https://randomuser.me/api/portraits/men/22.jpg",
    },
    {
      date: "2 months ago",
      comment:
        "Absolutely beautiful resort! Great amenities and peaceful atmosphere. The pool area was clean and relaxing.",
      rating: 5,
      img: "https://randomuser.me/api/portraits/women/68.jpg",
    },
  ]);

  const [newReview, setNewReview] = useState({
    comment: "",
    rating: 0,
  });

  const handleAddReview = () => {
    if (newReview.comment && newReview.rating) {
      const addedReview = {
        ...newReview,
        date: "Just now",
        img: "https://randomuser.me/api/portraits/men/99.jpg",
      };
      setReviews([addedReview, ...reviews]);
      setNewReview({ comment: "", rating: 0 });
    }
  };

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
              alt="user"
              sx={{ width: 64, height: 64, mr: 2 }}
            />
            <Box>
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
      <Box
        sx={{
          maxWidth: 600,
          margin: "0 auto",
          mb: 6,
          backgroundColor: "#fff",
          p: 3,
          borderRadius: 4,
          boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
          textAlign: "left",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          Add Your Review
        </Typography>

        <TextField
          label="Write your review..."
          multiline
          fullWidth
          rows={3}
          variant="outlined"
          value={newReview.comment}
          onChange={(e) =>
            setNewReview({ ...newReview, comment: e.target.value })
          }
          sx={{ mb: 2 }}
        />
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2, }}>
           <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Typography sx={{ mr: 2, fontWeight: 600 }}>Rating:</Typography>
          <Rating
            value={newReview.rating}
            onChange={(e, newValue) =>
              setNewReview({ ...newReview, rating: newValue })
            }
          />
        </Box>
         <Button
            variant="contained"
            size="large"
            sx={{
              backgroundColor: "#14183E",
              borderRadius: "16px",
              px: 4,
              textTransform: "none",
              fontWeight: 600,
              "&:hover": { backgroundColor: "#14186E" },
            }}
            onClick={handleAddReview}
          >
            Submit
          </Button>
        </Box>
       
      </Box>
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
          mb: 4,
        }}
      >
        What Our Guests Say
      </Typography>
      <Grid container spacing={5} justifyContent="center" alignItems="flex-start">
        {reviews.map((review, index) => (
          <Grid item xs={12} sm={10} md={6} lg={5} key={index}>
            <ReviewCard review={review} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
