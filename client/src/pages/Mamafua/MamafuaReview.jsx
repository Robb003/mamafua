import { useState, useEffect } from "react";
import API from "../../services/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Star } from "lucide-react";

export default function MamafuaReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await API.get("/review/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReviews(res.data);
    } catch (err) {
      toast.error("Failed to load your reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
        <p className="mt-2 text-gray-500">Loading reviews...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-blue-600 text-center">
        Customer Reviews
      </h2>

      {reviews.length === 0 ? (
        <p className="text-gray-500 text-center">No reviews yet.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((r) => (
            <Card key={r._id} className="shadow-sm border">
              <CardHeader>
                <CardTitle className="text-lg text-blue-600">
                  {r.customer?.name || "Anonymous"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-gray-700">{r.comment}</p>
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < r.rating ? "text-yellow-500" : "text-gray-300"
                      }`}
                      fill={i < r.rating ? "currentColor" : "none"}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
