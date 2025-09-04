import * as React from "react";
import axios from "axios";
import type { Hobby } from "../interfaces/Hobby";
import type { Point } from "../interfaces/Point";
import type dayjs from "dayjs";
import type { HobbyDates } from "../interfaces/HobbyDates";

const API_URL = "http://localhost:8080";
//const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getAllHobbies = async () => {
    return axios.get(`${API_URL}/getAllHobbies`, { withCredentials: true });
}

export const getHobbyById = async (hobbyId: number) => {
    return axios.get(`${API_URL}/getHobbyById/${hobbyId}`, { withCredentials: true });
}

export const postHobby = async (hobby: Hobby) => {
    return axios.post(`${API_URL}/addHobby`, hobby, { withCredentials: true });
}

export const editHobby = async (id: number, hobby: Hobby) => {
    return axios.put(`${API_URL}/editHobby/${id}`, hobby, { withCredentials: true });
}

export const patchHobby = async (id: number, hobby: Hobby) => {
    return axios.patch(`${API_URL}/patchHobby/${id}`, hobby), { withCredentials: true };
}

export const deleteHobby = async (id: number) => {
    return axios.delete(`${API_URL}/deleteHobby/${id}`, { withCredentials: true });
}

export const updateHobbyIntervalDate = async (hobbyDate: HobbyDates): Promise<HobbyDates> => {
    const response = await axios.put(`${API_URL}/updateHobbyIntervalDate/`, hobbyDate, { withCredentials: true });
    return response.data;
};

export const removeHobbyIntervalDate = async (hobbyDates: HobbyDates) => {
    return axios.delete(`${API_URL}/removeHobbyIntervalDate/`, { data: hobbyDates, withCredentials: true });
}

export const updateHobbyDate = async (hobbyDate: HobbyDates): Promise<HobbyDates> => {
    const response = await axios.put(`${API_URL}/updateHobbyDate/`, hobbyDate, { withCredentials: true });
    return response.data;
};

export const removeHobbyDate = async (hobbyDates: HobbyDates) => {
    return axios.delete(`${API_URL}/removeHobbyDate/`, { data: hobbyDates, withCredentials: true });
}

export const getAllHobbyDates = async () => {
    return axios.get(`${API_URL}/getAllHobbyDates/`, { withCredentials: true });
}

export const getIntervalDatesByHobbyId = async (hobbyId: number) => {
    return axios.get(`${API_URL}/getIntervalDatesByHobbyId/${hobbyId}`, { withCredentials: true });
}

export const getHobbyDatesByHobbyId = async (hobbyId: number) => {
    return axios.get(`${API_URL}/getHobbyDatesByHobbyId/${hobbyId}`, { withCredentials: true });
}

export const updateHobbyPoints = async (hobbyId: number): Promise<number> => {
    const response = await axios.put(`${API_URL}/updateHobbyPoints/${hobbyId}`, { withCredentials: true });
    return response.data;
}

export const removeHobbyPoints = async (hobbyId: number) => {
    const response = await axios.delete(`${API_URL}/removeHobbyPoints/${hobbyId}`, { withCredentials: true });
    return response.data;
}