import { useState} from "react";
import { Link } from "react-router-dom";
import {useNavigate} from "react-router-dom";
import {useAuthContext} from "../../Context/AuthContext";
import {Card, CardContent, CardHeader, CardTitle, CardFooter} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {toast} from "sonner";
import API from "../../services/api";


export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const {setUser, setToken, setRole} = useAuthContext();


    const handleLogin = async ()=>{
        if(!email || !password) {
            toast("please fill in all fields");
            return;
        }
        setLoading(true);
        try{
            const res = await API.post("/auth/login", {email, password});
            const {token, user} = res.data
            const role = user?.role || "customer";

            setUser(user);
            setToken(token);
            setRole(user.role);

            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));
            localStorage.setItem("role", user.role);

            toast.success( `welcome back, ${user.name || "User"}!`);
            if(user.role.toLowerCase() === "customer") navigate("/customer/dashboard");
            else if(user.role.toLowerCase() === "mamafua") navigate("/mamafua/dashboard");
            else navigate("/");
        } catch(err) {
            toast.error(err?.response?.data?.message || "invalid email or password");
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
            <Card className="w-full max-w-sm shadow-md border animate-fade-in">
                <CardHeader>
                    <CardTitle className="text-center text-2xl font-bold text-blue-600">
                        Welcome To Mamafua App
                    </CardTitle>
                    <p className="text-center text-sm text-gray-500">
                        Login to Access Your Dashbaord
                    </p>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e)=>setEmail(e.target.value)}
                        autoComplete="off"
                    />

                    <Input
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e)=>setPassword(e.target.value)}
                        autoComplete="new-password"
                    />
                </CardContent>
                <CardFooter className="flex flex-col items-center">
                    <Button
                        onClick={handleLogin}
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                        {loading? "logging in..." : "log in"}
                    </Button>
                    <p className="text-center mt-3 text-sm">
                        Do not have an account?{" "}
                        <Link to="/Signup"className="text-blue-500 hover:underline">Sign up</Link>
                    </p>
                </CardFooter>
                
            </Card>

        </div>
    )
}