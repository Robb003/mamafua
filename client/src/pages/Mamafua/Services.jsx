import { useState, useEffect } from "react";
import API from "../../services/api";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2, Trash2 } from "lucide-react";

export default function Services() {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState({ name: "", description: "", price: "" });
  const [loading, setLoading] = useState(false);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await API.get("/service/mamafua", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setServices(res.data);
    } catch (err) {
      toast.error("Failed to load your services");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.name || !form.description || !form.price) {
      toast("Please fill all required fields");
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await API.post("/service", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Service created successfully");
      setForm({ name: "", description: "", price: "" });
      setServices((prev) => [...prev, res.data]);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to create service");
    } finally {
      setLoading(false);
    }
  };

  const deleteService = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await API.delete(`/service/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Service removed successfully");
      setServices((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to delete service");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
        <p className="mt-2 text-gray-500">Loading services...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Form */}
      <Card className="max-w-md mx-auto border shadow-sm">
        <CardHeader>
          <CardTitle className="text-blue-600 text-lg">Add New Service</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input
            name="name"
            placeholder="Service name"
            value={form.name}
            onChange={handleChange}
          />
          <Textarea
            name="description"
            placeholder="Service description"
            value={form.description}
            onChange={handleChange}
          />
          <Input
            name="price"
            type="number"
            placeholder="Service price (KES)"
            value={form.price}
            onChange={handleChange}
          />
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin mr-2 h-4 w-4" /> Adding...
              </>
            ) : (
              "Add Service"
            )}
          </Button>
        </CardFooter>
      </Card>

      {/* Services List */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {services.length === 0 ? (
          <p className="text-gray-500 text-center col-span-full">
            No services added yet.
          </p>
        ) : (
          services.map((s) => (
            <Card key={s._id} className="shadow-sm border">
              <CardHeader>
                <CardTitle className="text-lg text-blue-600">{s.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 mb-2">{s.description}</p>
                <p className="font-semibold text-gray-800">KES {s.price}</p>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteService(s._id)}
                >
                  <Trash2 className="h-4 w-4 mr-1" /> Delete
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
