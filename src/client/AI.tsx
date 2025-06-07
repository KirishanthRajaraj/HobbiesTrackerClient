import axios from "axios";
const API_URL = "http://localhost:8080";

export const getGoogleAIResponse = async (prompt: String) => {
    return axios.post(`${API_URL}/getGoogleAIResponse/`, {prompt});
}