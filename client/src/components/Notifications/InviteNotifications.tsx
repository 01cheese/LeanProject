// components/InviteNotifications.tsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  Stack,
  Divider,
} from "@mui/material";

interface Invite {
  _id: string;
  projectName: string;
  createdAt: string;
}

interface Message {
  _id: string;
  title?: string;
  content: string;
  createdAt: string;
}

interface InviteNotificationsProps {
  userId: string;
}

const InviteNotifications: React.FC<InviteNotificationsProps> = ({ userId }) => {
  const [invites, setInvites] = useState<Invite[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

  const fetchInvites = async () => {
    const res = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/notifications/${userId}`
    );
    const data = await res.json();
    setInvites(data);
  };

  const fetchMessages = async () => {
    const res = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/messages/${userId}`
    );
    const data = await res.json();
    setMessages(data);
  };

  const handleAction = async (id: string, action: "accept" | "decline") => {
    await fetch(`${process.env.REACT_APP_BACKEND_URL}/notifications/${id}/${action}`, {
      method: "PUT",
    });
    fetchInvites();
  };

  useEffect(() => {
    if (userId) {
      fetchInvites();
      fetchMessages();
    }
  }, [userId]);

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        📬 Запрошення до проєктів
      </Typography>
      {invites.length ? (
        <List>
          {invites.map((invite) => (
            <ListItem
              key={invite._id}
              sx={{ borderBottom: "1px solid #ccc", mb: 1 }}
              secondaryAction={
                <Stack direction="row" spacing={1}>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => handleAction(invite._id, "accept")}
                  >
                    Прийняти
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleAction(invite._id, "decline")}
                  >
                    Відхилити
                  </Button>
                </Stack>
              }
            >
              <ListItemText
                primary={`Запрошення до проєкту "${invite.projectName}"`}
                secondary={new Date(invite.createdAt).toLocaleString()}
              />
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography>Немає нових запрошень.</Typography>
      )}

      <Divider sx={{ my: 4 }} />

      <Typography variant="h6" gutterBottom>
        💬 Повідомлення
      </Typography>
      {messages.length ? (
        <List>
          {messages.map((msg) => (
            <ListItem key={msg._id} sx={{ borderBottom: "1px solid #ccc" }}>
              <ListItemText
                primary={msg.title || "Нове повідомлення"}
                secondary={`${msg.content} — ${new Date(msg.createdAt).toLocaleString()}`}
              />
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography>Немає повідомлень.</Typography>
      )}
    </Box>
  );
};

export default InviteNotifications;