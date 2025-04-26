import requireAuth from '../middlewares/requireAuth.js';
import playlistRouter from '../routes/playlistRoutes.js';
import profileRouter from '../routes/profileRoute.js';
import userRouter from '../routes/user.js';
const apiRoutes = [
  {
    baseResource: 'user',
    router: userRouter,
    middlewares: [], // Optional additional middleware for this route
  },
  {
    baseResource: 'profile',
    router: profileRouter,
    middlewares: [requireAuth],
  },
  {
    baseResource: 'playlist',
    router: playlistRouter,
    middlewares: [requireAuth],
  },
];

export default apiRoutes;
