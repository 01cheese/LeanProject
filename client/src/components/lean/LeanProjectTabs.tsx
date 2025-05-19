// components/lean/LeanProjectTabs.tsx
import React, { useState } from "react";
import { Tabs, Tab } from "@mui/material";

interface LeanProjectTabsProps {
  onChange: (tab: string) => void;
}

const tabList = ["Lean Canvas", "5S", "Kanban", "Kaizen", "Аудит","AI рекомендації", "Налаштування"];

const LeanProjectTabs: React.FC<LeanProjectTabsProps> = ({ onChange }) => {
  const [value, setValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    onChange(tabList[newValue]);
  };

  return (
    <Tabs value={value} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
      {tabList.map((label, i) => (
        <Tab key={i} label={label} />
      ))}
    </Tabs>
  );
};

export default LeanProjectTabs;
