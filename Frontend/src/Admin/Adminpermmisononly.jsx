import React from 'react'
import { useSelector } from 'react-redux';
import IsAdmin from '../utils/isAdmin';
import { Navigate } from 'react-router-dom';

const AdminPermissionOnly = ({ children }) => {
    const user = useSelector((state) => state.user);
    
    // Check if user data is available and if they are admin
    if (!user || !user.role) {
        // Still loading user data
        return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
    }
    
    if (!IsAdmin(user.role)) {
        // Redirect to home page if not admin
        return <Navigate to="/" replace />;
    }
    
    return children;
}

export default AdminPermissionOnly;