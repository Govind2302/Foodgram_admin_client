// Use environment variable if available, otherwise use production URL
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://foodgram-spring-backend-for-delivery-person-production.up.railway.app';

const config = {
    BASE_URL: BASE_URL,
    ADMIN_API: `${BASE_URL}/api/admin`,
    RESTAURANT_API: `${BASE_URL}/api/admin/restaurants`
}

export default config