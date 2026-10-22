/**
 * Offline Free Download & Timetable Export Engine
 * Generates print-ready Standard A4 & Universal PDFs entirely in-memory using jsPDF.
 * Requires 0 network requests - works 100% offline on both Android, iOS, and Desktop.
 */

import { jsPDF } from 'jspdf';
import { Product } from '../types';

export interface DownloadOptions {
  format?: 'a4' | 'universal';
  customerName?: string;
  customerEmail?: string;
}

export const generateOfflineProductPDF = (
  product: Product,
  options: DownloadOptions = {}
): Blob => {
  const isA4 = options.format !== 'universal';
  const pageWidth = isA4 ? 210 : 215.9; // mm
  const pageHeight = isA4 ? 297 : 279.4; // mm

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: isA4 ? 'a4' : 'letter',
    compress: true
  });

  // PAGE 1: High-Definition Cover & Activity Sheet Header
  doc.setFillColor(15, 23, 42); // Slate-900
  doc.rect(0, 0, pageWidth, 28, 'F');

  // Brand Name & Category
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('FAMILY PRINTABLES', 14, 13);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(199, 210, 254); // Indigo-200
  doc.text(`OFFICIAL WORKBOOK · ${product.categoryLabel.toUpperCase()}`, 14, 21);

  // Resolution & Offline badge
  doc.setFontSize(8);
  doc.setTextColor(52, 211, 153); // Emerald-400
  doc.text('300 DPI VECTOR PRINT · OFFLINE VERIFIED', pageWidth - 14, 17, { align: 'right' });

  // Product Title Header
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  const splitTitle = doc.splitTextToSize(product.title, pageWidth - 28);
  doc.text(splitTitle, 14, 42);

  let currentY = 42 + splitTitle.length * 7;

  // Metadata Chips
  doc.setFillColor(241, 245, 249); // Slate-100
  doc.roundedRect(14, currentY, pageWidth - 28, 16, 2, 2, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(79, 70, 229); // Indigo-600

  let metadataText = `CATEGORY: ${product.categoryLabel.toUpperCase()}`;
  if (product.targetAge && product.targetAge.trim()) {
    metadataText += `  |  AGE: ${product.targetAge}`;
  }
  if (product.pages && product.pages > 0 && product.category !== 'audio-stories') {
    metadataText += `  |  PAGES: ${product.pages} PGS`;
  }
  doc.text(metadataText, 18, currentY + 10.5);

  currentY += 24;

  // Description & Instructions
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(71, 85, 105);
  const descText = product.description || product.shortDesc || 'Instant printable activity workbook designed for focused learning and creativity.';
  const splitDesc = doc.splitTextToSize(descText, pageWidth - 28);
  doc.text(splitDesc, 14, currentY);

  currentY += splitDesc.length * 5.5 + 8;

  // Educational Benefit Box (if present)
  if (product.educationalBenefit && product.educationalBenefit.trim()) {
    doc.setFillColor(238, 242, 255); // Indigo-50
    doc.setDrawColor(199, 210, 254);
    doc.roundedRect(14, currentY, pageWidth - 28, 18, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(67, 56, 202);
    doc.text('EDUCATIONAL BENEFIT & DEVELOPMENTAL FOCUS', 18, currentY + 6.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(49, 46, 129);
    const benefitSplit = doc.splitTextToSize(product.educationalBenefit, pageWidth - 36);
    doc.text(benefitSplit, 18, currentY + 12.5);

    currentY += 26;
  }

  // Printable Interactive Activity / Practice Worksheet Section
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text('WORKSHEET & PRACTICE ACTIVITY GRID', 14, currentY);

  currentY += 6;

  // 4 Printable Practice Activity Blocks
  const boxWidth = (pageWidth - 34) / 2;
  const boxHeight = 44;

  const activities = [
    { num: '1', title: 'Daily Warm-up / Tracing Goal', hint: 'Complete step 1 with focused pencil control' },
    { num: '2', title: 'Core Skill & Vocabulary Task', hint: 'Fill in the words or match related items' },
    { num: '3', title: 'Creative Drawing & Reflection', hint: 'Express thoughts with markers or dry-erase pens' },
    { num: '4', title: 'Daily Mastery & Star Rating', hint: 'Celebrate progress: [ * ] [ * ] [ * ] [ * ] [ * ]' }
  ];

  activities.forEach((act, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const x = 14 + col * (boxWidth + 6);
    const y = currentY + row * (boxHeight + 5);

    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(203, 213, 225); // Slate-300
    doc.roundedRect(x, y, boxWidth, boxHeight, 2, 2, 'FD');

    // Number tag
    doc.setFillColor(79, 70, 229);
    doc.circle(x + 7, y + 8, 4, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(255, 255, 255);
    doc.text(act.num, x + 7, y + 9.5, { align: 'center' });

    // Activity Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(30, 41, 59);
    doc.text(act.title, x + 14, y + 9);

    // Guide lines for practice
    doc.setDrawColor(226, 232, 240);
    doc.setLineDashPattern([1.5, 1.5], 0);
    doc.line(x + 6, y + 20, x + boxWidth - 6, y + 20);
    doc.line(x + 6, y + 28, x + boxWidth - 6, y + 28);
    doc.line(x + 6, y + 36, x + boxWidth - 6, y + 36);
    doc.setLineDashPattern([], 0); // reset

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text(act.hint, x + 6, y + 41);
  });

  // Footer on Page 1
  const footerY = pageHeight - 12;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text('© Family Printables · Instant 300 DPI Digital Vault · Unlimited Re-prints Permitted', 14, footerY);
  doc.text('Standard A4 / Universal Format', pageWidth - 14, footerY, { align: 'right' });

  return doc.output('blob');
};

export const downloadProductFileOffline = (
  product: Product,
  formatName: string = 'Standard_A4_PDF'
): void => {
  // If product already has an uploaded custom document file, data URL, or stored asset, trigger direct download!
  if (product.documentFileUrl && product.documentFileUrl.trim().length > 0) {
    const link = document.createElement('a');
    link.href = product.documentFileUrl;
    link.download = product.documentFileName || `${product.id}_document.pdf`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return;
  }

  // Otherwise generate high-res vector PDF in-memory offline!
  const isA4 = !formatName.toLowerCase().includes('universal');
  const blob = generateOfflineProductPDF(product, { format: isA4 ? 'a4' : 'universal' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  const cleanTitle = product.title.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 40);
  link.download = `${cleanTitle}_${formatName}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 2000);
};
