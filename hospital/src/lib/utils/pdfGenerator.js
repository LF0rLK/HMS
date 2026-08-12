/**
 * ONE HMS — PDF Generator Utility
 * Black & white only. Follows the design system typography and spacing scale.
 *
 * Design tokens mapped to PDF:
 *   text-primary   → #0D0D0F
 *   text-secondary → #6B7280
 *   surface        → #F6F6F6
 *   border         → #E5E7EB  (greyscale approx → [229,231,235])
 *   bg-primary     → #FFFFFF
 *
 * Typography scale (pt, approx from px design tokens):
 *   h2   → 18pt  (24px → print)
 *   h4   → 13pt  (16px → print)
 *   body-md → 11pt
 *   body-sm → 10pt
 *   caption → 8pt
 */

import jsPDF from 'jspdf';

// ─── Design tokens (B&W) ──────────────────────────────────────────────────────
const T = {
    // colours
    black: [13, 13, 15],   // #0D0D0F  text-primary
    grey: [107, 114, 128],  // #6B7280  text-secondary
    lightGrey: [229, 231, 235],  // #E5E7EB  border / divider
    surface: [246, 246, 246],  // #F6F6F6  surface
    white: [255, 255, 255],

    // font sizes (pt)
    h2: 18,
    h4: 13,
    bodyMd: 11,
    bodySm: 10,
    caption: 8,

    // spacing (mm)
    marginX: 16,
    marginTop: 14,
    lineH: 6,    // base line height
    sectionGap: 10,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Returns usable page width (A4 = 210mm) */
const pageW = (doc) => doc.internal.pageSize.getWidth() - T.marginX * 2;

/** Set fill + draw colour from [r,g,b] */
const setFill = (doc, rgb) => doc.setFillColor(...rgb);
const setDraw = (doc, rgb) => doc.setDrawColor(...rgb);
const setColor = (doc, rgb) => doc.setTextColor(...rgb);

/** Draw a horizontal rule */
const hRule = (doc, y, { thick = false } = {}) => {
    setDraw(doc, thick ? T.black : T.lightGrey);
    doc.setLineWidth(thick ? 0.5 : 0.2);
    doc.line(T.marginX, y, T.marginX + pageW(doc), y);
    doc.setLineWidth(0.2);
};

/**
 * Draw the standard page header.
 * Returns the Y cursor after the header.
 */
const drawHeader = (doc, title, subtitle = '') => {
    const x = T.marginX;
    let y = T.marginTop;

    // Hospital wordmark
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(T.h4);
    setColor(doc, T.black);
    doc.text('ONE Hospital Management System', x, y);

    y += T.lineH - 1;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(T.caption);
    setColor(doc, T.grey);
    doc.text('Official Medical Document  ·  Confidential', x, y);

    y += 5;
    hRule(doc, y, { thick: true });
    y += 7;

    // Document title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(T.h2);
    setColor(doc, T.black);
    doc.text(title, x, y);

    if (subtitle) {
        y += T.lineH;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(T.bodySm);
        setColor(doc, T.grey);
        doc.text(subtitle, x, y);
    }

    y += 8;
    hRule(doc, y);
    y += 6;

    return y;
};

/**
 * Draw the standard page footer (page number + timestamp).
 */
const drawFooter = (doc) => {
    const pageH = doc.internal.pageSize.getHeight();
    const x = T.marginX;
    const y = pageH - 10;
    const total = doc.internal.getNumberOfPages();

    for (let i = 1; i <= total; i++) {
        doc.setPage(i);
        hRule(doc, y - 4);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(T.caption);
        setColor(doc, T.grey);

        const left = `Generated: ${new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}`;
        const right = `Page ${i} of ${total}`;

        doc.text(left, x, y);
        doc.text(right, T.marginX + pageW(doc), y, { align: 'right' });
    }
};

/**
 * Draw a key-value info block (e.g. patient details).
 * `fields` = [{ label, value }]
 * Renders in a 2-column grid.
 * Returns new Y cursor.
 */
const drawInfoGrid = (doc, fields, y) => {
    const colW = pageW(doc) / 2;
    const x = T.marginX;

    fields.forEach((field, idx) => {
        const col = idx % 2;
        const row = Math.floor(idx / 2);
        const fx = x + col * colW;
        const fy = y + row * (T.lineH * 2 + 2);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(T.caption);
        setColor(doc, T.grey);
        doc.text(field.label.toUpperCase(), fx, fy);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(T.bodySm);
        setColor(doc, T.black);
        doc.text(String(field.value ?? '—'), fx, fy + T.lineH - 1);
    });

    const rows = Math.ceil(fields.length / 2);
    return y + rows * (T.lineH * 2 + 2) + 4;
};

/**
 * Draw a section heading.
 * Returns new Y cursor.
 */
const drawSectionHeading = (doc, text, y) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(T.h4);
    setColor(doc, T.black);
    doc.text(text, T.marginX, y);
    return y + T.lineH + 1;
};

