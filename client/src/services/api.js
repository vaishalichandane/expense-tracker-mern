import axios from 'axios';

const API = axios.create({
 baseURL:
'https://expense-tracker-backend.onrender.com/api',
});

export default API;