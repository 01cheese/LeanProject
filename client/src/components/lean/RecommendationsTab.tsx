import React from 'react';
import { Box, Button } from '@mui/material';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';

const RecommendationsTab = ({ content }: { content: string }) => {
  const filename = 'recommendations';

  const download = (ext: string, data: BlobPart, type: string) => {
    const blob = new Blob([data], { type });
    saveAs(blob, `${filename}.${ext}`);
  };

  const downloadMd = () => download('md', content, 'text/markdown');
  const downloadTxt = () => download('txt', content, 'text/plain');
  const downloadExcel = () => {
    const ws = XLSX.utils.aoa_to_sheet([[content]]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    const excelData = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([excelData]), `${filename}.xlsx`);
  };
  const downloadPdf = () => {
    const pdf = new jsPDF();
    pdf.setFontSize(12);
    const lines = pdf.splitTextToSize(content, 180);
    pdf.text(lines, 10, 10);
    pdf.save(`${filename}.pdf`);
  };

  return (
    <Box>
      <Box display="flex" gap={2} mb={2}>
        <Button onClick={downloadMd}>.md</Button>
        <Button onClick={downloadTxt}>.txt</Button>
        <Button onClick={downloadExcel}>Excel</Button>
        <Button onClick={downloadPdf}>PDF</Button>
      </Box>
      <Box sx={{ backgroundColor: '#f6f6f6', p: 2, borderRadius: 2, maxHeight: 500, overflowY: 'auto' }}>
        <Markdown remarkPlugins={[remarkGfm]}>{content}</Markdown>
      </Box>
    </Box>
  );
};

export default RecommendationsTab;
