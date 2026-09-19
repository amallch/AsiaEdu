const API_URL = "https://asiaedu-backend.onrender.com/api/courses";

export const getCourses = async () => {
    const response = await fetch(API_URL);

    if (!response.ok) {
        throw new Error("Failed to fetch courses");
    }

    return await response.json();
};