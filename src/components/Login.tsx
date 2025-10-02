import { Button, TextField, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as AuthClient from '../client/auth.tsx';
// @ts-ignore
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const navigate = useNavigate();

    const [loginRequest, setLoginRequest] = React.useState({
        username: "",
        password: ""
    });

    const login = (e: React.FormEvent) => {
        e.preventDefault();

        try {
            AuthClient.login(loginRequest).then((res) => {
                console.log("Before navigate");
                navigate("/");
                console.log("After navigate");
            });
        } catch (error) {
            console.error("Login error:", error);
        }
    };

    return (
        <div className="wrapper signIn">
            <div className="form">
                <form className='flex flex-col items-center w-full' onSubmit={login}>
                    <div className='w-96 flex flex-col items-start'>
                        <div className="heading mb-4 border-b-white border-b-[1px]">LOGIN</div>

                        <Typography variant="h6" component="h2" color="seondary" className='mb-2! text-gray-400 focus:outline-[#ffcc00]!'>
                            Username
                        </Typography>

                        <TextField className='mb-4! w-full' variant="outlined" value={loginRequest.username} onChange={(e) => setLoginRequest((prev) => ({ ...prev, username: e.target.value }))}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    "& fieldset": {
                                        borderColor: "white",
                                        borderWidth: 1,
                                        borderRadius: "2px",
                                    },
                                    "&:hover fieldset": {
                                        borderColor: "white",
                                        borderWidth: "2px",
                                    },
                                    "& input": {
                                        color: "white",
                                    }
                                },
                            }}></TextField>

                        <Typography variant="h6" component="h2" color="seondary" className='mb-2! text-gray-400 focus:outline-[#ffcc00]!'>
                            Password
                        </Typography>

                        <TextField type='password' className='mb-4! w-full' variant="outlined" color='primary' value={loginRequest.password} onChange={(e) => setLoginRequest((prev) => ({ ...prev, password: e.target.value }))}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    "& fieldset": {
                                        borderColor: "white",
                                        borderWidth: 1,
                                        borderRadius: "2px",
                                    },
                                    "&:hover fieldset": {
                                        borderColor: "white",
                                        borderWidth: "2px",
                                    },
                                    "& input": {
                                        color: "white",
                                    }
                                },
                            }}></TextField>

                        <Button type='submit' className='mt-5 bg-yellow-400 hover:bg-yellow-300 text-black font-semibold px-4 py-2 rounded-xl shadow-md transition duration-200 hover:border-[#ffcc00]!' variant='outlined'>Login</Button>

                        <p className='mt-4 text-gray-400'>
                            Don't have an account ? <Link className='text-yellow-400! border-b-yellow-400  border-b-[1px]' to="/register"> Register </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}
