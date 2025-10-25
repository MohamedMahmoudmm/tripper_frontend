import PopularHomesCarousel from "../components/PopularHomesCarousel";

export default function ExperiencePage() {
    const experience = [
        { image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=60", title: "Scuba Diving in Red Sea", price: "2,500 ج.م / person", rating: 4.9, }, { image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=60", title: "Private Yoga Training", price: "1,200 ج.م / session", rating: 4.8, }, { image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=60", title: "Egyptian Cooking Class", price: "1,800 ج.م / class", rating: 5.0, }, { image: "https://images.unsplash.com/photo-1544986581-efac024faf62?auto=format&fit=crop&w=800&q=60", title: "Desert Safari Adventure", price: "3,400 ج.م / person", rating: 4.7, }, { image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=60", title: "Photography Tour in Cairo", price: "2,000 ج.م / trip", rating: 4.95, },
    ]
    return (
        <PopularHomesCarousel homes={experience} title="Top Experiences in Egypt"></PopularHomesCarousel>
    );
}