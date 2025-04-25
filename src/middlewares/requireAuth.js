import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

const requireAuth = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ error: 'You must be logged in' });
  }
  const token = authorization.split(' ')[1];
  // if (!token) {
  //   return res.status(401).json({ error: 'Token missing' });
  // }
  try {
    const { _id } = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await User.findById(_id);
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'You must be logged in' });
  }
};

export default requireAuth;

// how it will be used in frontend
// import axios from 'axios';

// const fetchProfile = async () => {
//   try {
//     const response = await axios.get('http://localhost:5000/profile', {
//       headers: {
//         Authorization: `Bearer ${localStorage.getItem('token')}`,
//         //
//         // no
//       },
//     });
//     console.log(response.data);
//   } catch (error) {
//     console.error(error);
//   }
// };
