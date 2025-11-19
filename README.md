# Facebook Clone

- Its a Facebook look-alike social media web-app implemented through MERN Stack
- In this you can post in realtime with images
- It has a custom user login and registration using NodeJS and MongoDB
- It also has Google OAuth authentication
- Realtime Chat Messenger implemented using MERN and Pusher

## App Link
- https://facebook-clone-314905.web.app/

## App Preview

![facebook](Screenshots/Screenshot1.jpg)
![facebook](Screenshots/Screenshot2.jpg)
![facebook](Screenshots/Screenshot5.jpg)
![facebook](Screenshots/Screenshot6.jpg)
![facebook](Screenshots/Screenshot7.jpg)
![facebook](Screenshots/Screenshot8.jpg)
![facebook](Screenshots/Screenshot3.jpg)
![facebook](Screenshots/Screenshot4.jpg)

## Deployment on Render

This project consists of two separate services that need to be deployed on Render:

### Prerequisites

1. A MongoDB Atlas database (or other MongoDB provider)
2. Pusher account for realtime features
3. Google OAuth credentials (optional, for Google login)

### Backend Deployment (Node.js/Express)

1. **Create a new Web Service on Render**
   - Connect your GitHub repository
   - Select the `facebook-backend` folder as the root directory
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Environment: `Node`

2. **Configure Environment Variables**
   
   Add the following environment variables in Render dashboard:
   
   ```
   MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
   JWT_SECRET=your_secure_random_string_here
   PORT=10000
   PUSHER_APP_ID=your_pusher_app_id
   PUSHER_KEY=your_pusher_key
   PUSHER_SECRET=your_pusher_secret
   PUSHER_CLUSTER=your_pusher_cluster
   ```
   
   **Note**: Render automatically sets the `PORT` variable, but you can override it if needed.

3. **Deploy**
   - Click "Create Web Service"
   - Wait for the deployment to complete
   - Note your backend URL (e.g., `https://your-backend.onrender.com`)

### Frontend Deployment (React)

1. **Create a new Static Site on Render**
   - Connect your GitHub repository
   - Select the `facebook` folder as the root directory
   - Build Command: `npm install && npm run build`
   - Publish Directory: `build`

2. **Configure Environment Variables**
   
   Add the following environment variable in Render dashboard:
   
   ```
   REACT_APP_BACKEND_URL=https://your-backend.onrender.com/
   ```
   
   Replace `https://your-backend.onrender.com/` with your actual backend URL from the previous step.
   
   **Optional** (if using Google OAuth):
   ```
   REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
   ```

3. **Deploy**
   - Click "Create Static Site"
   - Wait for the deployment to complete

### Important Notes

- **Root Directory**: Make sure to set the correct root directory for each service:
  - Backend: `facebook-backend`
  - Frontend: `facebook`
  
- **CORS**: The backend is configured to accept requests from any origin. For production, you may want to restrict CORS to your frontend domain only.

- **MongoDB Atlas**: Make sure your MongoDB Atlas cluster allows connections from anywhere (0.0.0.0/0) or whitelist Render's IP addresses.

- **Pusher**: You can get free Pusher credentials at https://pusher.com/

- **Auto-Deploy**: Render automatically redeploys your services when you push to your connected GitHub branch.

### Local Development

#### Backend
```bash
cd facebook-backend
cp .env.example .env
# Edit .env with your actual credentials
npm install
npm start
```

#### Frontend
```bash
cd facebook
cp .env.example .env
# Edit .env with your backend URL (http://localhost:9000/ for local development)
npm install
npm start
```

### Troubleshooting

- **Backend fails to start**: Check that all environment variables are set correctly, especially `MONGO_URL` and Pusher credentials.
- **Frontend can't connect to backend**: Verify that `REACT_APP_BACKEND_URL` is set correctly and includes the trailing slash.
- **Database connection issues**: Ensure MongoDB Atlas firewall allows connections from anywhere or whitelist Render's IPs.
- **Build failures**: Clear the build cache in Render dashboard and try redeploying.
