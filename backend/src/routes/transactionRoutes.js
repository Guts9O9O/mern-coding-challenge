const express = require("express");
const {
  initializeDatabase,
  getTransactions,
  getStatistics,
  getBarChart,
  getPieChart,
  getConsolidatedData,
} = require("../controllers/transactionController");

const router = express.Router();

router.get("/init", initializeDatabase);
router.get("/", getTransactions);
router.get("/statistics", getStatistics);
router.get("/bar-chart", getBarChart);
router.get("/pie-chart", getPieChart);
router.get("/consolidated", getConsolidatedData);

module.exports = router;