/**
 * Draw a full table.
 * `columns` = [{ header, key, width? }]  — widths in mm; auto-distributes remainder
 * `rows`    = array of objects
 * Returns new Y cursor.
 */
const drawTable = (doc, columns, rows, startY) => {
    const x = T.marginX;
    const totalW = pageW(doc);
    const pageH = doc.internal.pageSize.getHeight();
    const rowH = 8;
    const headerH = 9;

    // Resolve column widths
    const fixedTotal = columns.reduce((s, c) => s + (c.width || 0), 0);
    const flexCount = columns.filter((c) => !c.width).length;
    const flexW = flexCount > 0 ? (totalW - fixedTotal) / flexCount : 0;
    const widths = columns.map((c) => c.width || flexW);

    let y = startY;

    const drawHeaderRow = () => {
        setFill(doc, T.black);
        setDraw(doc, T.black);
        doc.rect(x, y, totalW, headerH, 'F');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(T.caption);
        setColor(doc, T.white);

        let cx = x;
        columns.forEach((col, i) => {
            doc.text(col.header.toUpperCase(), cx + 3, y + 6);
            cx += widths[i];
        });
        y += headerH;
    };

    drawHeaderRow();

    rows.forEach((row, rowIdx) => {
        // Page break
        if (y + rowH > pageH - 18) {
            doc.addPage();
            y = T.marginTop;
            drawHeaderRow();
        }

        // Alternating row background
        if (rowIdx % 2 === 1) {
            setFill(doc, T.surface);
            setDraw(doc, T.surface);
            doc.rect(x, y, totalW, rowH, 'F');
        }

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(T.bodySm);
        setColor(doc, T.black);

        let cx = x;
        columns.forEach((col, i) => {
            const raw = col.key ? row[col.key] : '';
            const text = col.render ? col.render(raw, row) : String(raw ?? '—');
            // Clip text to column width
            const clipped = doc.splitTextToSize(text, widths[i] - 5);
            doc.text(clipped[0] || '', cx + 3, y + 5.5);
            cx += widths[i];
        });

        // Row bottom border
        setDraw(doc, T.lightGrey);
        doc.setLineWidth(0.1);
        doc.line(x, y + rowH, x + totalW, y + rowH);

        y += rowH;
    });

    return y + 4;
};

/**
 * Draw a totals block (label / value pairs aligned right).
 * `lines` = [{ label, value, bold? }]
 * Returns new Y cursor.
 */
const drawTotals = (doc, lines, y) => {
    const right = T.marginX + pageW(doc);

    lines.forEach((line) => {
        doc.setFont('helvetica', line.bold ? 'bold' : 'normal');
        doc.setFontSize(line.bold ? T.bodyMd : T.bodySm);

        setColor(doc, line.bold ? T.black : T.grey);
        doc.text(line.label, right - 60, y);

        setColor(doc, T.black);
        doc.text(String(line.value), right, y, { align: 'right' });

        y += T.lineH + (line.bold ? 1 : 0);
    });

    return y + 2;
};

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Generate and download an Invoice PDF for a single bill.
 */
export const downloadBillPdf = (bill, patientName = 'Patient') => {
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    const id = bill._id || bill.id || 'N/A';
    const date = new Date(bill.billingDate || bill.createdAt).toLocaleDateString('en-US', { dateStyle: 'long' });

    let y = drawHeader(doc, 'Invoice / Billing Statement', `Statement ID: ${id}`);

    // Patient & billing info
    y = drawInfoGrid(doc, [
        { label: 'Patient Name', value: patientName },
        { label: 'Billing Date', value: date },
        { label: 'Payment Method', value: bill.paymentMethod || 'Pending' },
        { label: 'Status', value: bill.status },
    ], y);

    y += 2;
    hRule(doc, y);
    y += 8;

    // Items table
    y = drawSectionHeading(doc, 'Itemised Charges', y);
    y += 2;

    y = drawTable(doc, [
        { header: 'Description', key: 'description' },
        { header: 'Amount', key: 'amount', width: 36, render: (v) => `$${Number(v).toFixed(2)}` },
    ], bill.items || [], y);

    y += 2;

    // Totals
    const totalsLines = [
        { label: 'Subtotal', value: `$${Number(bill.subTotal).toFixed(2)}` },
    ];
    if (bill.discount > 0) totalsLines.push({ label: 'Discount', value: `-$${Number(bill.discount).toFixed(2)}` });
    if (bill.tax > 0) totalsLines.push({ label: 'Tax', value: `+$${Number(bill.tax).toFixed(2)}` });
    totalsLines.push({ label: 'Total Amount Due', value: `$${Number(bill.grandTotal).toFixed(2)}`, bold: true });

    drawTotals(doc, totalsLines, y);
    drawFooter(doc);

    doc.save(`invoice-${id}.pdf`);
};

