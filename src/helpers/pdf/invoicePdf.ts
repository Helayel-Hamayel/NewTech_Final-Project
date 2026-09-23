import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { Invoice } from "../../data/residentPortal";
import { resident } from "../../data/residentPortal";
import { currency } from "../formatting/currency";

export function downloadInvoicePdf(invoice: Invoice) {
  const document = new jsPDF();
  const pageWidth = document.internal.pageSize.getWidth();
  const pageHeight = document.internal.pageSize.getHeight();
  const margin = 18;
  const navy = [15, 23, 42] as const;
  const teal = [14, 116, 144] as const;
  const ink = [30, 41, 59] as const;
  const muted = [100, 116, 139] as const;
  const paleBlue = [239, 246, 255] as const;

  document.setFillColor(navy[0], navy[1], navy[2]);
  document.rect(0, 0, pageWidth, 48, "F");
  document.setFillColor(teal[0], teal[1], teal[2]);
  document.roundedRect(margin, 14, 20, 20, 4, 4, "F");
  document.setTextColor(255, 255, 255);
  document.setFontSize(13);
  document.setFont("helvetica", "bold");
  document.text("CH", margin + 10, 27, { align: "center" });
  document.setFontSize(17);
  document.text("CivicHub", margin + 28, 22);
  document.setFontSize(9);
  document.setFont("helvetica", "normal");
  document.setTextColor(186, 230, 253);
  document.text("CITY OF MILLBROOK  /  RESIDENT SERVICES", margin + 28, 31);
  document.setTextColor(255, 255, 255);
  document.setFontSize(20);
  document.setFont("helvetica", "bold");
  document.text("INVOICE", pageWidth - margin, 22, { align: "right" });
  document.setFontSize(9);
  document.setFont("helvetica", "normal");
  document.setTextColor(186, 230, 253);
  document.text(invoice.id, pageWidth - margin, 31, { align: "right" });

  document.setTextColor(ink[0], ink[1], ink[2]);
  document.setFontSize(10);
  document.setFont("helvetica", "normal");
  document.text("BILLED TO", margin, 68);
  document.setFont("helvetica", "bold");
  document.setFontSize(13);
  document.text(resident.name, margin, 77);
  document.setFont("helvetica", "normal");
  document.setFontSize(9);
  document.setTextColor(muted[0], muted[1], muted[2]);
  document.text(`Resident ID  ${resident.id}`, margin, 85);

  document.setTextColor(muted[0], muted[1], muted[2]);
  document.setFontSize(9);
  document.text("BILLING DETAILS", pageWidth - margin, 68, {
    align: "right",
  });
  document.setTextColor(ink[0], ink[1], ink[2]);
  document.setFontSize(10);
  document.text(`Billing period  ${invoice.period}`, pageWidth - margin, 77, {
    align: "right",
  });
  document.text(`Issued  ${invoice.period}`, pageWidth - margin, 85, {
    align: "right",
  });

  const statusColor =
    invoice.status === "Paid" ? [22, 101, 52] : [154, 52, 18];
  const statusBackground =
    invoice.status === "Paid" ? [220, 252, 231] : [255, 237, 213];
  document.setFillColor(
    statusBackground[0],
    statusBackground[1],
    statusBackground[2],
  );
  document.roundedRect(margin, 98, 30, 9, 4.5, 4.5, "F");
  document.setTextColor(statusColor[0], statusColor[1], statusColor[2]);
  document.setFont("helvetica", "bold");
  document.setFontSize(8);
  document.text(invoice.status.toUpperCase(), margin + 15, 104, {
    align: "center",
  });

  autoTable(document, {
    startY: 116,
    head: [["DESCRIPTION", "AMOUNT"]],
    body: [
      ["Rent", currency.format(invoice.rent)],
      ["Water", currency.format(invoice.water)],
      ["Electricity", currency.format(invoice.electricity)],
      ["Fines", currency.format(invoice.fines)],
    ],
    theme: "plain",
    styles: {
      textColor: [30, 41, 59],
      font: "helvetica",
      fontSize: 10,
      cellPadding: { top: 9, right: 10, bottom: 9, left: 10 },
    },
    headStyles: {
      fillColor: [15, 23, 42],
      textColor: 255,
      fontSize: 8,
      fontStyle: "bold",
      cellPadding: { top: 7, right: 10, bottom: 7, left: 10 },
    },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    bodyStyles: { textColor: [30, 41, 59], fontSize: 10 },
    columnStyles: { 0: { cellWidth: 112 }, 1: { halign: "right" } },
    didDrawCell: (data) => {
      if (data.section === "body") {
        document.setDrawColor(226, 232, 240);
        document.line(
          data.cell.x,
          data.cell.y + data.cell.height,
          data.cell.x + data.cell.width,
          data.cell.y + data.cell.height,
        );
      }
    },
    margin: { left: 18, right: 18 },
  });

  const finalY =
    (document as jsPDF & { lastAutoTable?: { finalY: number } }).lastAutoTable
      ?.finalY ?? 120;
  document.setFillColor(paleBlue[0], paleBlue[1], paleBlue[2]);
  document.roundedRect(
    margin,
    finalY + 16,
    pageWidth - margin * 2,
    32,
    4,
    4,
    "F",
  );
  document.setTextColor(muted[0], muted[1], muted[2]);
  document.setFont("helvetica", "bold");
  document.setFontSize(9);
  document.text(
    invoice.status === "Paid" ? "TOTAL PAID" : "TOTAL DUE",
    margin + 10,
    finalY + 30,
  );
  document.setTextColor(navy[0], navy[1], navy[2]);
  document.setFontSize(18);
  document.text(
    currency.format(invoice.total),
    pageWidth - margin - 10,
    finalY + 31,
    {
      align: "right",
    },
  );
  document.setFont("helvetica", "normal");
  document.setFontSize(9);
  document.setTextColor(muted[0], muted[1], muted[2]);
  document.text(
    "Questions about this invoice? Contact Millbrook Resident Services.",
    margin,
    pageHeight - 22,
  );
  document.text(
    "CivicHub  ·  Resident payment record",
    pageWidth - margin,
    pageHeight - 22,
    {
      align: "right",
    },
  );
  document.setDrawColor(226, 232, 240);
  document.line(margin, pageHeight - 30, pageWidth - margin, pageHeight - 30);

  document.save(`${invoice.id}.pdf`);
}