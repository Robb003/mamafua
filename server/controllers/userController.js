const User = require("../models/User");

exports.getAllMamafua = async(req, res) => {
     try {
            const mamafua = await User.find({role: "mamafua"}).select("-password");
            res.json(mamafua);
            } catch (error) {
                res.status(500).send(error)
         }
};

exports.getMyProfile = async(req, res) => {
     try {
        const user = await User.findById(req.user.id).select("-password");
        res.json(user);
        } catch (error) {
            res.status(500).send(error)
          }
 };

 exports.updateMyProfile = async(req, res) => {
    try {
        const allowedFields = ["name", "phoneNumber"];
        const update = {};
        allowedFields.forEach((field)=>{
            if(req.body[field] !== undefined) update[field] = req.body[field];
        });
        const user = await User.findByIdAndUpdate(req.user.id, update, {new: true, runValidators: true}).select("-password");
        if(!user) return res.status(404).json({message: "user not found"});
        res.json(user);
    } catch (error) {
        res.status(500).send(error);
    }
 };