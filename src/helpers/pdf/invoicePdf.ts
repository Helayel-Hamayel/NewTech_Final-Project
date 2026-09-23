import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { Invoice } from "../../data/residentPortal";
import { resident } from "../../data/residentPortal";
import { currency } from "../formatting/currency";

export function downloadInvoicePdf(invoice: Invoice) {
  const document = new jsPDF({ unit: "mm", format: "a4" });
  const pageWidth = document.internal.pageSize.getWidth();
  const pageHeight = document.internal.pageSize.getHeight();
  const margin = 20;
  const accent = [14, 116, 144] as const;
  const ink = [30, 41, 59] as const;
  const muted = [100, 116, 139] as const;

  document.setTextColor(ink[0], ink[1], ink[2]);
  document.setFont("helvetica", "bold");
  document.setFontSize(19);
  document.text("City of Millbrook", margin, 25);
  document.setFont("helvetica", "normal");
  document.setFontSize(8);
  document.setTextColor(muted[0], muted[1], muted[2]);
  document.text("CITY OF MILLBROOK  ·  RESIDENT SERVICES", margin, 32);
  document.setTextColor(ink[0], ink[1], ink[2]);
  document.setFont("helvetica", "bold");
  document.setFontSize(22);
  document.text("INVOICE", pageWidth - margin, 25, { align: "right" });
  document.setFont("helvetica", "normal");
  document.setFontSize(9);
  document.setTextColor(muted[0], muted[1], muted[2]);
  document.text(invoice.id, pageWidth - margin, 32, { align: "right" });
  document.setDrawColor(accent[0], accent[1], accent[2]);
  document.setLineWidth(1.2);
  document.line(margin, 40, pageWidth - margin, 40);

  document.setTextColor(muted[0], muted[1], muted[2]);
  document.setFontSize(8);
  document.text("BILLED TO", margin, 53);
  document.setTextColor(ink[0], ink[1], ink[2]);
  document.setFont("helvetica", "bold");
  document.setFontSize(11);
  document.text(resident.name, margin, 61);
  document.setFont("helvetica", "normal");
  document.setFontSize(9);
  document.setTextColor(muted[0], muted[1], muted[2]);
  document.text(`Resident ID: ${resident.id}`, margin, 68);

  document.text("BILLING DETAILS", pageWidth - margin, 53, {
    align: "right",
  });
  document.setTextColor(ink[0], ink[1], ink[2]);
  document.text(`Billing period: ${invoice.period}`, pageWidth - margin, 61, {
    align: "right",
  });
  document.text(`Issued: ${invoice.period}`, pageWidth - margin, 68, {
    align: "right",
  });

  const statusColor = invoice.status === "Paid" ? [22, 101, 52] : [154, 52, 18];
  document.setTextColor(statusColor[0], statusColor[1], statusColor[2]);
  document.setFont("helvetica", "bold");
  document.setFontSize(8);
  document.text(`STATUS: ${invoice.status.toUpperCase()}`, margin, 82);

  autoTable(document, {
    startY: 89,
    head: [["Description", "Amount"]],
    body: [
      ["Rent", currency.format(invoice.rent)],
      ["Water", currency.format(invoice.water)],
      ["Electricity", currency.format(invoice.electricity)],
      ["Fines", currency.format(invoice.fines)],
    ],
    theme: "grid",
    styles: {
      textColor: [30, 41, 59],
      font: "helvetica",
      fontSize: 9,
      lineColor: [226, 232, 240],
      lineWidth: 0.2,
      cellPadding: { top: 4, right: 8, bottom: 4, left: 8 },
    },
    headStyles: {
      fillColor: [241, 245, 249],
      textColor: [71, 85, 105],
      fontSize: 8,
      fontStyle: "bold",
    },
    bodyStyles: { textColor: [30, 41, 59], fontSize: 9 },
    columnStyles: { 0: { cellWidth: 120 }, 1: { halign: "right" } },
    margin: { left: margin, right: margin },
  });

  const finalY =
    (document as jsPDF & { lastAutoTable?: { finalY: number } }).lastAutoTable
      ?.finalY ?? 120;
  document.setTextColor(muted[0], muted[1], muted[2]);
  document.setFont("helvetica", "bold");
  document.setFontSize(9);
  document.text(
    invoice.status === "Paid" ? "TOTAL PAID" : "TOTAL DUE",
    pageWidth - 72,
    finalY + 14,
  );
  document.setTextColor(ink[0], ink[1], ink[2]);
  document.setFontSize(14);
  document.text(
    currency.format(invoice.total),
    pageWidth - margin,
    finalY + 14,
    {
      align: "right",
    },
  );

  document.setDrawColor(226, 232, 240);
  document.setLineWidth(0.3);
  document.line(margin, pageHeight - 32, pageWidth - margin, pageHeight - 32);
  document.setFont("helvetica", "normal");
  document.setFontSize(8);
  document.setTextColor(muted[0], muted[1], muted[2]);
  document.text(
    "Resident Services  ·  (555) 010-2041  ·  billing@millbrook.gov",
    margin,
    pageHeight - 24,
  );
  document.text(
    "City of Millbrook · Resident payment record",
    pageWidth - margin,
    pageHeight - 24,
    {
      align: "right",
    },
  );

  document.save(`${invoice.id}.pdf`);
}
