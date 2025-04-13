// API configuration
const API_URL = import.meta.env.PROD 
  ? 'https://ls-test-9u2h9k6g-chris-projects-9278abaa.vercel.app/api'
  : 'http://localhost:5000/api';

export { API_URL }; 