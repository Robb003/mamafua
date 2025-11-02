dotenv = require("dotenv");
const express = require("express")
const cors = require("cors");
const connectDB = require("./config/db")

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/auth", require("./routes/authRoute"));
app.use("/api/user", require("./routes/userRoute"));
app.use("/api/booking", require("./routes/bookingRoute"));
app.use("/api/service", require("./routes/serviceRoute"));
app.use("/api/review", require("./routes/reviewRoute"));
app.use("/api/mamafua", require("./routes/mamafuaRoute"));
app.use("/api/customer", require("./routes/customerRoute"));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));