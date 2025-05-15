import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  InputAdornment,
  MenuItem,
} from "@pankod/refine-mui";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";

interface KanbanTask {
  title: string;
  status: string;
  assignedTo?: string;
  dueDate?: string | null;
  comments?: string[];
}

interface KanbanBoardProps {
  kanbanData: KanbanTask[];
  onChange: (tasks: KanbanTask[]) => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
                                                          kanbanData,
                                                          onChange,
                                                        }) => {
  const [newTask, setNewTask] = useState("");
  const [newStatus, setNewStatus] = useState("backlog");
  const [newComment, setNewComment] = useState("");
  const [newAssignee, setNewAssignee] = useState("");
  const [newDueDate, setNewDueDate] = useState("");
  const [openCommentsIndex, setOpenCommentsIndex] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const statuses = ["backlog", "todo", "in_progress", "review", "done"];

  const statusLabels: Record<string, string> = {
    backlog: "📥 Backlog",
    todo: "📝 To Do",
    in_progress: "🔧 In Progress",
    review: "🔍 Review",
    done: "✅ Done",
  };

  const addTask = () => {
    if (newTask.trim() === "") return;
    const task: KanbanTask = {
      title: newTask,
      status: newStatus,
      assignedTo: newAssignee,
      dueDate: newDueDate || null,
      comments: [],
    };
    onChange([...kanbanData, task]);
    setNewTask("");
    setNewAssignee("");
    setNewDueDate("");
  };

  const moveTask = (index: number, direction: number) => {
    const task = kanbanData[index];
    const currentIndex = statuses.indexOf(task.status);
    const newIndex = currentIndex + direction;
    if (newIndex < 0 || newIndex >= statuses.length) return;

    const updated = [...kanbanData];
    updated[index].status = statuses[newIndex];
    onChange(updated);
  };

  const addComment = (index: number) => {
    const updated = [...kanbanData];
    updated[index].comments = [...(updated[index].comments || []), newComment];
    onChange(updated);
    setNewComment("");
  };

  const filteredTasks = (status: string) =>
    kanbanData.filter(
      (task) =>
        task.status === status &&
        (task.title?.toLowerCase() || "").includes(searchTerm.toLowerCase())
    );

  return (
    <Box>
      <Box display="flex" gap={2} flexWrap="wrap" alignItems="center" mb={2}>
        <TextField
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="🔍 Пошук завдань..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Box display="flex" gap={2} flexWrap="wrap">
        {statuses.map((status) => (
          <Paper
            key={status}
            sx={{
              p: 2,
              minWidth: "260px",
              flex: 1,
              backgroundColor: "#f9f9f9",
              maxHeight: "70vh",
              overflowY: "auto",
              position: "relative",
            }}
          >
            <Typography variant="h6">{statusLabels[status]}</Typography>
            {filteredTasks(status).map((task, index) => (
              <Paper
                key={index}
                sx={{
                  p: 1.5,
                  my: 1,
                  backgroundColor: "#fff",
                  borderLeft: "4px solid #1976d2",
                }}
              >
                <Typography fontWeight={600}>{task.title}</Typography>
                {task.dueDate && (
                  <Typography variant="caption">📅 {task.dueDate}</Typography>
                )}
                {task.assignedTo && (
                  <Typography variant="caption">👤 {task.assignedTo}</Typography>
                )}
                <Box mt={1} display="flex" gap={1}>
                  <Button
                    size="small"
                    onClick={() => moveTask(kanbanData.indexOf(task), -1)}
                  >
                    ←
                  </Button>
                  <Button
                    size="small"
                    onClick={() => moveTask(kanbanData.indexOf(task), 1)}
                  >
                    →
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    onClick={() => {
                      const updated = kanbanData.filter(
                        (_, i) => i !== kanbanData.indexOf(task)
                      );
                      onChange(updated);
                    }}
                  >
                    🗑️
                  </Button>
                  <Button
                    size="small"
                    onClick={() => setOpenCommentsIndex(index)}
                  >
                    💬
                  </Button>
                </Box>
              </Paper>
            ))}
          </Paper>
        ))}
      </Box>

      {/* Додати завдання */}
      <Box mt={3}>
        <Typography variant="h6" gutterBottom>
          ➕ Нова задача
        </Typography>
        <TextField
          fullWidth
          label="Назва"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          sx={{ mb: 1 }}
        />
        <TextField
          select
          fullWidth
          label="Статус"
          value={newStatus}
          onChange={(e) => setNewStatus(e.target.value)}
          sx={{ mb: 1 }}
        >
          {statuses.map((s) => (
            <MenuItem key={s} value={s}>
              {statusLabels[s]}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          fullWidth
          label="Виконавець"
          value={newAssignee}
          onChange={(e) => setNewAssignee(e.target.value)}
          sx={{ mb: 1 }}
        />
        <TextField
          fullWidth
          type="date"
          label="Дедлайн"
          InputLabelProps={{ shrink: true }}
          value={newDueDate}
          onChange={(e) => setNewDueDate(e.target.value)}
          sx={{ mb: 1 }}
        />
        <Button variant="contained" onClick={addTask}>
          ✅ Додати
        </Button>
      </Box>

      {/* Вікно коментарів */}
      <Dialog
        open={openCommentsIndex !== null}
        onClose={() => setOpenCommentsIndex(null)}
      >
        <DialogTitle>
          💬 Коментарі
          <IconButton
            aria-label="close"
            onClick={() => setOpenCommentsIndex(null)}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Box>
            {(kanbanData[openCommentsIndex!]?.comments || []).map((c, i) => (
              <Typography key={i} sx={{ mb: 1 }}>
                • {c}
              </Typography>
            ))}
            <TextField
              fullWidth
              label="Новий коментар"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              sx={{ mt: 2 }}
            />
            <Button
              variant="outlined"
              onClick={() => {
                if (openCommentsIndex !== null) {
                  addComment(openCommentsIndex);
                }
              }}
              sx={{ mt: 1 }}
            >
              ➕ Додати коментар
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};
