import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  LinearProgress,
} from "@pankod/refine-mui";
import { useGetIdentity } from "@pankod/refine-core";
import { PieChart } from "components";

const calculateProjectProgress = (project) => {
  if (!project) return 0;
  const total = 5;
  let done = 0;

  if (project.fiveWhy?.length) done++;
  if (project.ishikawa?.length) done++;
  if (project.vsm?.length) done++;
  if (project.improvements?.length) done++;
  if (project.actionPlan) done++;

  return Math.round((done / total) * 100);
};

const Home = () => {
  const { data: user } = useGetIdentity();
  const [leanProjects, setLeanProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProjectId, setSelectedProjectId] = useState("");

  const selectedProject = leanProjects.find((p) => p._id === selectedProjectId);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/lean/user/${user?.userid}`
        );
        const data = await res.json();
        setLeanProjects(data);
      } catch (error) {
        console.error("Помилка при завантаженні проєктів:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.userid) fetchProjects();
  }, [user?.userid]);

  if (loading) {
    return <Typography>Завантаження...</Typography>;
  }

  return (
    <Box>
      <Typography fontSize={25} fontWeight={700} mb={2}>
        Lean Dashboard
      </Typography>

      <Select
        fullWidth
        value={selectedProjectId}
        onChange={(e) => setSelectedProjectId(e.target.value)}
        displayEmpty
      >
        <MenuItem value="" disabled>
          Оберіть Lean-проєкт
        </MenuItem>
        {leanProjects.map((project) => (
          <MenuItem key={project._id} value={project._id}>
            {project.name}
          </MenuItem>
        ))}
      </Select>

      {selectedProject && (
        <Box mt={4}>
          <Typography variant="h6" gutterBottom>
            Статистика проєкту: {selectedProject.name}
          </Typography>

          <Box mt={2} display="flex" flexWrap="wrap" gap={4}>
            <PieChart
              title="Lean Principles"
              value={selectedProject.principles.length}
              series={[
                selectedProject.principles.length,
                6 - selectedProject.principles.length,
              ]}
              colors={["#2e7d32", "#eeeeee"]}
            />

            <PieChart
              title="5S Elements"
              value={[
                selectedProject.extra5S?.sort,
                selectedProject.extra5S?.shine,
                selectedProject.extra5S?.sustain,
                selectedProject.extra5S?.standardize,
                selectedProject.extra5S?.setInOrder,
              ].filter(Boolean).length}
              series={[
                [
                  selectedProject.extra5S?.sort,
                  selectedProject.extra5S?.shine,
                  selectedProject.extra5S?.sustain,
                  selectedProject.extra5S?.standardize,
                  selectedProject.extra5S?.setInOrder,
                ].filter(Boolean).length,
                5 -
                [
                  selectedProject.extra5S?.sort,
                  selectedProject.extra5S?.shine,
                  selectedProject.extra5S?.sustain,
                  selectedProject.extra5S?.standardize,
                  selectedProject.extra5S?.setInOrder,
                ].filter(Boolean).length,
              ]}
              colors={["#1976d2", "#eeeeee"]}
            />

            <PieChart
              title="Покращення"
              value={selectedProject.improvements?.length || 0}
              series={[selectedProject.improvements?.length || 0, 10]}
              colors={["#ef6c00", "#eeeeee"]}
            />
          </Box>

          <Box mt={4}>
            <Typography variant="subtitle1" mb={1}>
              Прогрес виконання проєкту
            </Typography>
            <LinearProgress
              variant="determinate"
              value={calculateProjectProgress(selectedProject)}
            />
            <Typography mt={1}>
              {calculateProjectProgress(selectedProject)}% завершено
            </Typography>
          </Box>

          <Box mt={4}>
            <Typography variant="h6">Рекомендації:</Typography>
            <ul>
              {!selectedProject.fiveWhy?.length && <li>Заповніть 5 Why</li>}
              {!selectedProject.ishikawa?.length && (
                <li>Створіть діаграму Ishikawa</li>
              )}
              {!selectedProject.vsm?.length && (
                <li>Створіть карту потоку цінності</li>
              )}
              {!selectedProject.improvements?.length && (
                <li>Заплануйте покращення</li>
              )}
              {!selectedProject.actionPlan && <li>Додайте план дій</li>}
            </ul>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Home;
