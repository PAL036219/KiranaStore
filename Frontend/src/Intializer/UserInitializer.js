// UserInitializer.js
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setuserdetail } from '../reduxstore/userSlice';

const UserInitializer = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Check if user data exists in localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        if (user && user._id) {
          dispatch(setuserdetail(user));
        }
      } catch (error) {
        console.error('Error parsing user data from localStorage:', error);
        localStorage.removeItem('user');
      }
    }
  }, [dispatch]);

  return null;
};

export default UserInitializer;