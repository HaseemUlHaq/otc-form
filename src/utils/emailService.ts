import { createClient } from '@supabase/supabase-js';
import { config } from "../config";
import type { OTCFormData } from "../types/form";

// Create Supabase client
const supabase = createClient(config.supabaseUrl, config.supabaseAnonKey);

export async function sendEmail(
  formData: OTCFormData,
  pdfBlob: Blob
): Promise<void> {
  const today = new Date();
  const dateStr = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`;
  const dateStrFormatted = dateStr.replace(/\//g, "");

  const pharmacyEmail =
    Object.keys(config.pharmacyEmails).find(
      (email) =>
        config.pharmacyEmails[email as keyof typeof config.pharmacyEmails] ===
        formData.pharmacy
    ) || "perrishills.otcform@gmail.com";

  const pdfFileName = `OTC_Request_${formData.patientFirstName}_${formData.patientLastName}_${dateStrFormatted}.pdf`;

  // Convert PDF to base64
  const reader = new FileReader();
  const base64Promise = new Promise<string>((resolve, reject) => {
    reader.onloadend = () => {
      const base64data = reader.result as string;
      resolve(base64data.split(",")[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(pdfBlob);
  });

  const base64Pdf = await base64Promise;

  try {
    console.log('Sending email to:', pharmacyEmail);

    const { data, error } = await supabase.functions.invoke('send-email', {
      body: {
        to_email: pharmacyEmail,
        patient_name: `${formData.patientFirstName} ${formData.patientLastName}`,
        date: dateStr,
        message: `Hi Pharmacy Team,\n\nA new OTC Request Form has been submitted for ${formData.patientFirstName} ${formData.patientLastName}.\n\nPlease see the attached PDF and print it for faxing or patient handoff.\n\nThank you!\n\n—\nThis is an automated message from the OTC Request System.`,
        pdf_base64: base64Pdf,
        pdf_filename: pdfFileName,
      },
    });

    if (error) {
      console.error('Supabase function error:', error);
      throw error;
    }

    console.log('Email sent successfully with attachment!', data);
  } catch (error) {
    console.error('Email sending error:', error);
    
    // Fallback: Auto-download PDF
    const downloadUrl = URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = pdfFileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(downloadUrl);
    
    throw new Error('Failed to send email. PDF has been downloaded instead.');
  }
}