const API_URL = "https://asiaedu-backend.onrender.com/api/reviews";

export const getReviews = async () => {
    const response = await fetch(API_URL);

    if (!response.ok) {
        throw new Error("Failed to fetch reviews");
    }

    return await response.json();
};