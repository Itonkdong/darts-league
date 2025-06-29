import axios from 'axios';

export default axios.create({
    // baseURL: 'http://localhost:8080/api/', // Direct backend access
    baseURL: '/api/', // Use relative path for Docker and Kubernetes Ingress routing
});
