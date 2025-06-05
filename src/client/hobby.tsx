import * as React from "react";
import axios from "axios";
import type { Hobby } from "../interfaces/Hobby";
import type { Point } from "../interfaces/Point";

const API_URL = "http://localhost:8080";
//const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getAllHobbies = async () => {
    return axios.get(`${API_URL}/getAllHobbies`);
}

export const postHobby = async (hobby: Hobby) => {
    return axios.post(`${API_URL}/addHobby`, hobby);
}

export const editHobby = async (id:number, hobby: Hobby) => {
    return axios.put(`${API_URL}/editHobby/${id}`, hobby);
}

export const deleteHobby = async (id:number) => {
    return axios.delete(`${API_URL}/deleteHobby/${id}`);
}