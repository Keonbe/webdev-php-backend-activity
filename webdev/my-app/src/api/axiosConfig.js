import axios from "axios";

const api = axios.create({
  // Updated baseURL to match project location under htdocs/XAMPP
  baseURL:
    "http://localhost/website/webdev-php-backend-activity/webdev/php-backend/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
