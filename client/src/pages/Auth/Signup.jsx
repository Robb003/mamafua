import { useState} from "react";
import { Link } from "react-router-dom";
import {useNavigate} from "react-router-dom";
import {useAuthContext} from "../../Context/AuthContext";
import {Card, CardContent, CardHeader, CardTitle, CardFooter} from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import API from "../../services/api";


export default function Signup() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("customer")
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const {setUser, setToken, setRole: setUserRole } = useAuthContext();


    const handleSignup = async ()=>{
        if(!name || !email || !phoneNumber || !password || !role) {
            toast({
                title: "missing fields",
                description: "please fill in all fields",
                variant: "destructive"
            });
            return
        }
        setLoading(true);
        try{
            const res = await API.post("/auth/signup", { name, email, phoneNumber, password, role});
            const {token, user} = res.data

            setUser(user);
            setToken(token);
            setUserRole(user.role);

            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));
            localStorage.setItem("role", user.role);

            toast.success(`Welcome aboard, ${user.name || "User"}!`);
            setName("");
            setEmail("");
            setPhoneNumber("");
            setPassword("");
            setRole("customer");
            if(user.role.toLowerCase() === "customer") navigate("/customer/dashboard");
            else if(user.role.toLowerCase() === "mamafua") navigate("/mamafua/dashboard");
            else navigate("/");
        } catch(err) {
            toast.error(err?.response?.data?.message || "Error creating account");
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
            <Card className="w-full max-w-sm shadow-md border animate-fade-in">
                <CardHeader>
                    <CardTitle className="text-center text-2xl font-bold text-blue-600">
                        Create Your Account
                    </CardTitle>
                    <p className="text-center text-sm text-gray-500">
                        Join as Customer or Mamafua
                    </p>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Input
                        type="text"
                        placeholder="Enter your name"
                        value={name}
                        onChange={(e)=>setName(e.target.value)}
                        autoComplete="off"
                    />
                    <Input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e)=>setEmail(e.target.value)}
                        autoComplete="off"
                    />
                    <Input
                        type="tel"
                        placeholder="Enter your phoneNumber"
                        value={phoneNumber}
                        onChange={(e)=>setPhoneNumber(e.target.value)}
                        autoComplete="off"
                    />
                    <Input
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e)=>setPassword(e.target.value)}
                        autoComplete="new-password"
                    />

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Select Role</label>
                        <Select value={role} onValueChange={setRole}>
                            <SelectTrigger>
                                <SelectValue placeholder="Choose your role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="customer">Customer</SelectItem>
                                <SelectItem value="mamafua">Mamafua</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col items-center">
                    <Button
                        onClick={handleSignup}
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                        {loading? "Creating Account..." : "Sign up"}
                    </Button>
                    <p className="text-center mt-3 text-sm">
                        Already have an account?{" "}
                        <Link to="/Login"className="text-blue-500 hover:underline">Login</Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}