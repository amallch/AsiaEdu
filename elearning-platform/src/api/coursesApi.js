const API_URL = "http://localhost:5000/api/courses";

export const getCourses = async () => {
    const response = await fetch(API_URL);

    if (!response.ok) {
        throw new Error("Failed to fetch courses");
    }

    return await response.json();
};