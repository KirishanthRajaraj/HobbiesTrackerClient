import axios from "axios";
const API_URL = "http://localhost:8080";

export const getAllCategories = async () => {
    return axios.get(`${API_URL}/getAllCategories`, { withCredentials: true });
}