import { useState, useEffect } from "react";
import API from "../../services/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Briefcase, Star, Wrench } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function MamafuaDashboard() {
  const [stats, setStats] = useState({
    totalBookings: 0,
    completedBookings: 0,
    totalReviews: 0,
    totalServices: 0,
    averageRating: 0,
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      // Fetch bookings
      const bookingsRes = await API.get("/booking", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const bookings = bookingsRes.data;

      // Fetch reviews
      const reviewsRes = await API.get("/review/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const reviews = reviewsRes.data;

      // Fetch services (if you have a service route)
      const servicesRes = await API.get("/service/mamafua", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const services = servicesRes.data;

      // Compute stats
      const totalBookings = bookings.length;
      const completedBookings = bookings.filter(b => b.status === "accepted").length;
      const totalReviews = reviews.length;
      const averageRating =
        reviews.length > 0
          ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
          : 0;
      const totalServices = services.length;

      setStats({ totalBookings, completedBookings, totalReviews, totalServices, averageRating });
    } catch (err) {
      console.error(err);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen flex-col">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <p className="text-gray-500 mt-2">Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold text-gray-800 text-center">Mamafua Dashboard</h1>

      {/* Navigation Buttons (TOP SECTION) */}
      <div className="flex flex-wrap justify-center gap-4 pt-2 pb-4">
        <Button
          onClick={() => navigate("/mamafua/services")}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          <Wrench className="mr-2 h-4 w-4" /> My Services
        </Button>

        <Button
          onClick={() => navigate("/mamafua/reviews")}
          className="bg-yellow-500 hover:bg-yellow-600 text-white"
        >
          <Star className="mr-2 h-4 w-4" /> My Reviews
        </Button>

        <Button
          onClick={() => navigate("/mamafua/jobs")}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Briefcase className="mr-2 h-4 w-4" /> My Jobs
        </Button>
      </div>

      {/* Stats Cards (BOTTOM SECTION) */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Bookings */}
        <Card className="shadow-md border-l-4 border-blue-500">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Bookings</CardTitle>
            <Briefcase className="text-blue-500" />
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Total: {stats.totalBookings}</p>
            <p className="text-gray-600">Completed: {stats.completedBookings}</p>
          </CardContent>
        </Card>

        {/* Reviews */}
        <Card className="shadow-md border-l-4 border-yellow-500">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Reviews</CardTitle>
            <Star className="text-yellow-500" />
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Total Reviews: {stats.totalReviews}</p>
            <p className="text-gray-600">
              Average Rating: {stats.averageRating.toFixed(1)}
            </p>
          </CardContent>
        </Card>

        {/* Services */}
        <Card className="shadow-md border-l-4 border-green-500">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Services</CardTitle>
            <Wrench className="text-green-500" />
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Total Services: {stats.totalServices}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
