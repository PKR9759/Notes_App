import React, { useState } from "react";
import api from "../config/api";
import { useNavigate } from "react-router-dom";


const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    
    const handleLogin = async (e) => {
        console.log('logg1')
        e.preventDefault();
        try {
            const response = await api.post("/auth/login", {
                email,
                password
            });
            console.log(response.data);
            localStorage.setItem("token", response.data.token);
            navigate("/");
            
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-full max-w-md p-6 shadow rounded">
                <h1 className="text-3xl font-bold mb-6">Login</h1>

                <form onSubmit={handleLogin} className="space-y-4">
                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full border p-3 rounded"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full border p-3 rounded"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button  className="w-full bg-blue-600 text-white py-3 rounded">
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;