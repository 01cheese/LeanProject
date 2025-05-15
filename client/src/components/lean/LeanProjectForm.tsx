import React, { useState } from "react";
import {
  Box,
  TextField,
  Typography,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Button,
  TextareaAutosize,
} from "@mui/material";
import { useGetIdentity } from "@pankod/refine-core";

const leanPrinciples = ["5S", "Kanban", "Kaizen", "Just-in-time", "Poka-Yoke", "TPM"];

export const CreateLeanProjectForm = () => {
  const { data: user } = useGetIdentity();

  const [project, setProject] = useState({
    name: "",
    description: "",
    principles: [],
    keywords: "",
    files: null,
    leanTemplates: {
      fiveS: {
        sort: "",
        setInOrder: "",
        shine: "",
        standardize: "",
        sustain: "",
      },
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProject({ ...project, [name]: value });
  };

  const handle5SChange = (e) => {
    const { name, value } = e.target;
    setProject((prev) => ({
      ...prev,
      leanTemplates: {
        ...prev.leanTemplates,
        fiveS: {
          ...prev.leanTemplates.fiveS,
          [name]: value,
        },
      },
    }));
  };

  const handleCheckboxChange = (principle) => {
    const principles = [...project.principles];
    const index = principles.indexOf(principle);
    if (index === -1) principles.push(principle);
    else principles.splice(index, 1);
    setProject({ ...project, principles });
  };

  const handleFileChange = (e) => {
    setProject({ ...project, files: e.target.files });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userInfo = JSON.parse(localStorage.getItem("user"));

    const body = {
      ...project,
      author: userInfo?.userid,
      authorName: userInfo?.name,
      leanTemplates: {
        ...project.leanTemplates, // сохраняем fiveS
        leanCanvas: {
          problem: "",
          existingAlternatives: "",
          solution: "",
          keyMetrics: "",
          uniqueValue: "",
          highLevelConcept: "",
          unfairAdvantage: "",
          customerSegments: "",
          earlyAdopters: "",
          channels: "",
          costStructure: "",
          revenueStreams: "",
        },
      },
    };

    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/lean`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("Щось пішло не так");

      alert("Проєкт створено успішно!");
    } catch (err) {
      console.error("Помилка при створенні проєкту:", err);
    }
  };


  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 3, maxWidth: 600, mx: "auto" }}>
      <Typography variant="h5" gutterBottom>
        Створення Lean-проєкту
      </Typography>

      <TextField
        fullWidth
        label="Назва проєкту"
        name="name"
        value={project.name}
        onChange={handleChange}
        margin="normal"
        required
      />

      <TextareaAutosize
        minRows={3}
        name="description"
        value={project.description}
        onChange={handleChange}
        placeholder="Опис проєкту"
        style={{ width: '100%', marginTop: '1rem', padding: '0.5rem' }}
      />

      <FormGroup sx={{ mt: 2 }}>
        <Typography variant="subtitle1">Виберіть Lean-принципи:</Typography>
        {leanPrinciples.map((principle) => (
          <FormControlLabel
            control={
              <Checkbox
                checked={project.principles.includes(principle)}
                onChange={() => handleCheckboxChange(principle)}
              />
            }
            label={principle}
            key={principle}
          />
        ))}
      </FormGroup>

      {project.principles.includes("5S") && (
        <Box mt={4}>
          <Typography variant="h6">📘 Шаблон 5S</Typography>
          {[
            ["sort", "Sort"],
            ["setInOrder", "Set in Order"],
            ["shine", "Shine"],
            ["standardize", "Standardize"],
            ["sustain", "Sustain"],
          ].map(([key, label]) => (
            <TextField
              key={key}
              fullWidth
              label={label}
              name={key}
              value={project.leanTemplates.fiveS[key]}
              onChange={handle5SChange}
              margin="normal"
            />
          ))}
        </Box>
      )}

      <TextField
        fullWidth
        label="Ключові слова"
        name="keywords"
        value={project.keywords}
        onChange={handleChange}
        helperText="Введіть через кому: склад, оптимізація, 5S"
        margin="normal"
      />

      <Box mt={2}>
        <Typography variant="body1">Завантаження файлів</Typography>
        <input type="file" multiple onChange={handleFileChange} />
      </Box>

      <Box mt={3}>
        <Typography variant="body2" color="text.secondary">
          Автор: {user?.name || "Анонім"}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Тип користувача: {user?.type || "standart_user"}
        </Typography>
      </Box>

      <Button variant="contained" color="primary" type="submit" sx={{ mt: 3 }}>
        Створити проєкт
      </Button>
    </Box>
  );
};
