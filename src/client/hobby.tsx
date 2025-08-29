import * as React from "react";
import axios from "axios";
import type { Hobby } from "../interfaces/Hobby";
import type { Point } from "../interfaces/Point";
import type dayjs from "dayjs";
import type { HobbyDates } from "../interfaces/HobbyDates";

const API_URL = "http://localhost:8080";
//const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getAllHobbies = async () => {
    return axios.get(`${API_URL}/getAllHobbies`);
}

export const postHobby = async (hobby: Hobby) => {
    return axios.post(`${API_URL}/addHobby`, hobby);
}

export const editHobby = async (id: number, hobby: Hobby) => {
    return axios.put(`${API_URL}/editHobby/${id}`, hobby);
}

export const deleteHobby = async (id: number) => {
    return axios.delete(`${API_URL}/deleteHobby/${id}`);
}

export const updateHobbyDate = async (hobbyDate: HobbyDates): Promise<HobbyDates> => {
    const response = await axios.put(`${API_URL}/updateHobbyDate/`, hobbyDate);
    return response.data;
};

export const removeHobbyDate = async (hobbyDates: HobbyDates) => {
    return axios.delete(`${API_URL}/removeHobbyDate/`, { data: hobbyDates });
}

export const getAllHobbyDates = async () => {
    return axios.get(`${API_URL}/getAllHobbyDates/`);
}

export const updateHobbyPoints = async (hobbyId: number): Promise<number> => {
    const response = await axios.put(`${API_URL}/updateHobbyPoints/${hobbyId}`);
    return response.data;
}

export const removeHobbyPoints = async (hobbyId: number) => {
    const response = await axios.delete(`${API_URL}/removeHobbyPoints/${hobbyId}`);
    return response.data;
}