import jsPDF from 'jspdf';
import QRCode from 'qrcode';
import { Table } from '@/types/models';

export const generateQRCodesPDF = async (tables: Table[], locationName: string) => {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // A4 dimensions: 210 x 297 mm
  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 20;
  const qrSize = 50; // Size of QR code in mm
  const cellWidth = (pageWidth - 2 * margin) / 2; // 2 columns
  const cellHeight = (pageHeight - 2 * margin - 30) / 3; // 3 rows, -30 for title space
  
  // Title
  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.text(`QR Codes - ${locationName}`, pageWidth / 2, 20, { align: 'center' });
  
  // Subtitle
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Scan to view menu', pageWidth / 2, 28, { align: 'center' });
  
  // Process up to 6 tables (2x3 grid)
  const tablesToProcess = tables.slice(0, 6);
  
  for (let i = 0; i < tablesToProcess.length; i++) {
    const table = tablesToProcess[i];
    const row = Math.floor(i / 2);
    const col = i % 2;
    
    const x = margin + col * cellWidth;
    const y = margin + 40 + row * cellHeight; // +40 for title space
    
    try {
      // Generate QR code as data URL
      const qrCodeUrl = `${window.location.origin}${table.qrCodeUrl}`;
      const qrCodeDataURL = await QRCode.toDataURL(qrCodeUrl, {
        width: 200,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      
      // Add QR code to PDF
      const qrX = x + (cellWidth - qrSize) / 2;
      const qrY = y + 10;
      pdf.addImage(qrCodeDataURL, 'PNG', qrX, qrY, qrSize, qrSize);
      
      // Add table name below QR code
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      const tableNumber = table.name.replace(/[^0-9]/g, '') || (i + 1).toString();
      pdf.text(`TABLE - ${tableNumber}`, x + cellWidth / 2, qrY + qrSize + 10, { align: 'center' });
      
      // Add location name below table name
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text(locationName, x + cellWidth / 2, qrY + qrSize + 18, { align: 'center' });
      
      // Add a border around each QR code section
      pdf.setDrawColor(200, 200, 200);
      pdf.setLineWidth(0.5);
      pdf.rect(x + 5, y + 5, cellWidth - 10, cellHeight - 10);
      
    } catch (error) {
      console.error('Error generating QR code for table:', table.name, error);
      
      // Add error placeholder
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.text('QR Code Error', x + cellWidth / 2, y + cellHeight / 2, { align: 'center' });
    }
  }
  
  // Add footer
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'italic');
  pdf.text(`Generated on ${new Date().toLocaleDateString('uk-UA')} at ${new Date().toLocaleTimeString('uk-UA')}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
  
  // Save the PDF
  const fileName = `QR_Codes_${locationName.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
  pdf.save(fileName);
};

// Function to generate PDF for a single table (for individual download)
export const generateSingleQRCodePDF = async (table: Table, locationName: string) => {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const qrSize = 80;
  
  try {
    // Generate QR code as data URL
    const qrCodeUrl = `${window.location.origin}${table.qrCodeUrl}`;
    const qrCodeDataURL = await QRCode.toDataURL(qrCodeUrl, {
      width: 300,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
    
    // Center the QR code
    const qrX = (pageWidth - qrSize) / 2;
    const qrY = 80;
    
    // Title
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    pdf.text(locationName, pageWidth / 2, 40, { align: 'center' });
    
    // Add QR code
    pdf.addImage(qrCodeDataURL, 'PNG', qrX, qrY, qrSize, qrSize);
    
    // Table name
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    const tableNumber = table.name.replace(/[^0-9]/g, '') || '1';
    pdf.text(`TABLE - ${tableNumber}`, pageWidth / 2, qrY + qrSize + 20, { align: 'center' });
    
    // Instructions
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Scan this QR code to view our menu', pageWidth / 2, qrY + qrSize + 35, { align: 'center' });
    
    // URL
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'italic');
    pdf.text(qrCodeUrl, pageWidth / 2, qrY + qrSize + 50, { align: 'center' });
    
  } catch (error) {
    console.error('Error generating QR code:', error);
  }
  
  // Save the PDF
  const fileName = `QR_Code_${table.name.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
  pdf.save(fileName);
};

// Function to generate SVG for a single table
export const generateSingleQRCodeSVG = async (table: Table, locationName: string) => {
  try {
    // Generate QR code as SVG string
    const qrCodeUrl = `${window.location.origin}${table.qrCodeUrl}`;
    const qrCodeSVG = await QRCode.toString(qrCodeUrl, {
      type: 'svg',
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
    
    // Create a complete SVG with title
    const tableNumber = table.name.replace(/[^0-9]/g, '') || '1';
    const completeSVG = `
      <svg width="400" height="450" xmlns="http://www.w3.org/2000/svg">
        <!-- Background -->
        <rect width="400" height="450" fill="white"/>
        
        <!-- Location Name -->
        <text x="200" y="30" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="black">
          ${locationName}
        </text>
        
        <!-- QR Code -->
        <g transform="translate(50, 50)">
          ${qrCodeSVG.replace('<svg', '<svg width="300" height="300"').replace('</svg>', '').replace(/^[^>]*>/, '')}
        </g>
        
        <!-- Table Name -->
        <text x="200" y="380" text-anchor="middle" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="black">
          TABLE - ${tableNumber}
        </text>
        
        <!-- Instructions -->
        <text x="200" y="405" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="black">
          Scan this QR code to view our menu
        </text>
        
        <!-- URL -->
        <text x="200" y="430" text-anchor="middle" font-family="Arial, sans-serif" font-size="8" fill="gray">
          ${qrCodeUrl}
        </text>
      </svg>
    `;
    
    // Create download link
    const blob = new Blob([completeSVG], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `QR_Code_TABLE_${tableNumber}_${new Date().toISOString().split('T')[0]}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
  } catch (error) {
    console.error('Error generating SVG:', error);
    throw error;
  }
};

// Function to generate multiple SVG files and download as ZIP
export const generateMultipleQRCodesSVG = async (tables: Table[], locationName: string) => {
  try {
    // Import JSZip dynamically to avoid bundle size issues
    const JSZip = (await import('jszip')).default;
    const zip = new JSZip();
    
    // Generate SVG for each table
    for (const table of tables) {
      const qrCodeUrl = `${window.location.origin}${table.qrCodeUrl}`;
      const qrCodeSVG = await QRCode.toString(qrCodeUrl, {
        type: 'svg',
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      
      const tableNumber = table.name.replace(/[^0-9]/g, '') || '1';
      const completeSVG = `
        <svg width="400" height="450" xmlns="http://www.w3.org/2000/svg">
          <!-- Background -->
          <rect width="400" height="450" fill="white"/>
          
          <!-- Location Name -->
          <text x="200" y="30" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="black">
            ${locationName}
          </text>
          
          <!-- QR Code -->
          <g transform="translate(50, 50)">
            ${qrCodeSVG.replace('<svg', '<svg width="300" height="300"').replace('</svg>', '').replace(/^[^>]*>/, '')}
          </g>
          
          <!-- Table Name -->
          <text x="200" y="380" text-anchor="middle" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="black">
            TABLE - ${tableNumber}
          </text>
          
          <!-- Instructions -->
          <text x="200" y="405" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="black">
            Scan this QR code to view our menu
          </text>
          
          <!-- URL -->
          <text x="200" y="430" text-anchor="middle" font-family="Arial, sans-serif" font-size="8" fill="gray">
            ${qrCodeUrl}
          </text>
        </svg>
      `;
      
      // Add SVG to ZIP
      zip.file(`QR_Code_TABLE_${tableNumber}.svg`, completeSVG);
    }
    
    // Generate ZIP file and download
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(zipBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `QR_Codes_SVG_${locationName.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
  } catch (error) {
    console.error('Error generating SVG files:', error);
    throw error;
  }
}; 