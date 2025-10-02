import React, { use, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import * as AuthClient from '../client/auth.tsx';

const ProtectedRoute = ({ children }) => {
    const [authChecked, setAuthChecked] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        AuthClient.isAuthenticated().then((res) => {
            if (res.data !== null) {
                setIsAuthenticated(false)
                setAuthChecked(true)
            } else {
                setIsAuthenticated(true)
                setAuthChecked(true)
            }
        }).catch(() => {
            setIsAuthenticated(false)
            setAuthChecked(true)
        });
    }, []);

    useEffect(() => {
        console.log("ProtectedRoute mounted, isAuthenticated:", isAuthenticated, "authChecked:", authChecked);
    }, [isAuthenticated, authChecked]);

    if (!authChecked) return <div>Loading...</div>;

    //return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
