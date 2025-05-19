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
import { useNavigate } from "@pankod/refine-react-router-v6";

const leanPrinciples = ["5S", "Kanban", "Kaizen", "Just-in-time", "Poka-Yoke", "TPM"];

export const CreateLeanProjectForm = () => {
  const { data: user } = useGetIdentity();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [project, setProject] = useState({
    name: "",
    description: "",
    principles: [],
    keywords: "",
    files: null,
    leanTemplates: {
      fiveS: {
        sort: { text: "" },
        setInOrder: { text: "" },
        shine: { text: "" },
        standardize: { text: "" },
        sustain: { text: "" },
      }
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return; // запобігти повторному кліку

    setLoading(true);

    const { files, ...cleanProject } = project;

    const body = {
      ...cleanProject,
      author: user?.userid,
      authorName: user?.name,
      leanTemplates: {
        ...project.leanTemplates,
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

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Сервер повернув помилку:", errorText);
        throw new Error("Щось пішло не так");
      }
      navigate("/lean-projects"); // Редірект після створення
    } catch (err) {
      console.error("❌ Помилка при створенні проєкту:", err);
    } finally {
      setLoading(false); // розблокування
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


      <Box mt={3}>
        <Typography variant="body2" color="text.secondary">
          Автор: {user?.name || "Анонім"}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Тип користувача: {user?.type || "Admin"}
        </Typography>
      </Box>

      <Button
        variant="contained"
        color="primary"
        type="submit"
        sx={{ mt: 3 }}
        disabled={loading}
      >
        {loading ? "Створення..." : "Створити проєкт"}
      </Button>

    </Box>
  );
};