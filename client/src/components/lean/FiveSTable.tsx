import React from "react";
import PropTypes from "prop-types";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  IconButton,
  Typography,
  Box,
  Button
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

export const FiveSTable = ({ title, columns, fields, data, onChange }) => {
  const tableData = Array.isArray(data) ? data : [];

  const handleFieldChange = (rowIndex, field, value) => {
    const updated = [...tableData];
    updated[rowIndex] = { ...updated[rowIndex], [field]: value };
    onChange(updated);
  };

  const handleAddRow = () => {
    const newRow = fields.reduce((acc, field) => ({ ...acc, [field]: "" }), {});
    onChange([...tableData, newRow]);
  };

  const handleRemoveRow = (index) => {
    const updated = tableData.filter((_, i) => i !== index);
    onChange(updated);
  };

  return (
    <Box mb={4}>
      <Typography variant="h6" gutterBottom>{title}</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((col, index) => (
                <TableCell key={index}><strong>{col}</strong></TableCell>
              ))}
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {fields.map((field, colIndex) => (
                  <TableCell key={colIndex}>
                    <TextField
                      variant="standard"
                      value={row[field] || ""}
                      onChange={(e) => handleFieldChange(rowIndex, field, e.target.value)}
                      fullWidth
                    />
                  </TableCell>
                ))}
                <TableCell>
                  <IconButton onClick={() => handleRemoveRow(rowIndex)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button
        variant="outlined"
        startIcon={<AddIcon />}
        onClick={handleAddRow}
        sx={{ mt: 1 }}
      >
        Додати рядок
      </Button>
    </Box>
  );
};

FiveSTable.propTypes = {
  title: PropTypes.string.isRequired,
  columns: PropTypes.array.isRequired,
  fields: PropTypes.array.isRequired,
  data: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
  onChange: PropTypes.func.isRequired,
  participants: PropTypes.array,
};
