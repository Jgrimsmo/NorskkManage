import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  Modal, 
  TouchableOpacity, 
  ScrollView, 
  Dimensions,
  ActivityIndicator,
  Alert 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Sharing from 'expo-sharing';
import { globalStyles, colors } from '@/styles';
import { PDFService } from '@/services/pdfService';
import { DailyReport } from '@/hooks/useReportManagement';

interface PDFPreviewModalProps {
  visible: boolean;
  onClose: () => void;
  report: DailyReport | null;
}

const PDFPreviewModal: React.FC<PDFPreviewModalProps> = ({
  visible,
  onClose,
  report
}) => {
  const [loading, setLoading] = useState(false);
  const [pdfGenerated, setPdfGenerated] = useState(false);
  const [pdfUri, setPdfUri] = useState<string>('');

  useEffect(() => {
    if (visible && report) {
      setPdfGenerated(false);
      setPdfUri('');
    }
  }, [visible, report]);

  const generatePDF = async () => {
    if (!report) return;

    setLoading(true);
    try {
      const pdfService = PDFService.getInstance();
      const uri = await pdfService.generatePDF(report);
      setPdfUri(uri);
      setPdfGenerated(true);
    } catch (error) {
      console.error('Error generating PDF:', error);
      Alert.alert('Error', 'Failed to generate PDF: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    if (!report) return;

    if (!pdfGenerated) {
      await generatePDF();
      return;
    }

    if (pdfUri) {
      try {
        const projectName = report.project?.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_') || 'Report';
        const reportDate = report.date || new Date().toISOString().split('T')[0];
        const fileName = `${projectName}_Daily_Site_Report_${reportDate}.pdf`;

        await Sharing.shareAsync(pdfUri, {
          mimeType: 'application/pdf',
          dialogTitle: 'Share Daily Report',
          UTI: 'com.adobe.pdf'
        });
      } catch (error) {
        Alert.alert('Error', 'Failed to share PDF: ' + (error instanceof Error ? error.message : 'Unknown error'));
      }
    }
  };

  const handleDownload = async () => {
    if (!pdfGenerated) {
      await generatePDF();
    } else {
      Alert.alert('Success', 'PDF has been generated and is ready to share!');
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={globalStyles.modalContainer}>
        <View style={globalStyles.modalContent}>
          {/* Header */}
          <View style={globalStyles.modalHeader}>
            <Text style={globalStyles.modalTitle}>
              PDF Report - {report?.project}
            </Text>
            <TouchableOpacity
              style={globalStyles.modalCloseButton}
              onPress={onClose}
            >
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <ScrollView style={globalStyles.modalBody}>
            <View style={{ padding: 16 }}>
              {/* Report Information */}
              <View style={{
                backgroundColor: colors.light,
                borderRadius: 8,
                padding: 16,
                marginBottom: 24
              }}>
                <Text style={{
                  fontSize: 18,
                  fontWeight: '600',
                  color: colors.text,
                  marginBottom: 12
                }}>
                  Daily Site Report
                </Text>
                
                <View style={{ marginBottom: 8 }}>
                  <Text style={{ fontSize: 14, color: colors.textSecondary }}>Project</Text>
                  <Text style={{ fontSize: 16, color: colors.text, fontWeight: '500' }}>
                    {report?.project || 'Unknown Project'}
                  </Text>
                </View>
                
                <View style={{ marginBottom: 8 }}>
                  <Text style={{ fontSize: 14, color: colors.textSecondary }}>Date</Text>
                  <Text style={{ fontSize: 16, color: colors.text, fontWeight: '500' }}>
                    {report?.date ? new Date(report.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }) : 'No date specified'}
                  </Text>
                </View>
                
                <View style={{ marginBottom: 8 }}>
                  <Text style={{ fontSize: 14, color: colors.textSecondary }}>Workers on Site</Text>
                  <Text style={{ fontSize: 16, color: colors.text, fontWeight: '500' }}>
                    {report?.workersOnSite || 0}
                  </Text>
                </View>
                
                <View style={{ marginBottom: 8 }}>
                  <Text style={{ fontSize: 14, color: colors.textSecondary }}>Photos Included</Text>
                  <Text style={{ fontSize: 16, color: colors.text, fontWeight: '500' }}>
                    {report?.photos?.length || 0} photos
                  </Text>
                </View>
              </View>

              {/* Work Summary */}
              {report?.workCompleted && (
                <View style={{
                  backgroundColor: colors.light,
                  borderRadius: 8,
                  padding: 16,
                  marginBottom: 24
                }}>
                  <Text style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: colors.text,
                    marginBottom: 8
                  }}>
                    Work Completed
                  </Text>
                  <Text style={{
                    fontSize: 14,
                    color: colors.text,
                    lineHeight: 20
                  }}>
                    {report.workCompleted}
                  </Text>
                </View>
              )}

              {/* PDF Status */}
              <View style={{
                backgroundColor: pdfGenerated ? colors.success + '20' : colors.warning + '20',
                borderRadius: 8,
                padding: 16,
                marginBottom: 24,
                borderWidth: 1,
                borderColor: pdfGenerated ? colors.success : colors.warning
              }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                  <Ionicons 
                    name={pdfGenerated ? "checkmark-circle" : "document-text"} 
                    size={20} 
                    color={pdfGenerated ? colors.success : colors.warning}
                    style={{ marginRight: 8 }}
                  />
                  <Text style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: pdfGenerated ? colors.success : colors.warning
                  }}>
                    {pdfGenerated ? 'PDF Ready' : 'PDF Not Generated'}
                  </Text>
                </View>
                <Text style={{
                  fontSize: 14,
                  color: colors.text
                }}>
                  {pdfGenerated 
                    ? 'Professional PDF report has been generated and is ready to share.'
                    : 'Click "Generate PDF" to create a professional daily report document.'
                  }
                </Text>
              </View>

              {/* Loading State */}
              {loading && (
                <View style={{
                  backgroundColor: colors.light,
                  borderRadius: 8,
                  padding: 24,
                  alignItems: 'center',
                  marginBottom: 24
                }}>
                  <ActivityIndicator size="large" color={colors.primary} />
                  <Text style={{
                    fontSize: 16,
                    color: colors.text,
                    marginTop: 12,
                    textAlign: 'center'
                  }}>
                    Generating professional PDF...
                  </Text>
                  <Text style={{
                    fontSize: 14,
                    color: colors.textSecondary,
                    marginTop: 4,
                    textAlign: 'center'
                  }}>
                    Including photos and formatting
                  </Text>
                </View>
              )}
            </View>
          </ScrollView>

          {/* Footer Actions */}
          <View style={globalStyles.modalFooter}>
            <TouchableOpacity
              style={[globalStyles.secondaryButton, { flex: 1, marginRight: 8 }]}
              onPress={handleDownload}
              disabled={loading}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons 
                  name={pdfGenerated ? "checkmark" : "document-text"} 
                  size={16} 
                  color={colors.primary} 
                  style={{ marginRight: 4 }} 
                />
                <Text style={globalStyles.secondaryButtonText}>
                  {pdfGenerated ? 'Generated' : 'Generate PDF'}
                </Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[globalStyles.primaryButton, { flex: 1, marginLeft: 8 }]}
              onPress={handleShare}
              disabled={loading}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons name="share" size={16} color="#FFFFFF" style={{ marginRight: 4 }} />
                <Text style={globalStyles.primaryButtonText}>
                  {pdfGenerated ? 'Share PDF' : 'Generate & Share'}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default PDFPreviewModal;
