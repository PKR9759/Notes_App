import { useState } from "react";
import api from "../config/api";
import { useNavigate } from "react-router-dom";


const Register = () => {

    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    
    const handleRegister = async (e) => {

        e.preventDefault();
        try {
            const response = await api.post("/auth/register", {
                name,
                email,
                password
            });
            console.log(response.data);
            navigate("/login");
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-full max-w-md p-6 shadow rounded">
                <h1 className="text-3xl font-bold mb-6">Register</h1>

                <form onSubmit={handleRegister} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Name"
                        className="w-full border p-3 rounded"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

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

                    <button  className="w-full bg-green-600 text-white py-3 rounded">
                        Register
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Register;