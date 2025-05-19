// fix save to db
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
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
  Autocomplete,
  Tooltip,
  ToggleButtonGroup,
  ToggleButton
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
import axios from "axios";

const STATUS_OPTIONS = ["розгляд", "впроваджено"];

export const Kaizen = ({ kaizenData, onChange, participants, projectId }) => {

    // Локальний стейт копіює пропс
  const [localData, setLocalData] = useState(kaizenData || { ideas: [] });

    // Фільтри на UI
  const [filters, setFilters] = useState({
    status: "",
    author: "",
    criticality: ""
  });
  
  
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

    // При оновленні kaizenData – синхронізуємо локальний стейт
  useEffect(() => {
    setLocalData(kaizenData || { ideas: [] });
  }, [kaizenData]);


  
  if (!participants || participants.length === 0) {
    return <Typography>Завантаження учасників...</Typography>;
  }

 const userOptions = participants.map(p => p.user);








  // Відправляємо наверх оновлений розділ
  const updateSection = async (key: keyof typeof localData, value: any) => {
    const updated = { ...localData, [key]: value };
    setLocalData(updated);
    onChange(updated);

    // Зберігаємо автоматично у leanTemplates.kaizen
    try {
      await axios.put(`https://leanproject.onrender.com/api/v1/lean/${projectId}`, {
        leanTemplates: {
          kaizen: updated
        }
      });
      console.log("✅ Kaizen збережено");
    } catch (err) {
      console.error("❌ Помилка збереження Kaizen:", err);
    }
  };



  // Зміна окремого поля
  const handleChange = (
    section: keyof typeof localData,
    index: number,
    field: string,
    value: any
  ) => {
    const updatedArr = [...(localData as any)[section]];
    updatedArr[index] = { ...updatedArr[index], [field]: value };
    updateSection(section, updatedArr);
  };

  // Додавання нового рядка
  const handleAddRow = (section: keyof typeof localData, defaultRow: any) => {
    const updatedArr = [...(localData as any)[section], defaultRow];
    updateSection(section, updatedArr);
  };

  // Видалення рядка
  const handleRemoveRow = (section: keyof typeof localData, index: number) => {
    const updatedArr = (localData as any)[section].filter(
      (_: any, i: number) => i !== index
    );
    updateSection(section, updatedArr);
  };

  // Голосування: після відповіді API оновлюємо через onChange
  const handleVote = async (id: string, type: "like" | "dislike") => {
    try {
      const res = await axios.post(`https://leanproject.onrender.com/api/kaizen/vote/${id}`, {
        type,
        userEmail: currentUser.email
      });

      updateSection("ideas", res.data); // замість map

    } catch (err) {
      console.error("Помилка голосування:", err);
    }
  };



  // Фон для критичності та статусу
  const getSeverityBg = (sev: any) => {
    const s = parseInt(sev, 10);
    if (s < 1 || s > 5) return "rgba(255, 0, 0, 0.2)";
    if (s <= 2) return "rgba(76,175,80,0.2)";
    if (s === 3) return "rgba(255,235,59,0.2)";
    return "rgba(244,67,54,0.2)";
  };
  const getStatusBg = (status: string) => {
    if (status === "впроваджено") return "rgba(76,175,80,0.1)";
    if (status === "розгляд") return "rgba(158,158,158,0.1)";
    return "inherit";
  };

  // Застосовуємо фільтри і сортування
  const filteredIdeas = (localData.ideas || [])
    .filter((row: any) => !filters.status || row.status === filters.status)
    .filter(
      (row: any) =>
        !filters.author || row.author?.email === filters.author
    )
    .filter(
      (row: any) =>
        !filters.criticality ||
        String(row.criticality) === filters.criticality
    )
    .sort((a: any, b: any) => {
      const dateA = new Date(a.date || 0).getTime();
      const dateB = new Date(b.date || 0).getTime();
      return dateB - dateA; // спадаючий
    });

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        📈 KAIZEN — Система постійного покращення
      </Typography>

      {/* Фільтри */}
      <Box sx={{ display: "flex", gap: 2, my: 2 }}>
        <TextField
          select
          label="Фільтр статусу"
          SelectProps={{ native: true }}
          value={filters.status}
          onChange={e =>
            setFilters(prev => ({ ...prev, status: e.target.value }))
          }
        >
          <option value="">Усі</option>
          {STATUS_OPTIONS.map(opt => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </TextField>
        <Autocomplete
          options={userOptions.map(u => u.email)}
          value={filters.author}
          onInputChange={(_, val) =>
            setFilters(prev => ({ ...prev, author: val }))
          }
          renderInput={params => (
            <TextField {...params} label="Фільтр автора" />
          )}
        />
        <TextField
          label="Фільтр критичності"
          type="number"
          inputProps={{ min: 1, max: 5 }}
          value={filters.criticality}
          onChange={e =>
            setFilters(prev => ({
              ...prev,
              criticality: e.target.value
            }))
          }
        />
      </Box>

      {/* Таблиця ідей */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Ідея</TableCell>
              <TableCell>Автор</TableCell>
              <Tooltip title="Від 1 (низька) до 5 (критична)">
                <TableCell>⚠ Критичність</TableCell>
              </Tooltip>
              <Tooltip title="Розгляд — ще не реалізовано, Впроваджено — реалізовано">
                <TableCell>📌 Статус</TableCell>
              </Tooltip>
              <TableCell>Дата</TableCell>
              <TableCell>Коментар</TableCell>
              <TableCell>👍/👎</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredIdeas.map((row: any, idx: number) => (
              <TableRow key={idx} hover>
                <TableCell>
                  <TextField
                    value={row.idea || ""}
                    onChange={e =>
                      handleChange("ideas", idx, "idea", e.target.value)
                    }
                    fullWidth
                  />
                </TableCell>
                <TableCell>
                  <Autocomplete
                    options={userOptions}
                    getOptionLabel={opt => opt.email || ""}
                    value={
                      userOptions.find(u => u._id === row.author?._id || u.email === row.author?.email)
                      || null
                    }
                    onChange={(_, val) =>
                      handleChange("ideas", idx, "author", val || null)
                    }
                    renderInput={params => <TextField {...params} label="Автор" />}
                    isOptionEqualToValue={(opt, val) => opt._id === val?._id}
                  />

                </TableCell>
                <TableCell sx={{ backgroundColor: getSeverityBg(row.criticality) }}>
                  <TextField
                    type="number"
                    inputProps={{ min: 1, max: 5 }}
                    value={row.criticality || ""}
                    onChange={e =>
                      handleChange("ideas", idx, "criticality", parseInt(e.target.value, 10))
                    }
                    fullWidth
                  />
                </TableCell>
                <TableCell sx={{ backgroundColor: getStatusBg(row.status) }}>
                  <TextField
                    select
                    SelectProps={{ native: true }}
                    value={row.status || ""}
                    onChange={e =>
                      handleChange("ideas", idx, "status", e.target.value)
                    }
                    fullWidth
                  >
                    <option value="">-- Оберіть --</option>
                    {STATUS_OPTIONS.map((status, i) => (
                      <option key={i} value={status}>
                        {status}
                      </option>
                    ))}
                  </TextField>
                </TableCell>
                <TableCell>
                  <TextField
                    type="date"
                    value={row.date || ""}
                    onChange={e =>
                      handleChange("ideas", idx, "date", e.target.value)
                    }
                    fullWidth
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    value={row.comment || ""}
                    onChange={e =>
                      handleChange("ideas", idx, "comment", e.target.value)
                    }
                    fullWidth
                    multiline
                  />
                </TableCell>
                <TableCell>
                  <ToggleButtonGroup exclusive>
                    <ToggleButton value="yes" size="small" onClick={() => handleVote(row._id, "like")}>
                      <ThumbUpAltIcon fontSize="small" />
                      <span style={{ marginLeft: 4 }}>{row.likes?.length || 0}</span>
                    </ToggleButton>
                    <ToggleButton value="no" size="small" onClick={() => handleVote(row._id, "dislike")}>
                      <ThumbDownAltIcon fontSize="small" />
                      <span style={{ marginLeft: 4 }}>{row.dislikes?.length || 0}</span>
                    </ToggleButton>
                  </ToggleButtonGroup>
                </TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => handleRemoveRow("ideas", idx)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Додати нову ідею */}
      <Button
        variant="outlined"
        startIcon={<AddIcon />}
        onClick={() =>
          handleAddRow("ideas", {
            idea: "",
            author: null,
            criticality: "",
            status: "",
            date: new Date().toISOString().split("T")[0],
            comment: ""
          })
        }
        sx={{ mt: 2 }}
      >
        Додати ідею
      </Button>
    </Box>
  );
};

Kaizen.propTypes = {
  kaizenData: PropTypes.shape({ ideas: PropTypes.array.isRequired }).isRequired,
  onChange: PropTypes.func.isRequired,
  participants: PropTypes.arrayOf(PropTypes.shape({ user: PropTypes.object.isRequired })).isRequired,
  projectId: PropTypes.string.isRequired
};

