import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import API from "../../services/api";

export default function CustomerDashboard() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all available services
  const fetchServices = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await API.get("/service", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setServices(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load services");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
        <p className="mt-2 text-gray-500">Loading services...</p>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      {/* Captivating Welcome Paragraph */}
      <div className="max-w-3xl mx-auto mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Welcome to Mamafua Laundry Services!
        </h1>
        <p className="text-gray-600 text-lg">
          Explore a variety of professional laundry services offered by our trusted Mamafuas.
          From everyday wash & fold to delicate dry cleaning, we ensure your clothes receive the
          care they deserve. Scroll below to see all available services along with their details
          and prices.
        </p>
      </div>

      {/* Available Services */}
      <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">
        Available Services
      </h2>

      {services.length === 0 ? (
        <p className="text-gray-500 text-center">No services available at the moment.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <Card key={s._id} className="shadow-sm border">
              <CardHeader>
                <CardTitle className="text-lg text-blue-600">{s.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{s.description}</p>
                <p className="mt-2 font-semibold">KES {s.price}</p>
                <p className="mt-1 text-sm text-gray-500">
                  Mamafua: {s.mamafua?.name || "Unknown"}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
