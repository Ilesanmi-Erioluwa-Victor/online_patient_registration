import PDFDocument from 'pdfkit';

const streamPdf = (res, filename, render) => {
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  const doc = new PDFDocument({ margin: 50 });
  doc.pipe(res);
  render(doc);
  doc.end();
};

export const patientSummaryPdf = (res, patient) =>
  streamPdf(res, `${patient.patientID}-summary.pdf`, (doc) => {
    doc.fontSize(18).text('Patient Summary Card').moveDown();
    doc.fontSize(11);
    [
      ['Patient ID', patient.patientID],
      ['Name', `${patient.firstName} ${patient.lastName}`],
      ['DOB', patient.dateOfBirth?.toLocaleDateString('en-GB')],
      ['Gender', patient.gender],
      ['Blood Group', patient.bloodGroup || 'N/A'],
      ['Phone', patient.phone],
      ['Emergency Contact', `${patient.nextOfKin?.name || 'N/A'} ${patient.nextOfKin?.phone || ''}`],
      ['Allergies', patient.allergies?.join(', ') || 'None']
    ].forEach(([label, value]) => doc.text(`${label}: ${value}`));
  });

export const reportPdf = (res, title, rows) =>
  streamPdf(res, `${title.toLowerCase().replaceAll(' ', '-')}.pdf`, (doc) => {
    doc.fontSize(18).text(title).fontSize(10).text(`Generated: ${new Date().toLocaleString('en-GB')}`).moveDown();
    rows.forEach((row) => doc.text(row));
  });
