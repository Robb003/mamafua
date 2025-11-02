import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import API from "../../services/api";

export default function Review() {
  const [reviews, setReviews] = useState([]);
  const [selectedMamafua, setSelectedMamafua] = useState("");
  const [selectedBooking, setSelectedBooking] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch all reviews for this customer
  const fetchReviews = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get("/customer/review", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReviews(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load reviews");
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // Create a new review
  const handleSubmit = async () => {
    if (!selectedMamafua || !selectedBooking || !comment.trim()) {
      toast.error("Please select a booking, Mamafua, and write your review");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await API.post(
        "/customer/review",
        {
          booking: selectedBooking,
          mamafua: selectedMamafua,
          comment,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Review submitted successfully!");
      setReviews((prev) => [...prev, res.data]);
      setSelectedBooking("");
      setSelectedMamafua("");
      setComment("");
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  // Delete a review
  const handleDelete = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      await API.delete(`/customer/review/${reviewId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Review deleted successfully!");
      setReviews((prev) => prev.filter((r) => r._id !== reviewId));
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to delete review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50 flex flex-col items-center space-y-6">
      {/* Create Review */}
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-blue-600 text-xl">Write a Review</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Booking ID"
            value={selectedBooking}
            onChange={(e) => setSelectedBooking(e.target.value)}
          />
          <Input
            placeholder="Mamafua ID"
            value={selectedMamafua}
            onChange={(e) => setSelectedMamafua(e.target.value)}
          />
          <Textarea
            placeholder="Write your review..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleSubmit}
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Review"}
          </Button>
        </CardFooter>
      </Card>

      {/* List of Reviews */}
      <Card className="w-full max-w-2xl shadow-md">
        <CardHeader>
          <CardTitle className="text-center text-blue-600 text-lg">My Reviews</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {reviews.length === 0 ? (
            <p className="text-gray-500 text-center">No reviews yet.</p>
          ) : (
            reviews.map((r) => (
              <Card key={r._id} className="shadow-sm border">
                <CardContent>
                  <p>
                    <strong>Booking ID:</strong> {r.booking?._id || "N/A"}
                  </p>
                  <p>
                    <strong>Mamafua:</strong> {r.mamafua?.name || "N/A"}
                  </p>
                  <p>
                    <strong>Comment:</strong> {r.comment}
                  </p>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={() => handleDelete(r._id)}
                    className="bg-red-600 hover:bg-red-700 w-full"
                  >
                    Delete
                  </Button>
                </CardFooter>
              </Card>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
