
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

/**
 * Generates a PDF from a given HTML element and triggers a download
 * @param elementId The ID of the element to convert to PDF
 * @param filename The name for the downloaded file (without extension)
 */
export const generateAndDownloadPDF = async (elementId: string, filename: string = 'quotation') => {
  const element = document.getElementById(elementId);
  
  if (!element) {
    console.error(`Element with ID ${elementId} not found`);
    return;
  }
  
  try {
    // Create canvas from the element
    const canvas = await html2canvas(element, {
      scale: 1.5, // Higher scale for better quality
      useCORS: true,
      logging: false
    });
    
    // Calculate dimensions to maintain aspect ratio
    const imgWidth = 210; // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    // Create PDF document (A4 format)
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgData = canvas.toDataURL('image/png');
    
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    
    // Download the PDF
    pdf.save(`${filename}.pdf`);
  } catch (error) {
    console.error('Error generating PDF:', error);
  }
};
