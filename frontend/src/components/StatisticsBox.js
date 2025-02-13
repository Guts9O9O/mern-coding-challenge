import React, { useEffect, useState } from "react";
import { fetchStatistics } from "../api/api";
import { Card, CardContent, Typography } from "@mui/material";

const StatisticsBox = ({ selectedMonth }) => {
  const [stats, setStats] = useState({ totalSales: 0, soldItems: 0, unsoldItems: 0 });

  useEffect(() => {
    fetchStatistics(selectedMonth).then((res) => {
      setStats(res.data);
    });
  }, [selectedMonth]);

  return (
    <Card>
      <CardContent>
        <Typography>Total Sales: ${stats.totalSales}</Typography>
        <Typography>Sold Items: {stats.soldItems}</Typography>
        <Typography>Unsold Items: {stats.unsoldItems}</Typography>
      </CardContent>
    </Card>
  );
};

export default StatisticsBox;
