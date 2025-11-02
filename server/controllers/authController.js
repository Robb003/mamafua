const bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken");
const User = require("../models/User")

exports.signup = async(req, res) => {
  try{
     const {name, email, phoneNumber, password, role}=req.body;
    const exist = await User.findOne({$or: [{email}, {phoneNumber}],});
    if(exist) return res.status(400).json({message: "user already exist"});
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      phoneNumber,
      password: hashed,
      role: role || "customer",
    });
    const token = JWT.sign({id: user._id, role: user.role}, process.env.JWT_SECRET, {expiresIn: "7d"});
    res.status(201).json({ 
      user: { id: user._id, name: user.name, email: user.email, role: user.role }, 
      token 
  });
  } catch(err) {
    console.error(err);
    res.status(500).json({ message: "Signup failed" });
  } 
};

exports.login = async(req, res) => {
  try {
    const {email, password}=req.body;
    const user = await User.findOne({email});
    if(!user)return res.status(404).json({message: "user not found"});
    const match = await bcrypt.compare(password, user.password);
    if(!match)return res.status(401).json({message: "incorrect password"});
     const token = JWT.sign({id: user._id, role: user.role}, process.env.JWT_SECRET, {expiresIn: "7d"});
    res.status(200).json({ 
      user: { id: user._id, name: user.name, email: user.email, role: user.role }, 
      token 
  });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Login failed" });
  }
};