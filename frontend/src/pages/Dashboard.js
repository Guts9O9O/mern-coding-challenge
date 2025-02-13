// src/pages/Dashboard.js
import React, { useState } from "react";
import TransactionsTable from "../components/TransactionsTable";
import StatisticsBox from "../components/StatisticsBox";
import BarChart from "../components/BarChart";
import PieChart from "../components/PieChart";
import { Select, MenuItem, Container, Typography } from "@mui/material";

const Dashboard = () => {
  const [selectedMonth, setSelectedMonth] = useState("03");

  return (
    <Container className="container">
  <Typography variant="h4" gutterBottom>
    Transactions Dashboard
  </Typography>
  <Select className="select-dropdown" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
    {[...Array(12).keys()].map((i) => (
      <MenuItem key={i} value={(i + 1).toString().padStart(2, "0")}>
        {new Date(2022, i).toLocaleString("default", { month: "long" })}
      </MenuItem>
    ))}
  </Select>
  <div className="table-container">
    <StatisticsBox selectedMonth={selectedMonth} />
    <TransactionsTable selectedMonth={selectedMonth} />
  </div>
  <div className="chart-container">
    <BarChart selectedMonth={selectedMonth} />
    <PieChart selectedMonth={selectedMonth} />
  </div>
</Container>

  );
};

export default Dashboard;
