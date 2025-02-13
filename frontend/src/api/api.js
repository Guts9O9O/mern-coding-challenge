import axios from "axios";

const API_BASE_URL = "https://mern-coding-challenge.onrender.com";

export const fetchTransactions = async (month, search, page, perPage) => {
  return await axios.get(`${API_BASE_URL}`, {
    params: { month, search, page, perPage },
  });
};

export const fetchStatistics = async (month) => {
  return await axios.get(`${API_BASE_URL}/statistics`, { params: { month } });
};

export const fetchBarChart = async (month) => {
  return await axios.get(`${API_BASE_URL}/bar-chart`, { params: { month } });
};

export const fetchPieChart = async (month) => {
  return await axios.get(`${API_BASE_URL}/pie-chart`, { params: { month } });
};
