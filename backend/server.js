const express = require("express");
const cors = require("cors");
const connectDB = require("./src/config/db");
const transactionRoutes = require("./src/routes/transactionRoutes");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/transactions", transactionRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
