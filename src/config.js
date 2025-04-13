// API configuration
const API_URL = import.meta.env.VITE_BACKEND_URL || 
  (import.meta.env.PROD 
    ? 'https://locscout-backend.vercel.app/api'  // Production backend URL
    : 'http://localhost:5000/api');              // Development backend URL

export { API_URL }; 