/**
 * Generate and download a Prescription PDF for a single prescription.
 */
export const downloadPrescriptionPdf = (prescription, patientName = 'Patient') => {
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    const id = prescription._id || prescription.id || 'N/A';
    const date = new Date(prescription.date || prescription.createdAt).toLocaleDateString('en-US', { dateStyle: 'long' });
    const doctor = prescription.doctorId?.name || prescription.doctorName || '—';

    let y = drawHeader(doc, 'Electronic Prescription', `Reference: ${id}`);

    y = drawInfoGrid(doc, [
        { label: 'Patient Name', value: patientName },
        { label: 'Date Issued', value: date },
        { label: 'Prescribing Physician', value: doctor },
        { label: 'Status', value: prescription.status },
        { label: 'Diagnosis', value: prescription.diagnosis },
    ], y);

    y += 2;
    hRule(doc, y);
    y += 8;

    // Medicines table
    y = drawSectionHeading(doc, 'Prescribed Medications', y);
    y += 2;

    const medRows = (prescription.medicines || []).map((m) => ({
        name: m.medicineId?.name || m.name || '—',
        dosage: m.dosage || '—',
        duration: m.duration || '—',
        instructions: m.instructions || '—',
    }));

    y = drawTable(doc, [
        { header: 'Medicine', key: 'name' },
        { header: 'Dosage', key: 'dosage', width: 28 },
        { header: 'Duration', key: 'duration', width: 28 },
        { header: 'Instructions', key: 'instructions', width: 56 },
    ], medRows, y);

    if (prescription.notes) {
        y += 4;
        y = drawSectionHeading(doc, 'Clinical Notes', y);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(T.bodySm);
        setColor(doc, T.grey);
        const wrapped = doc.splitTextToSize(prescription.notes, pageW(doc));
        doc.text(wrapped, T.marginX, y);
        y += wrapped.length * T.lineH;
    }

    drawFooter(doc);
    doc.save(`prescription-${id}.pdf`);
};

/**
 * Generate and download a Lab Report PDF for a single lab test.
 */
export const downloadLabReportPdf = (test, patientName = 'Patient') => {
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    const id = test._id || test.id || 'N/A';
    const reqDate = new Date(test.requestDate || test.createdAt).toLocaleDateString('en-US', { dateStyle: 'long' });
    const cmpDate = test.completedDate
        ? new Date(test.completedDate).toLocaleDateString('en-US', { dateStyle: 'long' })
        : 'Pending';
    const doctor = test.doctorId?.name || test.doctorName || '—';

    let y = drawHeader(doc, 'Laboratory Diagnostic Report', `Reference: ${id}`);

    y = drawInfoGrid(doc, [
        { label: 'Patient Name', value: patientName },
        { label: 'Requesting Physician', value: doctor },
        { label: 'Test Name', value: test.testName },
        { label: 'Status', value: test.status },
        { label: 'Date Requested', value: reqDate },
        { label: 'Date Completed', value: cmpDate },
    ], y);

    y += 2;
    hRule(doc, y);
    y += 8;

    // Results section
    y = drawSectionHeading(doc, 'Diagnostic Findings', y);
    y += 2;

    if (test.results) {
        // Box around results
        const boxH = 24;
        setFill(doc, T.surface);
        setDraw(doc, T.lightGrey);
        doc.setLineWidth(0.2);
        doc.roundedRect(T.marginX, y, pageW(doc), boxH, 2, 2, 'FD');

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(T.bodyMd);
        setColor(doc, T.black);
        const wrapped = doc.splitTextToSize(test.results, pageW(doc) - 8);
        doc.text(wrapped, T.marginX + 4, y + 7);
        y += boxH + 6;
    } else {
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(T.bodySm);
        setColor(doc, T.grey);
        doc.text('Results are pending analysis. Please check back later.', T.marginX, y + 6);
        y += 16;
    }

    // Disclaimer
    y += 4;
    hRule(doc, y);
    y += 6;
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(T.caption);
    setColor(doc, T.grey);
    const disclaimer = 'This report is generated electronically and is valid without a physical signature. For clinical use only. Consult your physician for interpretation.';
    const dWrapped = doc.splitTextToSize(disclaimer, pageW(doc));
    doc.text(dWrapped, T.marginX, y);

    drawFooter(doc);
    doc.save(`lab-report-${id}.pdf`);
};
