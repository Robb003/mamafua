const Service = require("../models/Service");

exports.getAllServices = async(req, res) => {
    try {
        let query = {};
        if(req.user.role === "mamafua"){
            query = {mamafua: req.user.id};
        }
    const service = await Service.find(query).populate("mamafua", " name email");
    res.json(service);
    } catch (error) {
        res.status(500).send(error)
    }
};

exports.createService = async(req, res) =>{
    try {
        if(req.user.role !== "mamafua"){
            return res.status(403).json({message: "Only mamafua can create a service"})
        }
    const service = await Service.create({...req.body, mamafua: req.user.id});
    res.json(service);
    } catch (error) {
        res.status(500).send(error)
    }
};

exports.deleteService = async(req, res) => {
    try {
        const service = await Service.findById(req.params.id)
        if(!service){
            return res.status(404).json({message: "service not found"})
        }
        if(req.user.role !== "mamafua" || service.mamafua.toString() !== req.user.id){
            return res.status(403).json({message: "Only mamafua can delete a service"})
        }
    await Service.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted"});
    } catch (error) {
        res.status(500).send(error)
    }
};