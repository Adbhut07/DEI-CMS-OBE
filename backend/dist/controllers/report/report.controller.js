"use strict";
// import { Request, Response } from 'express';
// import { PrismaClient } from '@prisma/client';
// import PDFDocument from 'pdfkit';
// const prisma = new PrismaClient();
// export const generatePOReport = async (req: Request, res: Response): Promise<any> => {
//   try {
//     const { courseId, batchId } = req.params;
//     if (!courseId || !batchId) {
//       return res.status(400).json({ error: 'Course ID and Batch ID are required' });
//     }
//     // Fetch all the required data
//     const course = await prisma.course.findUnique({
//       where: { id: parseInt(courseId) },
//       include: {
//         createdBy: true,
//         batches: {
//           where: { id: parseInt(batchId) },
//           include: {
//             coAttainments: {
//               include: {
//                 co: true,
//                 subject: true
//               }
//             },
//             poAttainments: {
//               include: {
//                 po: true
//               }
//             }
//           }
//         },
//         programOutcomes: {
//           where: { batchId: parseInt(batchId) },
//           include: {
//             coMappings: {
//               include: {
//                 courseOutcome: true
//               }
//             }
//           }
//         },
//         subjects: {
//           where: { batchId: parseInt(batchId) },
//           include: {
//             subject: true,
//             faculty: true
//           }
//         }
//       }
//     });
//     if (!course) {
//       return res.status(404).json({ error: 'Course not found' });
//     }
//     if (course.batches.length === 0) {
//       return res.status(404).json({ error: 'Batch not found for this course' });
//     }
//     const batch = course.batches[0];
//     // Create a PDF document
//     const doc = new PDFDocument({ 
//       size: 'A4',
//       margins: {
//         top: 50,
//         bottom: 50,
//         left: 50,
//         right: 50
//       },
//       info: {
//         Title: `PO Attainment Report - ${course.courseName} (Batch ${batch.batchYear})`,
//         Author: 'OBE System',
//         Subject: 'Program Outcome Attainment',
//       }
//     });
//     // Set response headers for PDF download
//     res.setHeader('Content-Type', 'application/pdf');
//     res.setHeader('Content-Disposition', `attachment; filename=PO_Report_${courseId}_${batchId}.pdf`);
//     // Pipe the PDF directly to the response
//     doc.pipe(res);
//     // Generate the PDF content using our helper function
//     await generatePDFContent(doc, course, batch);
//     // Finalize the PDF and end the stream
//     doc.end();
//   } catch (error) {
//     console.error('Error generating PO report:', error);
//     res.status(500).json({ error: 'Failed to generate report' });
//   }
// };
// async function generatePDFContent(doc: PDFKit.PDFDocument, course: any, batch: any) {
//   // REPORT HEADER
//   addHeader(doc, course, batch);
//   // COURSE DETAILS
//   addCourseDetails(doc, course, batch);
//   // CO-PO MAPPING MATRIX
//   addCOPOMapping(doc, course, batch);
//   // CO ATTAINMENT DETAILS
//   addCOAttainmentDetails(doc, batch);
//   // PO ATTAINMENT DETAILS
//   addPOAttainmentDetails(doc, batch);
//   // CONCLUSION
//   addConclusion(doc, batch);
// }
// // Helper functions to organize the PDF content
// function addHeader(doc: PDFKit.PDFDocument, course: any, batch: any) {
//   doc.fontSize(16).font('Helvetica-Bold').text('PROGRAM OUTCOME ATTAINMENT REPORT', { align: 'center' });
//   doc.moveDown();
//   doc.fontSize(14).text(`${course.courseName} - Batch ${batch.batchYear}`, { align: 'center' });
//   doc.moveDown(2);
// }
// function addCourseDetails(doc: PDFKit.PDFDocument, course: any, batch: any) {
//   doc.fontSize(12).font('Helvetica-Bold').text('1. COURSE DETAILS', { underline: true });
//   doc.moveDown();
//   doc.font('Helvetica');
//   doc.fontSize(10);
//   const courseData = [
//     { label: 'Course Name', value: course.courseName },
//     { label: 'Batch Year', value: batch.batchYear },
//     { label: 'Created By', value: course.createdBy.name },
//     { label: 'Subjects', value: course.subjects.length }
//   ];
//   let y = doc.y;
//   courseData.forEach(item => {
//     doc.font('Helvetica-Bold').text(`${item.label}:`, { continued: true });
//     doc.font('Helvetica').text(` ${item.value}`);
//   });
//   doc.moveDown();
//   // Subject Table
//   doc.font('Helvetica-Bold').text('Subjects in this Course:');
//   doc.moveDown(0.5);
//   // Table header
//   const startX = 50;
//   let currentY = doc.y;
//   const colWidths = [40, 200, 100, 150];
//   doc.rect(startX, currentY, 490, 20).stroke();
//   doc.font('Helvetica-Bold').fontSize(9);
//   doc.text('S.No', startX + 5, currentY + 5, { width: colWidths[0] });
//   doc.text('Subject Name', startX + colWidths[0] + 5, currentY + 5, { width: colWidths[1] });
//   doc.text('Subject Code', startX + colWidths[0] + colWidths[1] + 5, currentY + 5, { width: colWidths[2] });
//   doc.text('Faculty Assigned', startX + colWidths[0] + colWidths[1] + colWidths[2] + 5, currentY + 5, { width: colWidths[3] });
//   currentY += 20;
//   // Table rows
//   doc.font('Helvetica').fontSize(9);
//   course.subjects.forEach((subject: any, index: number) => {
//     // Check if we need a new page
//     if (currentY > doc.page.height - 50) {
//       doc.addPage();
//       currentY = 50;
//     }
//     doc.rect(startX, currentY, 490, 20).stroke();
//     doc.text((index + 1).toString(), startX + 5, currentY + 5, { width: colWidths[0] });
//     doc.text(subject.subject.subjectName, startX + colWidths[0] + 5, currentY + 5, { width: colWidths[1] });
//     doc.text(subject.subject.subjectCode, startX + colWidths[0] + colWidths[1] + 5, currentY + 5, { width: colWidths[2] });
//     doc.text(subject.faculty ? subject.faculty.name : 'Not Assigned', startX + colWidths[0] + colWidths[1] + colWidths[2] + 5, currentY + 5, { width: colWidths[3] });
//     currentY += 20;
//   });
//   doc.moveDown(2);
// }
// function addCOPOMapping(doc: PDFKit.PDFDocument, course: any, batch: any) {
//   // Check if we need a new page
//   if (doc.y > doc.page.height - 200) {
//     doc.addPage();
//   }
//   doc.fontSize(12).font('Helvetica-Bold').text('2. CO-PO MAPPING MATRIX', { underline: true });
//   doc.moveDown();
//   // Get all unique COs and POs
//   const allUnits: any[] = [];
//   const poMap: Map<number, any> = new Map();
//   // Collect all program outcomes
//   course.programOutcomes.forEach((po: any) => {
//     poMap.set(po.id, po);
//   });
//   // Collect all course outcomes (units)
//   batch.coAttainments.forEach((coAttainment: any) => {
//     if (!allUnits.some(unit => unit.id === coAttainment.co.id)) {
//       allUnits.push(coAttainment.co);
//     }
//   });
//   // Sort units and POs by their numbers
//   allUnits.sort((a, b) => a.unitNumber - b.unitNumber);
//   const allPOs = Array.from(poMap.values());
//   // Create the mapping matrix
//   doc.font('Helvetica').fontSize(9);
//   const startX = 50;
//   let currentY = doc.y;
//   const headerWidth = 150;
//   const cellWidth = 30;
//   const cellHeight = 20;
//   // Matrix header
//   doc.rect(startX, currentY, headerWidth, cellHeight).stroke();
//   doc.font('Helvetica-Bold').text('Course Outcomes (COs)', startX + 5, currentY + 5, { width: headerWidth - 10 });
//   // PO headers
//   for (let i = 0; i < allPOs.length; i++) {
//     doc.rect(startX + headerWidth + i * cellWidth, currentY, cellWidth, cellHeight).stroke();
//     doc.text(`PO${i + 1}`, startX + headerWidth + i * cellWidth + 5, currentY + 5, { width: cellWidth - 10, align: 'center' });
//   }
//   currentY += cellHeight;
//   // Matrix rows
//   for (let i = 0; i < allUnits.length; i++) {
//     // Check if we need a new page
//     if (currentY > doc.page.height - 50) {
//       doc.addPage();
//       currentY = 50;
//       // Redraw the header on the new page
//       doc.rect(startX, currentY, headerWidth, cellHeight).stroke();
//       doc.font('Helvetica-Bold').text('Course Outcomes (COs)', startX + 5, currentY + 5, { width: headerWidth - 10 });
//       for (let j = 0; j < allPOs.length; j++) {
//         doc.rect(startX + headerWidth + j * cellWidth, currentY, cellWidth, cellHeight).stroke();
//         doc.text(`PO${j + 1}`, startX + headerWidth + j * cellWidth + 5, currentY + 5, { width: cellWidth - 10, align: 'center' });
//       }
//       currentY += cellHeight;
//     }
//     const unit = allUnits[i];
//     // Row header
//     doc.rect(startX, currentY, headerWidth, cellHeight).stroke();
//     doc.font('Helvetica').text(`CO${unit.unitNumber}: ${unit.description || 'Unit ' + unit.unitNumber}`, startX + 5, currentY + 5, { width: headerWidth - 10 });
//     // Find the mappings for this CO
//     const mappings = course.programOutcomes
//       .flatMap((po: any) => po.coMappings)
//       .filter((mapping: any) => mapping.courseOutcome.id === unit.id);
//     // Create a mapping of PO ID to weightage
//     const poWeightages = new Map();
//     mappings.forEach((mapping: any) => {
//       poWeightages.set(mapping.poId, mapping.weightage);
//     });
//     // Fill in the mapping cells
//     for (let j = 0; j < allPOs.length; j++) {
//       const po = allPOs[j];
//       const weightage = poWeightages.get(po.id) || 0;
//       doc.rect(startX + headerWidth + j * cellWidth, currentY, cellWidth, cellHeight).stroke();
//       doc.text(weightage.toString(), startX + headerWidth + j * cellWidth + 5, currentY + 5, { width: cellWidth - 10, align: 'center' });
//     }
//     currentY += cellHeight;
//   }
//   doc.moveDown(2);
// }
// function addCOAttainmentDetails(doc: PDFKit.PDFDocument, batch: any) {
//   // Check if we need a new page
//   if (doc.y > doc.page.height - 200) {
//     doc.addPage();
//   }
//   doc.fontSize(12).font('Helvetica-Bold').text('3. COURSE OUTCOME ATTAINMENT', { underline: true });
//   doc.moveDown();
//   // Group CO attainments by subject
//   const subjectMap = new Map();
//   batch.coAttainments.forEach((attainment: any) => {
//     if (!subjectMap.has(attainment.subject.id)) {
//       subjectMap.set(attainment.subject.id, {
//         subject: attainment.subject,
//         attainments: []
//       });
//     }
//     subjectMap.get(attainment.subject.id).attainments.push(attainment);
//   });
//   // Display CO attainments by subject
//   const subjects = Array.from(subjectMap.values());
//   subjects.forEach((subjectData: any, index: number) => {
//     // Check if we need a new page
//     if (doc.y > doc.page.height - 100) {
//       doc.addPage();
//     }
//     const subject = subjectData.subject;
//     doc.font('Helvetica-Bold').fontSize(10).text(`3.${index + 1} ${subject.subjectName} (${subject.subjectCode})`);
//     doc.moveDown(0.5);
//     // Create a table for CO attainments
//     const startX = 50;
//     let currentY = doc.y;
//     const colWidths = [40, 250, 150];
//     // Table header
//     doc.rect(startX, currentY, colWidths[0] + colWidths[1] + colWidths[2], 20).stroke();
//     doc.font('Helvetica-Bold').fontSize(9);
//     doc.text('CO #', startX + 5, currentY + 5, { width: colWidths[0] });
//     doc.text('Course Outcome Description', startX + colWidths[0] + 5, currentY + 5, { width: colWidths[1] });
//     doc.text('Attainment Level', startX + colWidths[0] + colWidths[1] + 5, currentY + 5, { width: colWidths[2] });
//     currentY += 20;
//     // Sort attainments by CO unit number
//     const sortedAttainments = [...subjectData.attainments].sort((a, b) => a.co.unitNumber - b.co.unitNumber);
//     // Table rows
//     doc.font('Helvetica').fontSize(9);
//     sortedAttainments.forEach((attainment: any) => {
//       // Check if we need a new page
//       if (currentY > doc.page.height - 50) {
//         doc.addPage();
//         currentY = 50;
//       }
//       doc.rect(startX, currentY, colWidths[0] + colWidths[1] + colWidths[2], 20).stroke();
//       doc.text(`CO${attainment.co.unitNumber}`, startX + 5, currentY + 5, { width: colWidths[0] });
//       doc.text(attainment.co.description || `Unit ${attainment.co.unitNumber}`, startX + colWidths[0] + 5, currentY + 5, { width: colWidths[1] });
//       doc.text(attainment.attainment.toFixed(2), startX + colWidths[0] + colWidths[1] + 5, currentY + 5, { width: colWidths[2] });
//       currentY += 20;
//     });
//     // Calculate and display average CO attainment for this subject
//     const avgAttainment = sortedAttainments.reduce((sum, att) => sum + att.attainment, 0) / sortedAttainments.length;
//     doc.rect(startX, currentY, colWidths[0] + colWidths[1], 20).stroke();
//     doc.rect(startX + colWidths[0] + colWidths[1], currentY, colWidths[2], 20).stroke();
//     doc.font('Helvetica-Bold').text('Average CO Attainment', startX + 5, currentY + 5, { width: colWidths[0] + colWidths[1] - 10 });
//     doc.text(avgAttainment.toFixed(2), startX + colWidths[0] + colWidths[1] + 5, currentY + 5, { width: colWidths[2] });
//     currentY += 30;
//     doc.y = currentY;
//   });
//   doc.moveDown(2);
// }
// function addPOAttainmentDetails(doc: PDFKit.PDFDocument, batch: any) {
//   // Check if we need a new page
//   if (doc.y > doc.page.height - 200) {
//     doc.addPage();
//   }
//   doc.fontSize(12).font('Helvetica-Bold').text('4. PROGRAM OUTCOME ATTAINMENT', { underline: true });
//   doc.moveDown();
//   // Sort PO attainments by PO ID
//   const sortedPOAttainments = [...batch.poAttainments].sort((a, b) => {
//     // Extract PO number from description if available, otherwise use ID
//     const getPoNumber = (po: any) => {
//       if (po.po.description) {
//         const match = po.po.description.match(/^PO(\d+)/);
//         return match ? parseInt(match[1]) : po.po.id;
//       }
//       return po.po.id;
//     };
//     return getPoNumber(a) - getPoNumber(b);
//   });
//   // Create a table for PO attainments
//   const startX = 50;
//   let currentY = doc.y;
//   const colWidths = [40, 250, 150];
//   // Table header
//   doc.rect(startX, currentY, colWidths[0] + colWidths[1] + colWidths[2], 20).stroke();
//   doc.font('Helvetica-Bold').fontSize(9);
//   doc.text('PO #', startX + 5, currentY + 5, { width: colWidths[0] });
//   doc.text('Program Outcome Description', startX + colWidths[0] + 5, currentY + 5, { width: colWidths[1] });
//   doc.text('Attainment Level', startX + colWidths[0] + colWidths[1] + 5, currentY + 5, { width: colWidths[2] });
//   currentY += 20;
//   // Table rows
//   doc.font('Helvetica').fontSize(9);
//   sortedPOAttainments.forEach((attainment: any, index: number) => {
//     // Check if we need a new page
//     if (currentY > doc.page.height - 50) {
//       doc.addPage();
//       currentY = 50;
//     }
//     doc.rect(startX, currentY, colWidths[0] + colWidths[1] + colWidths[2], 20).stroke();
//     doc.text(`PO${index + 1}`, startX + 5, currentY + 5, { width: colWidths[0] });
//     doc.text(attainment.po.description || `Program Outcome ${index + 1}`, startX + colWidths[0] + 5, currentY + 5, { width: colWidths[1] });
//     doc.text(attainment.attainment.toFixed(2), startX + colWidths[0] + colWidths[1] + 5, currentY + 5, { width: colWidths[2] });
//     currentY += 20;
//   });
//   // Calculate and display average PO attainment
//   const avgAttainment = sortedPOAttainments.reduce((sum, att) => sum + att.attainment, 0) / sortedPOAttainments.length;
//   doc.rect(startX, currentY, colWidths[0] + colWidths[1], 20).stroke();
//   doc.rect(startX + colWidths[0] + colWidths[1], currentY, colWidths[2], 20).stroke();
//   doc.font('Helvetica-Bold').text('Average PO Attainment', startX + 5, currentY + 5, { width: colWidths[0] + colWidths[1] - 10 });
//   doc.text(avgAttainment.toFixed(2), startX + colWidths[0] + colWidths[1] + 5, currentY + 5, { width: colWidths[2] });
//   // Add attainment visualization (bar chart)
//   doc.moveDown(3);
//   // Simple text representation of a bar chart
//   doc.fontSize(10).font('Helvetica-Bold').text('PO Attainment Visualization:', { underline: true });
//   doc.moveDown();
//   const maxWidth = 400;
//   sortedPOAttainments.forEach((attainment: any, index: number) => {
//     // Check if we need a new page
//     if (doc.y > doc.page.height - 30) {
//       doc.addPage();
//     }
//     const barWidth = (attainment.attainment / 5) * maxWidth; // Assuming max attainment is 5
//     doc.font('Helvetica').fontSize(9).text(`PO${index + 1}: `, { continued: true });
//     doc.rect(doc.x, doc.y - 9, barWidth, 10).fill('#007acc');
//     doc.text(`  ${attainment.attainment.toFixed(2)}`, doc.x + barWidth + 5, doc.y - 9);
//   });
//   doc.moveDown(2);
// }
// function addConclusion(doc: PDFKit.PDFDocument, batch: any) {
//   // Check if we need a new page
//   if (doc.y > doc.page.height - 150) {
//     doc.addPage();
//   }
//   doc.fontSize(12).font('Helvetica-Bold').text('5. CONCLUSION AND RECOMMENDATIONS', { underline: true });
//   doc.moveDown();
//   // Calculate overall PO attainment
//   const avgPOAttainment = batch.poAttainments.reduce((sum: number, att: any) => sum + att.attainment, 0) / batch.poAttainments.length;
//   doc.fontSize(10).font('Helvetica');
//   doc.text(`The overall Program Outcome attainment for this batch is ${avgPOAttainment.toFixed(2)} out of 5.0.`);
//   doc.moveDown();
//   // Provide recommendations based on attainment level
//   let recommendation = '';
//   if (avgPOAttainment >= 4) {
//     recommendation = 'The program is performing excellently. Continue with the current teaching and assessment methods while looking for opportunities to further enhance student learning experiences.';
//   } else if (avgPOAttainment >= 3) {
//     recommendation = 'The program is performing well. Consider focusing on specific POs with lower attainment levels to improve overall program effectiveness.';
//   } else if (avgPOAttainment >= 2) {
//     recommendation = 'The program needs improvement in several areas. Review the teaching and assessment methods for POs with lower attainment levels and implement remedial measures.';
//   } else {
//     recommendation = 'The program requires significant improvement. Conduct a comprehensive review of the curriculum, teaching methodologies, and assessment strategies to address the gaps in student learning outcomes.';
//   }
//   doc.text('Recommendations:');
//   doc.moveDown(0.5);
//   doc.text(recommendation);
//   // Add signature section
//   doc.moveDown(3);
//   doc.fontSize(10);
//   const signatureY = doc.y;
//   // First signature (left)
//   doc.text('_______________________', 50, signatureY);
//   doc.text('Faculty In-charge', 70, signatureY + 20);
//   // Second signature (center)
//   doc.text('_______________________', 200, signatureY);
//   doc.text('Head of Department', 220, signatureY + 20);
//   // Third signature (right)
//   doc.text('_______________________', 350, signatureY);
//   doc.text('Dean/Principal', 380, signatureY + 20);
//   // Add footer with date
//   doc.fontSize(8).text(`Report Generated on: ${new Date().toLocaleDateString()}`, 50, doc.page.height - 50);
//   doc.text('Page ' + doc.pageNumber, 500, doc.page.height - 50, { align: 'right' });
// }
