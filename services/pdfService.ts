import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { DailyReport } from '../hooks/useReportManagement';

interface CompanySettings {
  companyName?: string;
  companyAddress?: string;
  companyCity?: string;
  companyState?: string;
  companyZip?: string;
  companyPhone?: string;
  companyEmail?: string;
  companyWebsite?: string;
  companyLicense?: string;
}

export class PDFService {
  private static instance: PDFService;

  public static getInstance(): PDFService {
    if (!PDFService.instance) {
      PDFService.instance = new PDFService();
    }
    return PDFService.instance;
  }

  private formatDate(dateString: string): string {
    if (!dateString) return 'Date Not Specified';
    return new Date(dateString).toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric',
      month: 'long', 
      day: 'numeric' 
    });
  }

  private async convertImageToBase64(uri: string): Promise<string> {
    try {
      const base64 = await FileSystem.readAsStringAsync(uri, { encoding: 'base64' });
      return `data:image/jpeg;base64,${base64}`;
    } catch (error) {
      console.error('Error converting image to base64:', error);
      return '';
    }
  }

  public async generateReportHTML(
    report: DailyReport, 
    companySettings: CompanySettings = {}
  ): Promise<string> {
    const {
      companyName = 'Norskk Management Ltd.',
      companyAddress = '123 Construction Avenue',
      companyCity = 'City',
      companyState = 'Province',
      companyZip = 'A1B 2C3',
      companyPhone = '(555) 123-4567',
      companyEmail = 'info@norskk.com',
      companyWebsite = 'www.norskk.com',
      companyLicense = '#ABC123456',
    } = companySettings;

    const formattedDate = this.formatDate(report.date);
    const currentDateTime = new Date().toLocaleString('en-US');

    // Convert photos to base64 if available
    const photoData: string[] = [];
    if (report.photos && report.photos.length > 0) {
      for (const photo of report.photos) {
        if (photo.uri) {
          const base64 = await this.convertImageToBase64(photo.uri);
          if (base64) {
            photoData.push(base64);
          }
        }
      }
    }

    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Daily Site Report - ${report.project}</title>
  <style>
    @page {
      size: letter;
      margin: 0.5in;
    }
    * { 
      margin: 0; 
      padding: 0; 
      box-sizing: border-box;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    body { 
      font-family: 'Arial', sans-serif; 
      line-height: 1.4; 
      color: #333; 
      background: white;
      font-size: 12px;
      width: 100%;
      max-width: none;
    }
    .container { 
      width: 100%;
      padding: 0;
      margin: 0;
    }
    .header {
      border-bottom: 3px solid #2B77AD;
      padding-bottom: 15px;
      margin-bottom: 25px;
      page-break-after: avoid;
    }
    .company-name {
      font-size: 22px;
      font-weight: bold;
      color: #2B77AD;
      text-align: center;
      margin-bottom: 3px;
    }
    .company-tagline {
      font-size: 12px;
      color: #666;
      font-style: italic;
      text-align: center;
    }
    .company-details {
      text-align: center;
      font-size: 10px;
      color: #666;
      margin-top: 8px;
      line-height: 1.3;
    }
    .report-title {
      text-align: center;
      font-size: 18px;
      font-weight: bold;
      color: #1A365D;
      margin: 15px 0;
      text-transform: uppercase;
      letter-spacing: 1px;
      page-break-after: avoid;
    }
    .report-info {
      background: #f8f9fa;
      border: 1px solid #dee2e6;
      padding: 15px;
      margin-bottom: 20px;
      page-break-inside: avoid;
    }
    .info-grid {
      width: 100%;
      display: table;
    }
    .info-row {
      display: table-row;
    }
    .info-item {
      display: table-cell;
      width: 50%;
      padding: 8px;
      vertical-align: top;
    }
    .info-label {
      font-weight: bold;
      color: #2B77AD;
      margin-bottom: 2px;
      font-size: 10px;
      text-transform: uppercase;
    }
    .info-value {
      color: #333;
      font-size: 12px;
    }
    .section {
      margin-bottom: 20px;
      page-break-inside: avoid;
    }
    .section-title {
      font-size: 13px;
      font-weight: bold;
      color: #1A365D;
      margin: 12px 0 6px 0;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border-bottom: 1px solid #E2E8F0;
      padding-bottom: 2px;
      page-break-after: avoid;
    }
    .narrative-box {
      background: #f8f9fa;
      border: 1px solid #E2E8F0;
      border-left: 4px solid #2B77AD;
      padding: 10px;
      margin-bottom: 10px;
      min-height: 50px;
    }
    .narrative-content {
      font-size: 11px;
      color: #2D3748;
      line-height: 1.5;
      text-align: justify;
    }
    .photos-section {
      margin-top: 25px;
      page-break-inside: avoid;
    }
    .photos-grid {
      width: 100%;
      margin-top: 10px;
    }
    .photo-row {
      display: table-row;
    }
    .photo-item {
      display: table-cell;
      width: 50%;
      text-align: center;
      padding: 10px;
      vertical-align: top;
      page-break-inside: avoid;
    }
    .photo-img {
      max-width: 95%;
      height: 180px;
      object-fit: cover;
      border: 1px solid #E2E8F0;
      display: block;
      margin: 0 auto;
    }
    .photo-caption {
      font-size: 9px;
      color: #666;
      margin-top: 4px;
      text-align: center;
    }
    .footer {
      margin-top: 30px;
      padding-top: 15px;
      border-top: 1px solid #E2E8F0;
      text-align: center;
      font-size: 9px;
      color: #666;
      page-break-inside: avoid;
    }
    .signature-section {
      margin-top: 25px;
      width: 100%;
      display: table;
      page-break-inside: avoid;
    }
    .signature-row {
      display: table-row;
    }
    .signature-box {
      display: table-cell;
      width: 50%;
      padding: 20px;
      border-top: 1px solid #333;
      text-align: center;
      font-size: 10px;
      vertical-align: top;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="company-name">${companyName}</div>
      <div class="company-tagline">Professional Construction Management</div>
      <div class="company-details">
        ${companyAddress} • ${companyCity}, ${companyState} ${companyZip}<br>
        Phone: ${companyPhone} • Email: ${companyEmail} • Web: ${companyWebsite}<br>
        License: ${companyLicense}
      </div>
    </div>

    <div class="report-title">Daily Site Report</div>

    <div class="report-info">
      <div class="info-grid">
        <div class="info-row">
          <div class="info-item">
            <div class="info-label">Project Name</div>
            <div class="info-value">${report.project || 'Not Specified'}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Report Date</div>
            <div class="info-value">${formattedDate}</div>
          </div>
        </div>
        <div class="info-row">
          <div class="info-item">
            <div class="info-label">Workers on Site</div>
            <div class="info-value">${report.workersOnSite || 0} workers</div>
          </div>
          <div class="info-item">
            <div class="info-label">Weather Conditions</div>
            <div class="info-value">${report.weatherConditions || 'Not Reported'}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="section">
      <div class="section-title">Work Completed</div>
      <div class="narrative-box">
        <div class="narrative-content">
          ${report.workCompleted || 'No work description provided.'}
        </div>
      </div>
    </div>

    ${report.materialsUsed ? `
    <div class="section">
      <div class="section-title">Materials Used</div>
      <div class="narrative-box">
        <div class="narrative-content">
          ${report.materialsUsed}
        </div>
      </div>
    </div>
    ` : ''}

    ${report.safetyIncidents ? `
    <div class="section">
      <div class="section-title">Safety Incidents & Concerns</div>
      <div class="narrative-box">
        <div class="narrative-content">
          ${report.safetyIncidents}
        </div>
      </div>
    </div>
    ` : ''}

    ${report.nextDayPlan ? `
    <div class="section">
      <div class="section-title">Next Day Plan</div>
      <div class="narrative-box">
        <div class="narrative-content">
          ${report.nextDayPlan}
        </div>
      </div>
    </div>
    ` : ''}

    ${photoData.length > 0 ? `
    <div class="photos-section">
      <div class="section-title">Site Photos (${photoData.length})</div>
      <div class="photos-grid">
        ${Array.from({ length: Math.ceil(photoData.length / 2) }).map((_, rowIndex) => `
          <div class="photo-row">
            ${photoData.slice(rowIndex * 2, rowIndex * 2 + 2).map((photo, index) => `
              <div class="photo-item">
                <img src="${photo}" alt="Site Photo ${rowIndex * 2 + index + 1}" class="photo-img" />
                <div class="photo-caption">Photo ${rowIndex * 2 + index + 1} - ${formattedDate}</div>
              </div>
            `).join('')}
            ${photoData.length % 2 !== 0 && rowIndex === Math.ceil(photoData.length / 2) - 1 ? '<div class="photo-item"></div>' : ''}
          </div>
        `).join('')}
      </div>
    </div>
    ` : ''}

    <div class="signature-section">
      <div class="signature-row">
        <div class="signature-box">
          Site Supervisor
        </div>
        <div class="signature-box">
          Project Manager
        </div>
      </div>
    </div>

    <div class="footer">
      <div>Report generated on ${currentDateTime}</div>
      <div style="margin-top: 3px;">${companyName} - Professional Daily Site Documentation</div>
    </div>
  </div>
</body>
</html>`;
  }

  public async generatePDF(
    report: DailyReport, 
    companySettings: CompanySettings = {}
  ): Promise<string> {
    try {
      const html = await this.generateReportHTML(report, companySettings);
      
      const result = await Print.printToFileAsync({
        html,
        base64: false,
        width: 612, // 8.5 inches at 72 DPI
        height: 792, // 11 inches at 72 DPI
        margins: {
          left: 36, // 0.5 inch
          top: 36,
          right: 36,
          bottom: 36,
        },
      });

      console.log('Print result:', result);

      // Handle different result types that Print.printToFileAsync might return
      if (typeof result === 'string') {
        // Sometimes it returns the URI directly
        return result;
      } else if (result && typeof result === 'object' && 'uri' in result) {
        // Sometimes it returns an object with uri property
        return result.uri;
      } else {
        console.error('Unexpected print result:', result);
        throw new Error('PDF generation returned unexpected result');
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      if (error instanceof Error) {
        throw new Error(`Failed to generate PDF: ${error.message}`);
      } else {
        throw new Error('Failed to generate PDF: Unknown error');
      }
    }
  }

  public async generateAndSharePDF(
    report: DailyReport, 
    companySettings: CompanySettings = {}
  ): Promise<void> {
    try {
      const pdfUri = await this.generatePDF(report, companySettings);
      
      const projectName = report.project?.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_') || 'Report';
      const reportDate = report.date || new Date().toISOString().split('T')[0];
      const fileName = `${projectName}_Daily_Site_Report_${reportDate}.pdf`;

      await Sharing.shareAsync(pdfUri, {
        mimeType: 'application/pdf',
        dialogTitle: 'Share Daily Report',
        UTI: 'com.adobe.pdf'
      });
    } catch (error) {
      console.error('Error sharing PDF:', error);
      throw new Error('Failed to share PDF');
    }
  }
}

export default PDFService.getInstance();
