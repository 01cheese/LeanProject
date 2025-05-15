import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";
import { TextField } from "@pankod/refine-mui";

import LeanProjectTabs from "./LeanProjectTabs";
import { KanbanBoard } from "./KanbanBoard";
import { FiveS } from './FiveS'
import { Kaizen } from './Kaizen'
import { ProjectParticipants } from './ProjectParticipants'

const LeanProjectDetails = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [activeTab, setActiveTab] = useState("Lean Canvas");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProject = async () => {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/lean/${id}`);
      const data = await res.json();

      // Автоинициализация поля kaizen, если оно отсутствует
      if (!data.leanTemplates.kaizen) {
        data.leanTemplates.kaizen = {
          ideas: [],
          plan: [],
          beforeAfter: { before: "", after: "" },
          effect: [],
        };
      }

      setProject(data);
    };
    if (id) fetchProject();
  }, [id]);



  const saveChanges = async () => {
    await fetch(`${process.env.REACT_APP_BACKEND_URL}/lean/${project._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ leanTemplates: project.leanTemplates }),
    });
    alert("Зміни збережено!");
  };

  const updateKanban = async (newKanban, newColumns = null) => {
    const updatedLeanTemplates = {
      ...project.leanTemplates,
      kanban: newKanban,
    };

    if (newColumns) {
      updatedLeanTemplates.leanCanvas = {
        ...updatedLeanTemplates.leanCanvas,
        kanbanColumns: newColumns,
      };
    }

    const updatedProject = {
      ...project,
      leanTemplates: updatedLeanTemplates,
    };

    setProject(updatedProject);

    try {
      await fetch(`${process.env.REACT_APP_BACKEND_URL}/lean/${project._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leanTemplates: updatedLeanTemplates }),
      });
      console.log("Kanban оновлено!");
    } catch (err) {
      console.error("❌ Помилка при збереженні:", err);
    }
  };


  if (!project) return <Typography>Завантаження...</Typography>;

  return (
    <Box mt={4}>
      <LeanProjectTabs onChange={setActiveTab} />
      <Box mt={3}>
        {activeTab === "Lean Canvas" && (
          <>
            {[
              ["problem", "Проблема"],
              ["solution", "Рішення"],
              ["uniqueValue", "Унікальна цінність"],
              ["unfairAdvantage", "Прихована перевага"],
              ["customerSegments", "Сегменти клієнтів"],
              ["keyMetrics", "Ключові метрики"],
              ["channels", "Канали"],
              ["costStructure", "Структура витрат"],
              ["revenueStreams", "Джерела доходів"],
            ].map(([key, label]) => (
              <TextField
                key={key}
                label={label}
                fullWidth
                value={project.leanTemplates?.leanCanvas?.[key] || ""}
                onChange={(e) =>
                  setProject((prev) => ({
                    ...prev,
                    leanTemplates: {
                      ...prev.leanTemplates,
                      leanCanvas: {
                        ...prev.leanTemplates?.leanCanvas,
                        [key]: e.target.value,
                      },
                    },
                  }))
                }
                multiline
                rows={2}
                sx={{ my: 1 }}
              />
            ))}
          </>
        )}

        {activeTab === "Kanban" && (
          <KanbanBoard
            kanbanData={project.leanTemplates?.kanban || []}
            onChange={updateKanban}
          />
        )}

        {activeTab === "5S" && (
          <FiveS
            fiveSData={project.leanTemplates?.fiveS || {}}
            onChange={(key, value) =>
              setProject((prev) => ({
                ...prev,
                leanTemplates: {
                  ...prev.leanTemplates,
                  fiveS: {
                    ...prev.leanTemplates?.fiveS,
                    [key]: value,
                  },
                },
              }))
            }
          />
        )}

        {activeTab === "Kaizen" && (
          <Kaizen
            kaizenData={project.leanTemplates?.kaizen || {}}
            onChange={(updatedKaizen) =>
              setProject((prev) => ({
                ...prev,
                leanTemplates: {
                  ...prev.leanTemplates,
                  kaizen: updatedKaizen,
                },
              }))
            }
          />
        )}

        {activeTab === "Налаштування" && (
          <Box>
            <Typography>⚙️ Інші налаштування проєкту</Typography>
            <ProjectParticipants
              projectId={project._id}
              participants={project.participants}
              setProject={setProject}
              onDeleteProject={() => navigate('/lean-projects')}
            />
          </Box>
        )}

      </Box>

      <Button variant="contained" sx={{ mt: 3 }} onClick={saveChanges}>
        💾 Зберегти зміни
      </Button>
    </Box>
  );
};

export default LeanProjectDetails;
