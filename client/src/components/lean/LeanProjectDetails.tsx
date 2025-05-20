import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, Button, Modal, CircularProgress } from "@mui/material";
import { TextField } from "@pankod/refine-mui";

import LeanProjectTabs from "./LeanProjectTabs";
import { KanbanBoard } from "./KanbanBoard";
import { FiveS } from './FiveS'
import { Kaizen } from './Kaizen'
import { ProjectParticipants } from './ProjectParticipants'
import { LeanAudit } from './LeanAudit'
import RecommendationsTab from './RecommendationsTab'

const LeanProjectDetails = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [activeTab, setActiveTab] = useState("Lean Canvas");
  const [aiResult, setAiResult] = useState("");
  const [aiOpen, setAiOpen] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProject = async () => {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/lean/${id}`);
      const data = await res.json();

      if (!data.leanTemplates.kaizen) {
        data.leanTemplates.kaizen = {
          ideas: [],
          plan: [],
          beforeAfter: { before: "", after: "" },
          effect: [],
        };
      }
      if (!data.leanTemplates.audit) {
        data.leanTemplates.audit = [];
      }

      setProject(data);
    };
    if (id) fetchProject();
  }, [id]);

  useEffect(() => {
    localStorage.setItem("menu_collapsed", "true");
  }, []);


  const saveChanges = async () => {
    await fetch(`${process.env.REACT_APP_BACKEND_URL}/lean/${project._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ leanTemplates: project.leanTemplates }),
    });
    alert("Зміни збережено!");
  };

 const generateAI = async () => {
  setAiLoading(true);
  try {
    const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/lean/${project._id}/analyze`, {
      method: "POST",
    });
    const data = await res.json();
    const aiText = data.result || "❌ Відповідь порожня";

    // 🔥 Оновлюємо як `aiResult`, так і `project.aiAnalysis`
    setAiResult(aiText);
    setProject((prev) => ({
      ...prev,
      aiAnalysis: aiText,
    }));
  } catch (err) {
    console.error("AI error", err);
    setAiResult("❌ Помилка запиту до AI");
  } finally {
    setAiLoading(false);
  }
};





  const downloadText = () => {
    const blob = new Blob([aiResult], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "ai-recommendation.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!project) return <Typography>Завантаження...</Typography>;

  return (
    <Box>
    <Box mt={4}>
      <LeanProjectTabs onChange={setActiveTab} />
      <Box mt={3}>
        {activeTab === "Аудит" && (
          <LeanAudit
            auditData={project.leanTemplates?.audit || []}
            onChange={(updatedAudit) =>
              setProject((prev) => ({
                ...prev,
                leanTemplates: {
                  ...prev.leanTemplates,
                  audit: updatedAudit,
                },
              }))
            }
            participants={project.participants}
          />
        )}

        {activeTab === "Lean Canvas" && (
          <>
            {["problem","solution","uniqueValue","unfairAdvantage","customerSegments","keyMetrics","channels","costStructure","revenueStreams"].map((key) => (
              <TextField
                key={key}
                label={key}
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

        {activeTab === "AI рекомендації" && (
          <RecommendationsTab content={project.aiAnalysis || "Рекомендації ще не згенеровано"} />
        )}

        {activeTab === "Kanban" && (
          <KanbanBoard
            kanbanData={project.leanTemplates?.kanban || []}
            onChange={(newKanban, newColumns = null) => {
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
              fetch(`${process.env.REACT_APP_BACKEND_URL}/lean/${project._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ leanTemplates: updatedLeanTemplates }),
              });
            }}
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
            kaizenData={project.leanTemplates?.kaizen || { ideas: [] }}
            onChange={(updatedKaizen) => {
              const updated = {
                ...project,
                leanTemplates: {
                  ...project.leanTemplates,
                  kaizen: updatedKaizen
                }
              };
              setProject(updated);
            }}
            projectId={project._id}
            participants={project.participants || []}
          />
        )}

        {activeTab === "Налаштування" && (
          <Box>
            <ProjectParticipants
              projectId={project._id}
              participants={project.participants}
              setProject={setProject}
              onDeleteProject={() => navigate('/lean-projects')}
            />
          </Box>
        )}

        <Box mt={4}>
          <Button variant="contained" onClick={() => { setAiOpen(true); generateAI(); }}>
            AI-рекоменація
          </Button>
        </Box>

        <Modal open={aiOpen} onClose={() => setAiOpen(false)}>
          <Box sx={{ bgcolor: 'white', p: 3, maxWidth: 800, mx: 'auto', mt: '10vh', borderRadius: 2 }}>
            <Typography variant="h6">🤖 AI-аналіз проєкту</Typography>
            {aiLoading ? (
              <Box textAlign="center" mt={3}><CircularProgress /></Box>
            ) : (
              <>
                <pre style={{ whiteSpace: "pre-wrap", background: "#f9f9f9", padding: 16, maxHeight: 500, overflowY: 'auto' }}>{aiResult}</pre>
                <Button onClick={downloadText} variant="outlined">⬇️ Завантажити .txt</Button>
              </>
            )}
          </Box>
        </Modal>
      </Box>

      <Button variant="contained" sx={{ mt: 3 }} onClick={saveChanges}>
        Зберегти зміни
      </Button>
    </Box>
    </Box>
  );
};

export default LeanProjectDetails;
