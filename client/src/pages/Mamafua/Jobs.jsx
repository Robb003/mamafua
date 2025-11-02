import { useState, useEffect } from "react";
import API from "../../services/api";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function Jobs() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch bookings for the logged-in Mamafua
  const fetchBookings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await API.get("/booking", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  // Update booking status (accept/reject)
  const updateStatus = async (id, action) => {
    try {
      const token = localStorage.getItem("token");
      await API.put(`/booking/${id}/${action}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success(`Booking ${action === "accept" ? "accepted" : "rejected"}`);

      // Update the UI immediately
      setBookings(prev =>
        prev.map(b =>
          b._id === id
            ? { ...b, status: action === "accept" ? "accepted" : "rejected" }
            : b
        )
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status");
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
        <p className="ml-2 text-gray-600">Loading jobs...</p>
      </div>
    );
  }

  return (
    <div className="p-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {bookings.length === 0 ? (
        <p className="text-gray-500 text-center col-span-full">No jobs yet</p>
      ) : (
        bookings.map(b => (
          <Card key={b._id} className="shadow-sm border">
            <CardHeader>
              <CardTitle className="text-lg text-blue-600">
                {b.service?.name || "Service"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p><strong>Customer:</strong> {b.customer?.name}</p>
              <p><strong>Location:</strong> {b.location}</p>
              <p><strong>Price:</strong> KES {b.price}</p>
              <p>
                <strong>Status:</strong>{" "}
                <span
                  className={`${
                    b.status === "accepted"
                      ? "text-green-600"
                      : b.status === "rejected"
                      ? "text-red-600"
                      : "text-gray-600"
                  } font-semibold`}
                >
                  {b.status}
                </span>
              </p>
            </CardContent>
            {b.status === "pending" && (
              <CardFooter className="flex justify-between">
                <Button
                  onClick={() => updateStatus(b._id, "accept")}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Accept
                </Button>
                <Button
                  onClick={() => updateStatus(b._id, "reject")}
                  variant="destructive"
                >
                  Reject
                </Button>
              </CardFooter>
            )}
          </Card>
        ))
      )}
    </div>
  );
}
