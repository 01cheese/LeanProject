import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  Autocomplete,
} from "@mui/material";
import PropTypes from "prop-types";
import debounce from "lodash.debounce";

import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';

export const ProjectParticipants = ({ projectId, participants, setProject, onDeleteProject }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [options, setOptions] = useState([]);
  const [message, setMessage] = useState("");

  const fetchUsers = debounce(async (input) => {
    if (!input) return;
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/users/search?query=${input}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setOptions(data);
      } else {
        setOptions([]);
      }
    } catch (err) {
      console.error("Помилка при пошуку користувачів:", err);
      setOptions([]);
    }
  }, 300);

  const addUser = async () => {
    if (!selectedUser) return;

    const isAlreadyInProject = participants.some(
      (p) => p.user === selectedUser._id || p.user?._id === selectedUser._id
    );

    if (isAlreadyInProject) {
      setMessage("Користувач вже у проєкті.");
      return;
    }

    const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/lean/${projectId}/add-user`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: selectedUser._id }),
    });

    const result = await res.json();

    if (res.ok) {
      setSelectedUser(null);
      setOptions([]);
      setMessage("Запрошення надіслано!");
    } else {
      setMessage(`${result.message}`);
    }
  };

  const removeUser = async (userId) => {
    const user = participants.find(p => p.user._id === userId || p.user === userId);
    if (user?.role === "admin") {
      setMessage("Неможливо видалити адміністратора.");
      return;
    }

    await fetch(`${process.env.REACT_APP_BACKEND_URL}/lean/${projectId}/remove-user/${userId}`, {
      method: "DELETE",
    });

    setProject((prev) => ({
      ...prev,
      participants: prev.participants.filter(
        (p) => p.user !== userId && p.user?._id !== userId
      ),
    }));
  };

  const deleteProject = async () => {
    if (!window.confirm("Видалити цей проєкт?")) return;
    await fetch(`${process.env.REACT_APP_BACKEND_URL}/lean/${projectId}`, {
      method: "DELETE",
    });
    onDeleteProject();
  };

  return (
    <Box mt={4}>
      <Typography variant="h6" gutterBottom>Учасники проєкту</Typography>

      <Autocomplete
        options={options}
        getOptionLabel={(option) => option.email}
        onInputChange={(e, value) => fetchUsers(value)}
        onChange={(e, value) => setSelectedUser(value)}
        renderInput={(params) => (
          <TextField {...params} label="Email користувача" />
        )}
        sx={{ minWidth: 300, mb: 2 }}
      />

      <Button variant="contained" onClick={addUser} disabled={!selectedUser}>
        Додати
      </Button>

      {message && (
        <Typography sx={{ mt: 1 }} color={
          message.startsWith("+") ? "green" : "error"
        }>
          {message}
        </Typography>
      )}

      <List sx={{ mt: 2 }}>
        {(participants || []).map((p, index) => (
          <ListItem
            key={index}
            secondaryAction={
              p.role !== "admin" && (
                <IconButton edge="end" onClick={() => removeUser(p.user._id || p.user)}>
                  <DeleteIcon />
                </IconButton>
              )
            }
          >
            <ListItemText
              primary={p.user?.name || p.user?.email || "Користувач"}
              secondary={`Роль: ${p.role}`}
            />
          </ListItem>
        ))}
      </List>

      <Button
        variant="outlined"
        color="error"
        size="small"
        onClick={deleteProject}
        sx={{ mt: 2 }}
      >
        Видалити проєкт
      </Button>
    </Box>
  );
};

ProjectParticipants.propTypes = {
  projectId: PropTypes.string.isRequired,
  participants: PropTypes.array.isRequired,
  setProject: PropTypes.func.isRequired,
  onDeleteProject: PropTypes.func.isRequired,
};
