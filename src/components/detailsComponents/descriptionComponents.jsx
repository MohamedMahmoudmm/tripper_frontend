import { Avatar, Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import BookingBox from "./bookingBox";

export default function DescriptonComponent() {
  const navigate = useNavigate();

  const host = {
    id: "123",
    name: "John Doe",
    img: "https://i.pravatar.cc/100",
    date: "1 month ago",
  };

  return (
    <Box sx={{ display: "flex", gap: 4, mt: 5, alignItems: "flex-start" }}>
      <Box sx={{ flex: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Avatar
            src={host.img}
            alt={host.name}
            sx={{
              width: 64,
              height: 64,
              mr: 2,
              cursor: "pointer",
              transition: "transform 0.2s ease",
              "&:hover": { transform: "scale(1.05)" },
            }}
            onClick={() => navigate(`/profile/${host.id}`)}
          />

          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              Created by{" "}
              <span style={{ color: "#FF385C", cursor: "pointer" }}>
                {host.name}
              </span>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {host.date}
            </Typography>

            <Button
              variant="outlined"
              sx={{
                mt: 1.5,
                textTransform: "none",
                borderRadius: 3,
                fontWeight: 600,
                color: "#FF385C",
                borderColor: "#FF385C",
                "&:hover": {
                  backgroundColor: "#FF385C",
                  color: "#fff",
                  borderColor: "#FF385C",
                },
              }}
              onClick={() => navigate("/chat")}
            >
              Message host
            </Button>
          </Box>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
            Description
          </Typography>
          <Typography color="text.secondary" sx={{ lineHeight: 1.6 }}>
            Santorini is one of the most breathtaking islands in Greece, known
            for its whitewashed houses, blue-domed churches, and stunning
            sunsets that paint the sky over the Aegean Sea. Formed by a
            volcanic eruption thousands of years ago, the island features
            dramatic cliffs, black-sand beaches, and charming villages perched
            high above the caldera. Visitors can explore the iconic towns of
            Oia and Fira, where narrow cobblestone streets wind through
            boutique shops, restaurants, and cozy cafes overlooking endless
            ocean views. Santorini is also famous for its luxurious villas,
            romantic atmosphere, and local wines produced from volcanic soil.
            Whether you’re seeking relaxation, adventure, or a romantic escape,
            Santorini offers a unique blend of natural beauty, history, and
            Greek hospitality that makes it one of the world’s top travel
            destinations.
          </Typography>
        </Box>
      </Box>

      <BookingBox />
    </Box>
  );
}
