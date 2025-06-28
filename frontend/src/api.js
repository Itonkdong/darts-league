import axios from 'axios';

export default axios.create({
    // baseURL: 'http://localhost:8000/api/', // adjust later if needed
    baseURL: 'http://localhost:8080/api/', // adjust later if needed
});
