import React, { useState, useEffect } from "react";
import { fetchTransactions } from "../api/api";
import { Table, TableHead, TableRow, TableCell, TableBody, TextField, Button, Select, MenuItem } from "@mui/material";

const TransactionsTable = ({ selectedMonth }) => {
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchTransactions(selectedMonth, search, page, 10).then((res) => {
      setTransactions(res.data.transactions);
    });
  }, [selectedMonth, search, page]);

  return (
    <div>
      <TextField
        label="Search Transactions"
        variant="outlined"
        onChange={(e) => setSearch(e.target.value)}
      />
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Sold</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell>{transaction.title}</TableCell>
              <TableCell>{transaction.description}</TableCell>
              <TableCell>${transaction.price}</TableCell>
              <TableCell>{transaction.sold ? "Yes" : "No"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button onClick={() => setPage(page - 1)} disabled={page === 1}>Previous</Button>
      <Button onClick={() => setPage(page + 1)}>Next</Button>
    </div>
  );
};

export default TransactionsTable;
