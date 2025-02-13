// src/controllers/transactionController.js
const axios = require("axios");
const Transaction = require("../models/Transaction");

// Initialize Database
const initializeDatabase = async (req, res) => {
  try {
    const response = await axios.get(
      "https://s3.amazonaws.com/roxiler.com/product_transaction.json"
    );

    await Transaction.deleteMany({});
    await Transaction.insertMany(response.data);

    res.status(200).json({ message: "Database Initialized Successfully" });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Failed to initialize database" });
  }
};

// List Transactions API (With search & pagination)
const getTransactions = async (req, res) => {
  try {
    console.log("Fetching transactions...");

    const { month, search, page = 1, perPage = 10 } = req.query;
    
    console.log(`Received month: ${month}, search: ${search}, page: ${page}`);

    if (!month) {
      return res.status(400).json({ error: "Month parameter is required" });
    }

    const startDate = new Date(`2022-${month}-01`);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);

    console.log(`Fetching transactions between ${startDate} and ${endDate}`);

    let filter = {
      dateOfSale: { $gte: startDate, $lt: endDate },
    };

    if (search) {
      filter.$or = [
        { title: new RegExp(search, "i") },
        { description: new RegExp(search, "i") },
        { price: parseFloat(search) || 0 },
      ];
    }

    const transactions = await Transaction.find(filter)
      .limit(parseInt(perPage))
      .skip((parseInt(page) - 1) * parseInt(perPage));

    console.log(`Fetched transactions:`, transactions.length);

    res.json({ transactions });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ error: "Error fetching transactions", details: error.message });
  }
};


// Statistics API (Total sales, sold items, unsold items)
const getStatistics = async (req, res) => {
  try {
    const { month } = req.query;

    if (!month) {
      return res.status(400).json({ error: "Month parameter is required" });
    }

    const startDate = new Date(`2022-${month}-01`);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);

    console.log(`Fetching statistics for transactions between ${startDate} and ${endDate}`);

    const totalSales = await Transaction.aggregate([
      { $match: { dateOfSale: { $gte: startDate, $lt: endDate } } },
      { $group: { _id: null, totalAmount: { $sum: "$price" } } },
    ]);

    const soldItems = await Transaction.countDocuments({
      dateOfSale: { $gte: startDate, $lt: endDate },
      sold: true,
    });

    const unsoldItems = await Transaction.countDocuments({
      dateOfSale: { $gte: startDate, $lt: endDate },
      sold: false,
    });

    res.json({
      totalSales: totalSales.length > 0 ? totalSales[0].totalAmount : 0,
      soldItems,
      unsoldItems,
    });
  } catch (error) {
    console.error("Error fetching statistics:", error);
    res.status(500).json({ error: "Error fetching statistics", details: error.message });
  }
};

// Bar Chart API (Price Ranges)

const getBarChart = async (req, res) => {
  try {
    const { month } = req.query;

    if (!month) {
      return res.status(400).json({ error: "Month parameter is required" });
    }

    const startDate = new Date(`2022-${month}-01`);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);

    console.log(`Fetching bar chart data for transactions between ${startDate} and ${endDate}`);

    const priceRanges = [
      { range: "0-100", min: 0, max: 100 },
      { range: "101-200", min: 101, max: 200 },
      { range: "201-300", min: 201, max: 300 },
      { range: "301-400", min: 301, max: 400 },
      { range: "401-500", min: 401, max: 500 },
      { range: "501-600", min: 501, max: 600 },
      { range: "601-700", min: 601, max: 700 },
      { range: "701-800", min: 701, max: 800 },
      { range: "801-900", min: 801, max: 900 },
      { range: "901+", min: 901, max: Number.MAX_SAFE_INTEGER },
    ];

    const response = await Promise.all(
      priceRanges.map(async ({ range, min, max }) => {
        const count = await Transaction.countDocuments({
          dateOfSale: { $gte: startDate, $lt: endDate },
          price: { $gte: min, $lt: max },
        });
        return { range, count };
      })
    );

    res.json(response.length > 0 ? response : { message: "No transactions found for this month." });
  } catch (error) {
    console.error("Error fetching bar chart data:", error);
    res.status(500).json({ error: "Error fetching bar chart data", details: error.message });
  }
};


// Pie Chart API (Categories & Item Count)

const getPieChart = async (req, res) => {
  try {
    const { month } = req.query;

    if (!month) {
      return res.status(400).json({ error: "Month parameter is required" });
    }

    const startDate = new Date(`2022-${month}-01`);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);

    console.log(`Fetching pie chart data for transactions between ${startDate} and ${endDate}`);

    const categories = await Transaction.aggregate([
      { $match: { dateOfSale: { $gte: startDate, $lt: endDate } } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);

    res.json(categories.length > 0 ? categories : { message: "No category data available for this month." });
  } catch (error) {
    console.error("Error fetching pie chart data:", error);
    res.status(500).json({ error: "Error fetching pie chart data", details: error.message });
  }
};

// Consolidated API
const getConsolidatedData = async (req, res) => {
  try {
    const { month } = req.query;

    if (!month) {
      return res.status(400).json({ error: "Month parameter is required" });
    }

    console.log(`Fetching consolidated data for month: ${month}`);

    const statistics = await getStatistics(req, { json: (data) => data });
    const barChart = await getBarChart(req, { json: (data) => data });
    const pieChart = await getPieChart(req, { json: (data) => data });

    res.json({ statistics, barChart, pieChart });
  } catch (error) {
    console.error("Error fetching consolidated data:", error);
    res.status(500).json({ error: "Error fetching consolidated data", details: error.message });
  }
};


module.exports = {
  initializeDatabase,
  getTransactions,
  getStatistics,
  getBarChart,
  getPieChart,
  getConsolidatedData,
};
