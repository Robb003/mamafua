import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { toast } from "sonner";

export default function Booking() {
  const [services, setServices] = useState([]);
  const [mamafuas, setMamafuas] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [selectedService, setSelectedService] = useState("");
  const [selectedMamafua, setSelectedMamafua] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Fetch services, mamafuas, and user's bookings
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [serviceRes, mamafuaRes, bookingRes] = await Promise.all([
          API.get("/service"),
          API.get("/user/all"),
          API.get("/booking"),
        ]);
        setServices(serviceRes.data);
        setMamafuas(mamafuaRes.data);
        setBookings(bookingRes.data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load services, mamafuas, or bookings");
      }
    };
    fetchData();
  }, []);

  // Create a new booking
  const handleBooking = async () => {
    if (!selectedService || !selectedMamafua || !location) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      const response = await API.post("/booking", {
        service: selectedService,
        mamafua: selectedMamafua,
        location,
      });

      toast.success("Booking created successfully!");
      setBookings((prev) => [...prev, response.data]);
      setSelectedService("");
      setSelectedMamafua("");
      setLocation("");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  // Delete a booking
  const handleDeleteBooking = async (id) => {
    try {
      await API.delete(`/booking/${id}`);
      toast.success("Booking deleted!");
      setBookings((prev) => prev.filter((b) => b._id !== id));
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete booking");
    }
  };

  return (
    <div className="flex flex-col items-center mt-10 space-y-10">
      {/* Create Booking */}
      <Card className="w-[400px] shadow-lg">
        <CardHeader>
          <CardTitle>Book a Laundry Service</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Select Service */}
          <Select onValueChange={setSelectedService} value={selectedService}>
            <SelectTrigger>
              <SelectValue placeholder="Select Service" />
            </SelectTrigger>
            <SelectContent>
              {services.map((service) => (
                <SelectItem key={service._id} value={service._id}>
                  {service.name} - Ksh {service.price}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Select Mamafua */}
          <Select onValueChange={setSelectedMamafua} value={selectedMamafua}>
            <SelectTrigger>
              <SelectValue placeholder="Select Mamafua" />
            </SelectTrigger>
            <SelectContent>
              {mamafuas.length > 0 ? (
                mamafuas.map((m) => (
                  <SelectItem key={m._id} value={m._id}>
                    {m.name} ({m.email})
                  </SelectItem>
                ))
              ) : (
                <SelectItem disabled>No Mamafuas available</SelectItem>
              )}
            </SelectContent>
          </Select>

          {/* Location Input */}
          <Input
            placeholder="Enter your location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />

          <Button onClick={handleBooking} disabled={loading}>
            {loading ? "Creating..." : "Book Service"}
          </Button>
        </CardContent>
      </Card>

      {/* List of Bookings */}
      <Card className="w-[600px] shadow-md">
        <CardHeader>
          <CardTitle>My Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          {bookings.length === 0 ? (
            <p className="text-center text-gray-500">No bookings yet.</p>
          ) : (
            <div className="space-y-3">
              {bookings.map((booking) => (
                <div
                  key={booking._id}
                  className="flex justify-between items-center border p-3 rounded-lg"
                >
                  <div>
                    <p className="font-semibold">{booking.service?.name}</p>
                    <p className="text-sm text-gray-500">
                      Mamafua: {booking.mamafua?.name || "N/A"} | {booking.location}
                    </p>
                    <p className="text-sm">
                      Status:{" "}
                      <span
                        className={
                          booking.status === "accepted"
                            ? "text-green-600"
                            : booking.status === "rejected"
                            ? "text-red-600"
                            : "text-yellow-600"
                        }
                      >
                        {booking.status}
                      </span>
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="destructive"
                      onClick={() => handleDeleteBooking(booking._id)}
                    >
                      Delete
                    </Button>

                    {booking.status === "accepted" || booking.status === "rejected" && (
                      <Button
                        onClick={() =>
                          navigate(`/review/${booking.mamafua._id}/${booking._id}`)
                        }
                        className="bg-purple-600 text-white hover:bg-purple-700"
                      >
                        Write Review
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
