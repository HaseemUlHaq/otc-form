import jsPDF from 'jspdf';
import type { OTCFormData } from '../types/form';

export function downloadRequestPDF(formData: OTCFormData, pharmacyName: string): void {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  let yPos = margin;

  const formatDOB = (dateStr: string) => {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[1]}/${parts[2]}/${parts[0]}`;
    }
    return dateStr;
  };

  const addText = (text: string, fontSize: number = 12, isBold: boolean = false, x: number = margin) => {
    doc.setFontSize(fontSize);
    doc.setFont('helvetica', isBold ? 'bold' : 'normal');
    const lines = doc.splitTextToSize(text, pageWidth - 2 * margin);
    lines.forEach((line: string) => {
      if (yPos > doc.internal.pageSize.getHeight() - margin) {
        doc.addPage();
        yPos = margin;
      }
      doc.text(line, x, yPos);
      yPos += fontSize * 0.5;
    });
    yPos += 5;
  };

  // Date stamp
  const today = new Date();
  const dateStr = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`;
  addText(`Date: ${dateStr}`, 10, false, pageWidth - margin - 30);
  yPos = margin + 10;
  addText('DEMO ONLY - NOT FOR CLINICAL USE', 12, true);

  // Greeting
  addText(`Dear ${formData.primaryCarePhysician},`, 12, false);
  yPos += 5;

  if (formData.pdfType === 'A') {
    // PDF A - Pharmacy-Initiated
    addText(
      `Your patient, ${formData.patientFirstName} ${formData.patientLastName}, born ${formatDOB(formData.dateOfBirth)}, visited our pharmacy today and reported that they currently purchase the following over-the-counter (OTC) medications out of pocket.`,
      12,
      false
    );
    yPos += 5;
    addText(
      'To help ensure they receive Medi-Cal coverage, please review the list and send prescriptions for the items you deem appropriate.',
      12,
      false
    );
    yPos += 10;
    addText('OTC MEDICATIONS THE PATIENT IS REQUESTING COVERAGE FOR', 12, true);
    yPos += 5;
  } else {
    // PDF B - Patient-Initiated
    addText(
      `My name is ${formData.patientFirstName} ${formData.patientLastName}, and I was born on ${formatDOB(formData.dateOfBirth)}. I recently visited ${pharmacyName}, where I shared that I currently purchase the following over-the-counter (OTC) medications out of pocket.`,
      12,
      false
    );
    yPos += 5;
    addText(
      'To help me receive Medi-Cal coverage for these items, I kindly request that you consider sending prescriptions for the ones you feel are medically appropriate.',
      12,
      false
    );
    yPos += 10;
    addText('OTC MEDICATIONS I AM REQUESTING COVERAGE FOR', 12, true);
    yPos += 5;
  }

  // Collect all medications
  const allMedications: Array<{
    name: string;
    strength?: string;
    form?: string;
    other?: string;
    quantity?: string;
    notes?: string;
  }> = [];

  Object.values(formData.categories).forEach((categoryData) => {
    categoryData.selectedMedications.forEach((med) => {
      // For "Add Other" medications, use "Other" as the name if the name is empty or is the default placeholder
      const medicationName = med.medicationName === 'Other (Please Specify)' || !med.medicationName 
        ? 'Other' 
        : med.medicationName;
      
      allMedications.push({
        name: medicationName,
        strength: med.strength,
        form: med.form,
        other: med.other,
        quantity: med.quantity,
        notes: med.notes,
      });
    });
  });

  // List medications
  allMedications.forEach((med, index) => {
    if (yPos > doc.internal.pageSize.getHeight() - 40) {
      doc.addPage();
      yPos = margin;
    }
    addText(`Medication ${index + 1}`, 12, true);
    addText(`Name: ${med.name}`, 11, false);
    if (med.strength) addText(`Strength: ${med.strength}`, 11, false);
    if (med.form) addText(`Form: ${med.form}`, 11, false);
    if (med.other) addText(`Other: ${med.other}`, 11, false);
    if (med.quantity) addText(`Quantity: ${med.quantity}`, 11, false);
    if (med.notes) addText(`Description: ${med.notes}`, 11, false);
    if (index < allMedications.length - 1) {
      addText('----------------------------------------------------------------------', 10, false);
    }
  });

  yPos += 10;

  // Closing
  if (formData.pdfType === 'A') {
    addText('Thank you for working with us to help ensure your patient receives the support they need.', 12, false);
  } else {
    addText('Thank you for helping me stay on the path to better health.', 12, false);
    yPos += 5;
    addText('Sincerely,', 12, false);
    addText(`${formData.patientFirstName} ${formData.patientLastName}`, 12, false);
  }

  yPos += 10;

  addText(pharmacyName, 12, true);
  doc.save(`otc-demo-request-${formData.pdfType.toLowerCase()}.pdf`);
}
