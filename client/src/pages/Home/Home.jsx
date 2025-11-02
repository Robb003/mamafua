import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Sparkles,HandHeart, Users } from "lucide-react";

export default function Home() {
    return(
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6 py-12">
        
                <h1 className="text-4xl font-bold text-blue-600 mb-3">
                    Welcome To Mamafua App
                </h1>
                <p className="text-gray-600 text-lg max-w-xl max-auto">
                    Connecting trusted cleaning professionals with customers easy fast and reliable
                </p>
                <div className="mt-6 flex gap-4 justify-center">
                    <Link to="/Login">
                        <Button className="bg-blue-600 hover:bg-blue-700 px-6">
                            Login
                        </Button>
                    </Link>

                    <Link to="/Signup">
                        <Button variant="outline" className="px-6">
                            Signup
                        </Button>
                    </Link>
                </div>
            

            <div className="grid md:grid-col-3 gap-6 w-full max-w-5xl">
                <Card className="shadow-sm border">
                    <CardHeader className="flex items-center justify-center">
                        <Sparkles className="h-10 w-10 text-blue-500" />
                            <CardTitle className="mt-2 text-lg font-semibold">
                                Hassle-free Cleaning
                            </CardTitle>
                        
                    </CardHeader>
                    <CardContent className="text-center text-gray-600">
                        Book a Mamafua anytime, anywhere.Clean homes,happy lives
                    </CardContent>
                </Card>

                <Card className="shadow-sm border">
                    <CardHeader className="flex items-center justify-center">
                        <Users className="h-10 w-10 text-lg text-blue-500" />
                        <CardTitle className="mt-2 text-lg font-semibold">
                            Trusted Professionals
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-center text-gray-600">
                        All Mamafuas are verified, rated and reviewed by real customers
                    </CardContent>
                </Card>

                <Card className="shadow-sm border">
                    <CardHeader className="flex items-center justify-center">
                        <HandHeart className="h-10 w-10 text-blue-500" />
                        <CardTitle className="mt-2 text-lg font-semibold">
                            Support Local Women
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-center text-gray-600">
                        Every booking empowers hardworking women in your community
                    </CardContent>
                </Card>
            </div>
            <footer className="w-full bg-blue-600 text-white py-4 text-center mt-auto">
             <p className="text-sm">
                © {new Date().getFullYear()} Mamafua App. All Rights Reserved. |
             </p>
            </footer>
         </div>
    );
}