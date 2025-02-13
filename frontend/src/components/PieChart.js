import React, { useEffect, useState } from "react";
import { fetchPieChart } from "../api/api";
import { PieChart as RechartPieChart, Pie, Tooltip, Cell, ResponsiveContainer } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const PieChart = ({ selectedMonth }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchPieChart(selectedMonth).then((res) => {
      setData(res.data.map((item, index) => ({ name: item._id, value: item.count, color: COLORS[index % COLORS.length] })));
    });
  }, [selectedMonth]);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RechartPieChart>
        <Pie data={data} cx="50%" cy="50%" outerRadius={80} fill="#8884d8" dataKey="value">
          {data.map((entry, index) => (
            <Cell key={index} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip />
      </RechartPieChart>
    </ResponsiveContainer>
  );
};

export default PieChart;
