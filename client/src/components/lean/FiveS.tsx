import React from "react";
import PropTypes from "prop-types";
import { Box, Typography } from "@mui/material";
import { FiveSTable } from "./FiveSTable";

export const FiveS = ({ fiveSData, onChange }) => {
  const updateData = (section, newData) => {
    onChange(section, newData);
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Методологія 5S (таблична форма)</Typography>

      <FiveSTable
        title="1. Sort (Сортування)"
        data={fiveSData?.sort || []}
        onChange={(newData) => updateData("sort", newData)}
        columns={["Об'єкт", "Статус", "Причина"]}
        fields={["object", "status", "reason"]}
      />

      <FiveSTable
        title="2. Set in Order (Систематизація)"
        data={fiveSData?.setInOrder || []}
        onChange={(newData) => updateData("setInOrder", newData)}
        columns={["Об'єкт", "Місце зберігання", "Маркування"]}
        fields={["object", "location", "labeling"]}
      />

      <FiveSTable
        title="3. Shine (Прибирання)"
        data={fiveSData?.shine || []}
        onChange={(newData) => updateData("shine", newData)}
        columns={["Зона", "Відповідальний", "Частота"]}
        fields={["zone", "responsible", "frequency"]}
      />

      <FiveSTable
        title="4. Standardize (Стандартизація)"
        data={fiveSData?.standardize || []}
        onChange={(newData) => updateData("standardize", newData)}
        columns={["Процедура", "Інструкція", "Візуальний контроль"]}
        fields={["procedure", "instruction", "visual"]}
      />

      <FiveSTable
        title="5. Sustain (Дотримання)"
        data={fiveSData?.sustain || []}
        onChange={(newData) => updateData("sustain", newData)}
        columns={["Дата перевірки", "Відповідальний", "Коментар"]}
        fields={["date", "responsible", "comment"]}
      />
    </Box>
  );
};

FiveS.propTypes = {
  fiveSData: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
};
