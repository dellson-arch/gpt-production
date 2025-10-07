Deployment notes for Render

Required environment variables (Render service settings):

- VITE_API_URL=https://gpt-production.onrender.com
- VITE_SOCKET_URL=https://gpt-production.onrender.com

Notes:
- The frontend uses `withCredentials: true` for auth requests and Socket.IO connections. The backend must set CORS origin to the frontend origin and set cookies with `httpOnly`, `secure` (in production), and `sameSite: 'none'` so cookies are sent cross-site.
- On Render, set the frontend URL as the `FRONTEND_URL` env var in the backend service (e.g., https://gpt-production.onrender.com) and ensure the backend's JWT secret is set (JWT_SECRET).
- After setting env vars, redeploy both services. If you see cookie warnings in the browser console (blocked third-party cookie), confirm `secure` and `sameSite='none'` are set and that you're using HTTPS.
