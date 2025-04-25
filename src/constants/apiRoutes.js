import requireAuth from '../middlewares/requireAuth.js';
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
];

export default apiRoutes;
