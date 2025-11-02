const Service = require("../models/Service");

exports.getAllServices = async (req, res) => {
  try {
    let query = {};

    if (req.user.role === "mamafua") {
      query = { mamafua: req.user.id };
    }

    const services = await Service.find(query).populate("mamafua", "name email");

    res.json(services);
  } catch (error) {
    console.error("Error fetching services:", error.message);
    res.status(500).json({ message: "Failed to fetch services" });
  }
};


exports.createService = async (req, res) => {
  try {
    if (req.user.role !== "mamafua") {
      return res.status(403).json({ message: "Only mamafua can create a service" });
    }

    const { name, description, price } = req.body;

    if (!name || !description || !price) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    const service = await Service.create({
      name,
      description,
      price,
      mamafua: req.user.id,
    });

    res.status(201).json(service);
  } catch (error) {
    console.error("Error creating service:", error.message);
    res.status(500).json({ message: "Failed to create service" });
  }
};

exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    if (req.user.role !== "mamafua" || service.mamafua.toString() !== req.user.id) {
      return res.status(403).json({ message: "You can only delete your own services" });
    }

    await service.deleteOne();
    res.json({ message: "Service deleted successfully" });
  } catch (error) {
    console.error("Error deleting service:", error.message);
    res.status(500).json({ message: "Failed to delete service" });
  }
};
