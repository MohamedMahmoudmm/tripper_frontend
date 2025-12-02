import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Avatar,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Chip,
  Skeleton,
  Stack,
  Paper,
  Tab,
  Tabs,
  Tooltip, Button
} from "@mui/material";
import {
  Verified as VerifiedIcon,
  Star as StarIcon,
  Home as HomeIcon,
  Explore as ExploreIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  CalendarMonth as CalendarIcon,
} from "@mui/icons-material";
import axiosInstance from "../axiousInstance/axoiusInstance";
import MessageIcon from '@mui/icons-material/Message';

export default function HostProfile() {
  const { hostId } = useParams();
  const navigate = useNavigate();
  const [host, setHost] = useState(null);
  const [hotels, setHotels] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  const currentUser = JSON.parse(localStorage.getItem("user") || "null");
  const myId = currentUser?._id;

  useEffect(() => {
    if (!hostId) return;

    const fetchHostData = async () => {
      try {
        setLoading(true);

        const [hostRes, hotelsRes, experiencesRes] = await Promise.all([
          axiosInstance.get(`/user/profile/${hostId}`),
          axiosInstance.get(`/hotel/by-host/${hostId}`),
          axiosInstance.get(`/experiance/by-host/${hostId}`),
        ]);

        setHost(hostRes.data.data || hostRes.data);
        setHotels(hotelsRes.data || []);
        setExperiences(experiencesRes.data || []);
      } catch (err) {
        console.error("Error fetching host data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHostData();

    // لو اليوزر هو الـ Host نفسه → يتحول لصفحته الشخصية
    if (myId && myId === hostId) {
      navigate("/guest/profile", { replace: true });
    }
  }, [hostId, myId, navigate]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleCardClick = (id, model) => {
    navigate(`/${model}/details/${id}`);
  };

  // فتح واتساب
  const openWhatsApp = (phone) => {
    const cleaned = phone.replace(/[^0-9]/g, "");
    let number = cleaned;
    if (cleaned.startsWith("0")) {
      number = "2" + cleaned.substring(1); // لو مصري
    } else if (!cleaned.startsWith("20") && cleaned.length === 11) {
      number = "2" + cleaned;
    }
    window.open(`https://wa.me/${number}`, "_blank");
  };

  // بدء محادثة
  const startConversation = () => {
    if (!myId) {
      navigate("/login");
      return;
    }
    if (myId === hostId) return;

    axiosInstance
      .post("conversation/startConversation", {
        receiverid: [hostId],
      })
      .then((res) => {
        const convId = res.data.data.conversation._id;
        navigate("/chat", { state: { convid: convId } });
      })
      .catch((err) => {
        console.error("Error starting chat:", err);
      });
  };



  const renderPropertyCard = (item, model) => {
    const price = item.price || 0;
    const priceLabel = model === "hotel" ? `$${price}/night` : `$${price}`;

    return (
      <Card
        onClick={() => handleCardClick(item._id, model)}
        sx={{
          borderRadius: 3,
          overflow: "hidden",
          cursor: "pointer",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            transform: "translateY(-8px)",
            boxShadow: "0 12px 24px rgba(0,0,0,0.15)",
          },
        }}
      >
        <CardMedia
          component="img"
          height="200"
          image={item.images?.[0] || "https://via.placeholder.com/400"}
          alt={item.name}
          sx={{ objectFit: "cover" }}
        />
        <CardContent>
          <Typography variant="h6" fontWeight="bold" gutterBottom noWrap>
            {item.name}
          </Typography>

          {item.address?.city && (
            <Box display="flex" alignItems="center" gap={0.5} mb={1}>
              <LocationIcon fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                {item.address.city}
              </Typography>
            </Box>
          )}

          <Box display="flex" alignItems="center" justifyContent="space-between" mt={2}>
            <Box display="flex" alignItems="center" gap={0.5}>
              <StarIcon sx={{ color: "#FFB800", fontSize: 18 }} />
              <Typography variant="body2" fontWeight="600">
                {item.starRating || 4.5}
              </Typography>
            </Box>
            <Typography variant="h6" fontWeight="bold" color="primary">
              {priceLabel}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  };

  const renderSkeletonCard = () => (
    <Card sx={{ borderRadius: 3 }}>
      <Skeleton variant="rectangular" height={200} />
      <CardContent>
        <Skeleton height={30} />
        <Skeleton height={20} width="60%" sx={{ mt: 1 }} />
        <Skeleton height={25} width="40%" sx={{ mt: 2 }} />
      </CardContent>
    </Card>
  );

  const totalProperties = hotels.length + experiences.length;
  const joinDate = host ? new Date(host.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long' }) : '';

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header Skeleton */}
        <Paper elevation={0} sx={{ p: 4, borderRadius: 3, mb: 4 }}>
          <Box display="flex" alignItems="center" gap={3}>
            <Skeleton variant="circular" width={120} height={120} />
            <Box flex={1}>
              <Skeleton height={40} width="30%" />
              <Skeleton height={25} width="50%" sx={{ mt: 1 }} />
              <Skeleton height={20} width="40%" sx={{ mt: 1 }} />
            </Box>
          </Box>
        </Paper>

        {/* Content Skeleton */}
        <Grid container spacing={3}>
          {[1, 2, 3].map((i) => (
            <Grid item xs={12} sm={6} md={4} key={i}>
              {renderSkeletonCard()}
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }

  if (!host) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: "center" }}>
        <Typography variant="h5" color="text.secondary">
          Host not found
        </Typography>
      </Container>
    );
  }



  return (
    <Box sx={{ backgroundColor: "#fafafa", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 3,
            mb: 4,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: 0,
              right: 0,
              width: "300px",
              height: "300px",
              opacity: 0.1,
              background: "radial-gradient(circle, white 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          />

          <Box
            display="flex"
            flexDirection={{ xs: "column", md: "row" }}
            alignItems={{ xs: "center", md: "flex-start" }}
            gap={4}
            position="relative"
            zIndex={1}
          >
            <Avatar
              src={host.image || undefined}
              sx={{
                width: 140,
                height: 140,
                border: "5px solid white",
                boxShadow: "0 8px 25px rgba(0,0,0,0.3)",
                fontSize: 56,
                fontWeight: "bold",
              }}
            >
              {host.name?.[0]?.toUpperCase()}
            </Avatar>

            <Box flex={1} textAlign={{ xs: "center", md: "left" }}>
              <Box display="flex" alignItems="center" gap={1} justifyContent={{ xs: "center", md: "flex-start" }}>
                <Typography variant="h3" fontWeight="bold">
                  {host.name}
                </Typography>
                {host.role === "host" && (
                  <Chip
                    icon={<VerifiedIcon />}
                    label="Verified Host"
                    size="small"
                    sx={{
                      backgroundColor: "rgba(255,255,255,0.25)",
                      color: "white",
                      fontWeight: "bold",
                      backdropFilter: "blur(10px)",
                    }}
                  />
                )}
              </Box>

              {/* Contact Info مع روابط تفاعلية */}
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={3}
                mt={3}
                alignItems="center"
                justifyContent={{ xs: "center", md: "flex-start" }}
              >
                {host.email && (
                  <Tooltip title="Send Email">
                    <Button
                      startIcon={<EmailIcon />}
                      href={`mailto:${host.email}`}
                      sx={{ color: "white", textTransform: "none" }}
                    >
                      {host.email}
                    </Button>
                  </Tooltip>
                )}

                {host.phone && (
                  <Tooltip title="Chat on WhatsApp">
                    <Button
                      startIcon={<PhoneIcon />}
                      onClick={() => openWhatsApp(host.phone)}
                      sx={{ color: "white", textTransform: "none" }}
                    >
                      {host.phone}
                    </Button>
                  </Tooltip>
                )}

                {/* زرار الشات */}
                {myId && myId !== hostId && (
                  <Button
                    variant="contained"
                    startIcon={<MessageIcon />}
                    onClick={startConversation}
                    sx={{
                      backgroundColor: "rgba(255,255,255,0.25)",
                      backdropFilter: "blur(10px)",
                      "&:hover": { backgroundColor: "rgba(255,255,255,0.35)" },
                    }}
                  >
                    Message Host
                  </Button>
                )}
              </Stack>

              {/* الإحصائيات */}
              <Stack direction="row" spacing={4} mt={4} justifyContent={{ xs: "center", md: "flex-start" }}>
                <Box textAlign="center">
                  <Typography variant="h5" fontWeight="bold">{totalProperties}</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>Properties</Typography>
                </Box>
                <Box textAlign="center">
                  <Typography variant="h5" fontWeight="bold">{hotels.length}</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>Hotels</Typography>
                </Box>
                <Box textAlign="center">
                  <Typography variant="h5" fontWeight="bold">{experiences.length}</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>Experiences</Typography>
                </Box>
              </Stack>

              <Box display="flex" alignItems="center" gap={1} mt={3} justifyContent={{ xs: "center", md: "flex-start" }}>
                <CalendarIcon fontSize="small" />
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Joined {joinDate}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Paper>

        {/* About Section */}
        {host.bio && (
          <Paper elevation={0} sx={{ p: 4, borderRadius: 3, mb: 4 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              About {host.name}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
              {host.bio}
            </Typography>
          </Paper>
        )}

        {/* Tabs للفنادق والتجارب */}
        <Paper elevation={0} sx={{ borderRadius: 3, overflow: "hidden" }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider", bgcolor: "white" }}>
            <Tabs value={activeTab} onChange={handleTabChange} centered>
              <Tab icon={<HomeIcon />} label={`Hotels (${hotels.length})`} />
              <Tab icon={<ExploreIcon />} label={`Experiences (${experiences.length})`} />
            </Tabs>
          </Box>

          <Box sx={{ p: 4 }}>
            {activeTab === 0 && (
              hotels.length > 0 ? (
                <Grid container spacing={3}>
                  {hotels.map((hotel) => (
                    <Grid item xs={12} sm={6} md={4} key={hotel._id}>
                      {renderPropertyCard(hotel, "hotel")}
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Box textAlign="center" py={10}>
                  <HomeIcon sx={{ fontSize: 80, color: "grey.400", mb: 2 }} />
                  <Typography variant="h6" color="text.secondary">
                    No hotels listed yet
                  </Typography>
                </Box>
              )
            )}

            {activeTab === 1 && (
              experiences.length > 0 ? (
                <Grid container spacing={3}>
                  {experiences.map((exp) => (
                    <Grid item xs={12} sm={6} md={4} key={exp._id}>
                      {renderPropertyCard(exp, "experiance")}
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Box textAlign="center" py={10}>
                  <ExploreIcon sx={{ fontSize: 80, color: "grey.400", mb: 2 }} />
                  <Typography variant="h6" color="text.secondary">
                    No experiences listed yet
                  </Typography>
                </Box>
              )
            )}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}