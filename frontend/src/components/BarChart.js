import React, { useEffect, useState } from "react";
import { fetchBarChart } from "../api/api";
import { BarChart as RechartBarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

const BarChart = ({ selectedMonth }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchBarChart(selectedMonth).then((res) => {
      setData(res.data);
    });
  }, [selectedMonth]);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RechartBarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="range" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="count" fill="#82ca9d" />
      </RechartBarChart>
    </ResponsiveContainer>
  );
};

export default BarChart;
