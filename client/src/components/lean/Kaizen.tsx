import React from "react";
import PropTypes from "prop-types";
import { Box, Typography, TextField } from "@mui/material";
import { FiveSTable } from "./FiveSTable";

export const Kaizen = ({ kaizenData, onChange }) => {
  const updateSection = (key, value) => {
    onChange({ ...kaizenData, [key]: value });
  };

  const handleBeforeAfterChange = (field, value) => {
    const current = kaizenData?.beforeAfter || {};
    updateSection("beforeAfter", { ...current, [field]: value });
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>📈 KAIZEN — Непрерывное улучшение</Typography>

      <FiveSTable
        title="1. 💡 Ідеї Kaizen (пропозиції)"
        data={Array.isArray(kaizenData?.ideas) ? kaizenData.ideas : []}
        onChange={(newData) => updateSection("ideas", newData)}
        columns={["Ідея", "Автор", "Статус", "Дата", "Коментар"]}
        fields={["idea", "author", "status", "date", "comment"]}
      />

      <FiveSTable
        title="2. 📋 План дій Kaizen"
        data={Array.isArray(kaizenData?.plan) ? kaizenData.plan : []}
        onChange={(newData) => updateSection("plan", newData)}
        columns={["Дія", "Відповідальний", "Термін", "Завершено"]}
        fields={["action", "responsible", "deadline", "done"]}
      />

      <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>3. 🔄 До / Після</Typography>
      <TextField
        label="До покращення"
        value={kaizenData?.beforeAfter?.before || ""}
        onChange={(e) => handleBeforeAfterChange("before", e.target.value)}
        fullWidth
        multiline
        rows={3}
        sx={{ mb: 2 }}
      />
      <TextField
        label="Після покращення"
        value={kaizenData?.beforeAfter?.after || ""}
        onChange={(e) => handleBeforeAfterChange("after", e.target.value)}
        fullWidth
        multiline
        rows={3}
      />

      <FiveSTable
        title="4. 📊 Ефект від Kaizen"
        data={Array.isArray(kaizenData?.effect) ? kaizenData.effect : []}
        onChange={(newData) => updateSection("effect", newData)}
        columns={["Показник", "До", "Після", "Коментар"]}
        fields={["metric", "before", "after", "comment"]}
      />
    </Box>
  );
};

Kaizen.propTypes = {
  kaizenData: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
};