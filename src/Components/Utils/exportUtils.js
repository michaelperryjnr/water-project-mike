import { saveAs } from 'file-saver';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { Document, Packer, Paragraph, Table, TableCell, TableRow } from 'docx';

export const exportToCSV = (data, filename) => {
  const csv = Papa.unparse(data);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, `${filename}.csv`);
};

export const exportToXLSX = (data, filename) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  XLSX.writeFile(workbook, `${filename}.xlsx`);
};

export const exportToDOCX = (data, filename) => {
  const table = new Table({
    rows: [
      new TableRow({
        children: Object.keys(data[0]).map(key => new TableCell({
          children: [new Paragraph(key)],
        })),
      }),
      ...data.map(row => new TableRow({
        children: Object.values(row).map(value => new TableCell({
          children: [new Paragraph(value.toString())],
        })),
      })),
    ],
  });

  const doc = new Document({
    sections: [{ children: [table] }],
  });

  Packer.toBlob(doc).then(blob => {
    saveAs(blob, `${filename}.docx`);
  });
};
