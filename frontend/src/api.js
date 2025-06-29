import axios from 'axios';

// Get the API URL from environment or use default
// Note: If using the full URL from Render.com, we don't need to append '/api/' as it's already included
const API_URL = "https://darts-league-backend-nodj.onrender.com/api/";

export default axios.create({
    // Deployment options:
    // Local development: 'http://localhost:8080/api/'
    // Docker/Kubernetes: '/api/'
    // Render.com: The full URL from VITE_API_URL environment variable
    baseURL: API_URL,
});
