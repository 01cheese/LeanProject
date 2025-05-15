import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Divider,
} from "@mui/material";
import { useGetIdentity } from "@pankod/refine-core";
import { useNavigate } from "@pankod/refine-react-router-v6";
import { Grid } from "@mui/material";

export const MyLeanProjects = () => {
  const { data: user } = useGetIdentity();
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const [ownRes, sharedRes] = await Promise.all([
          fetch(`${process.env.REACT_APP_BACKEND_URL}/lean/user/${user?.userid}`),
          fetch(`${process.env.REACT_APP_BACKEND_URL}/lean/shared/${user?.userid}`),
        ]);

        const [ownProjects, sharedProjects] = await Promise.all([
          ownRes.json(),
          sharedRes.json(),
        ]);

        const merged = [...ownProjects, ...sharedProjects];
        setProjects(merged);
      } catch (err) {
        console.error("Помилка при завантаженні проєктів:", err);
      } finally {
        setLoading(false);
      }
    };
    if (user?.userid) fetchProjects();
  }, [user?.userid]);

  if (loading) return <Typography>Завантаження...</Typography>;

  if (selectedProject) {
    const p = selectedProject;
    return (
      <Box p={4}>
        <Typography variant="h4" gutterBottom>
          {p.name}
        </Typography>

        <Typography variant="subtitle1" gutterBottom>
          <strong>Опис проблеми:</strong> {p.description}
        </Typography>

        <Typography variant="subtitle1">
          <strong>Ціль проєкту (SMART):</strong> {p.goal || "–"}
        </Typography>
        <Typography variant="subtitle1">
          <strong>Відповідальний:</strong> {p.owner || user?.name}
        </Typography>
        <Typography variant="subtitle1">
          <strong>Команда:</strong> {p.team || "–"}
        </Typography>
        <Typography variant="subtitle1">
          <strong>Відділ / Участок:</strong> {p.department || "–"}
        </Typography>
        <Typography variant="subtitle1">
          <strong>Дата:</strong> {p.startDate || "–"} – {p.endDate || "–"}
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6">📄 Шаблони:</Typography>

        <Box mt={2}>
          <Typography><strong>A3-Звіт</strong></Typography>
          <ul>
            <li>Проблема: {p.description}</li>
            <li>Ціль: {p.goal}</li>
            <li>Аналіз: {p.analysis || "–"}</li>
            <li>Причини: {p.rootCauses?.join(", ") || "–"}</li>
            <li>План дій: {p.actionPlan || "–"}</li>
            <li>Очікувані результати: {p.expectedResults || "–"}</li>
            <li>Фактичні результати: {p.actualResults || "–"}</li>
            <li>Висновки: {p.conclusions || "–"}</li>
          </ul>
        </Box>

        <Box mt={2}>
          <Typography><strong>5 Why:</strong></Typography>
          {(p.fiveWhy || []).map((q, i) => (
            <Typography key={i}>Чому: {q.why} → Тому що: {q.because}</Typography>
          ))}
        </Box>

        <Box mt={2}>
          <Typography><strong>Ishikawa (рибяча кістка):</strong></Typography>
          {(p.ishikawa || []).map((cat, i) => (
            <Typography key={i}>
              <strong>{cat.category}:</strong> {cat.causes.join(", ")}
            </Typography>
          ))}
        </Box>

        <Box mt={2}>
          <Typography><strong>Карта потоку створення цінності:</strong></Typography>
          {(p.vsm || []).map((step, i) => (
            <Typography key={i}>
              Крок {i + 1}: {step.name} – {step.time} сек. очікування: {step.wait} сек.
            </Typography>
          ))}
        </Box>

        <Box mt={2}>
          <Typography><strong>План покращень:</strong></Typography>
          {(p.improvements || []).map((item, i) => (
            <Typography key={i}>
              🔧 {item.what} – 👤 {item.who} – 📆 {item.when} – 🎯 {item.effect}
            </Typography>
          ))}
        </Box>

        <Box mt={2}>
          <Typography><strong>Чекліст успіху:</strong></Typography>
          <ul>
            <li>✅ Ціль зрозуміла: {p.success?.goal ? "✅" : "❌"}</li>
            <li>✅ Причини знайдені: {p.success?.causes ? "✅" : "❌"}</li>
            <li>✅ План реалістичний: {p.success?.plan ? "✅" : "❌"}</li>
            <li>✅ Команда залучена: {p.success?.team ? "✅" : "❌"}</li>
            <li>✅ Є підтримка: {p.success?.support ? "✅" : "❌"}</li>
          </ul>
        </Box>

        <Box mt={3}>
          <Button variant="outlined" onClick={() => setSelectedProject(null)}>
            ← Назад до списку
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Мої Lean-проєкти
      </Typography>

      <Button
        variant="contained"
        color="primary"
        sx={{ mb: 3 }}
        onClick={() => navigate("/lean-projects/create")}
      >
        + Створити проєкт
      </Button>

      {projects.length === 0 ? (
        <Typography color="text.secondary">Проєктів поки немає.</Typography>
      ) : (
        <Grid container spacing={2}>
          {projects.map((project, index) => (
            <Grid key={project._id} item xs={12} sm={6} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6">
                    #{index + 1}: {project.name}
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    {project.description}
                  </Typography>

                  <Box mt={1}>
                    {project.principles.map((principle) => (
                      <Chip label={principle} key={principle} size="small" sx={{ mr: 1 }} />
                    ))}
                  </Box>

                  <Typography variant="caption" display="block" mt={2}>
                    Створено: {new Date(project.createdAt).toLocaleDateString()}
                  </Typography>

                  <Box mt={2}>
                    <Button
                      variant="contained"
                      size="small"
                      href={`/lean-projects/show/${project._id}`}
                    >
                      ВІДКРИТИ
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};