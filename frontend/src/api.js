import axios from 'axios';

export default axios.create({
    // baseURL: 'http://localhost:8080/api/', // Docker Compose direct backend access
    baseURL: '/api/', // Use relative path for Kubernetes Ingress routing
});
