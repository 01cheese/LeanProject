import React from "react";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  TextField,
  IconButton,
  Button,
  Autocomplete
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import PropTypes from "prop-types";

const LOSS_TYPES = [
  { type: "Перевиробництво", icon: "" },
  { type: "Очікування", icon: "" },
  { type: "Зайве переміщення", icon: "" },
  { type: "Надмірна обробка", icon: "" },
  { type: "Запаси", icon: "" },
  { type: "Дефекти", icon: "" },
  { type: "Зайві дії", icon: "" }
];

const LOCATION_OPTIONS = [
  'склад',
  'тестування',
  'планування',
  'виробництво',
  'доставка'
];

export const LeanAudit = ({ auditData, onChange, participants }) => {


  const userOptions = participants.map(p => p.user);

  const handleChange = (index, field, value) => {
    const updated = [...auditData];
    updated[index][field] = value;
    onChange(updated);
  };

  const handleAddRow = () => {
    onChange([
      ...auditData,
      {
        type: "",
        location: "",
        dateDetected: new Date().toISOString().split('T')[0],
        responsible: "",
        severity: "",
        comment: ""
      }
    ]);
  };

  const handleRemoveRow = (index) => {
    const updated = auditData.filter((_, i) => i !== index);
    onChange(updated);
  };

  const getSeverityBg = (sev) => {
    const s = parseInt(sev, 10);
    if (!s) return 'inherit';
    if (s <= 2) return 'rgba(76,175,80,0.2)'; // green
    if (s === 3) return 'rgba(255,235,59,0.2)'; // yellow
    return 'rgba(244,67,54,0.2)'; // red
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Lean-аудит</Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Тип втрати</TableCell>
              <TableCell>Де виявлено</TableCell>
              <TableCell>Дата виявлення</TableCell>
              <TableCell>Відповідальний</TableCell>
              <TableCell>Критичність (1-5)</TableCell>
              <TableCell>Коментар</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {auditData.map((row, index) => (
              <TableRow key={index} hover>
                <TableCell>
                  <TextField
                    select
                    SelectProps={{ native: true }}
                    value={row.type}
                    onChange={(e) => handleChange(index, "type", e.target.value)}
                    fullWidth
                  >
                    <option value="">-- Оберіть --</option>
                    {LOSS_TYPES.map((loss, i) => (
                      <option key={i} value={loss.type}>
                        {loss.icon} {loss.type}
                      </option>
                    ))}
                  </TextField>
                </TableCell>
                <TableCell sx={{ minWidth: 160 }}>
                  <Autocomplete
                    freeSolo
                    options={LOCATION_OPTIONS}
                    value={row.location || ''}
                    onChange={(_, val) => handleChange(index, 'location', val)}
                    onInputChange={(_, val) => handleChange(index, 'location', val)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Наприклад: склад, тестування, планування..."
                      />
                    )}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    type="date"
                    value={row.dateDetected || ""}
                    onChange={(e) => handleChange(index, 'dateDetected', e.target.value)}
                    fullWidth
                  />
                </TableCell>
                <TableCell>
                  <Autocomplete
                    options={userOptions}
                    getOptionLabel={(option) => option.email || ""}
                    value={row.responsible || null}
                    onChange={(_, value) => handleChange(index, "responsible", value)}
                    renderInput={(params) => (
                      <TextField {...params} placeholder="Email відповідального" />
                    )}
                    isOptionEqualToValue={(option, value) =>
                      option._id === value?._id
                    }
                  />
                </TableCell>
                <TableCell sx={{ backgroundColor: getSeverityBg(row.severity) }}>
                  <TextField
                    type="number"
                    inputProps={{ min: 1, max: 5 }}
                    value={row.severity}
                    onChange={(e) => handleChange(index, "severity", e.target.value)}
                    fullWidth
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    value={row.comment}
                    onChange={(e) => handleChange(index, "comment", e.target.value)}
                    fullWidth
                    multiline
                  />
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleRemoveRow(index)}>
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
        sx={{ mt: 2 }}
      >
        Додати запис
      </Button>
    </Box>
  );
};

LeanAudit.propTypes = {
  auditData: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  participants: PropTypes.array.isRequired,
};
