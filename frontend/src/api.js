import axios from 'axios';

const API_URL = "https://darts-league-backend-nodj.onrender.com/api/";

export default axios.create({
    // Deployment options:
    // Local development: 'http://localhost:8080/api/'
    // Docker/Kubernetes: '/api/'
    // Render.com: The full API_URL
    baseURL: API_URL,
});

export const imgPath = "https://darts-league-backend-nodj.onrender.com"
