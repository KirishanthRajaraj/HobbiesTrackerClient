import * as React from "react";
import axios from "axios";

const API_URL = "http://localhost:8080";
//const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const register = async (registerRequest: object) => {
    return axios.post(`${API_URL}/auth/register`, registerRequest, { withCredentials: true });
}

export const login = async (loginRequest: object) => {
    return axios.post(`${API_URL}/auth/login`, loginRequest, { withCredentials: true });
}

export const isAuthenticated = async () => {
    return axios.get(`${API_URL}/auth/isAuthenticated`, { withCredentials: true });
}