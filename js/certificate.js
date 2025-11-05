// Digital Certificate System for SPBE DevOps Academy
class CertificateManager {
  constructor() {
    this.supabase = null;
    this.currentUser = null;
    this.isInitialized = false;
  }

  async initialize() {
    if (this.isInitialized) return;
    
    try {
      // Get Supabase instance
      if (window.SupabaseConfig) {
        this.supabase = window.SupabaseConfig.initializeSupabase();
      }

      // Wait for auth
      if (window.authManager) {
        await new Promise(resolve => {
          const checkAuth = () => {
            if (window.authManager.isInitialized) {
              this.currentUser = window.authManager.getCurrentUser();
              resolve();
            } else {
              setTimeout(checkAuth, 100);
            }
          };
          checkAuth();
        });
      }

      this.isInitialized = true;
    } catch (error) {
      console.error('Certificate manager initialization error:', error);
    }
  }

  // Certificate generation methods
  async generateCertificate(curriculumId, levelId, certificateType = 'completion') {
    try {
      if (!this.currentUser) {
        throw new Error('User not authenticated');
      }

      // Check if user has completed all requirements
      const eligibilityCheck = await this.checkCertificateEligibility(curriculumId, levelId);
      if (!eligibilityCheck.eligible) {
        throw new Error(eligibilityCheck.reason);
      }

      // Generate certificate data
      const certificateData = await this.createCertificateData(
        curriculumId, 
        levelId, 
        certificateType
      );

      // Save certificate to database
      let certificate;
      if (this.supabase) {
        const result = await this.supabase
          .from('certificates')
          .insert(certificateData)
          .select()
          .single();

        if (result.error) throw result.error;
        certificate = result.data;
      } else {
        certificate = await this.fallbackSaveCertificate(certificateData);
      }

      // Log activity
      await this.logActivity('CERTIFICATE_EARNED', `Sertifikat diterima: ${certificateData.certificate_type}`, {
        curriculum_id: curriculumId,
        level_id: levelId,
        certificate_type: certificateType,
        certificate_id: certificate.id
      });

      return { success: true, data: certificate };
    } catch (error) {
      console.error('Error generating certificate:', error);
      return { success: false, error };
    }
  }

  async createCertificateData(curriculumId, levelId, certificateType) {
    const curriculum = window.curricula?.[curriculumId];
    const level = curriculum?.levels?.[levelId];
    
    if (!curriculum || !level) {
      throw new Error('Invalid curriculum or level');
    }

    const userProfile = await window.authManager?.getUserProfile();
    const verificationCode = this.generateVerificationCode();

    return {
      user_id: this.currentUser.id,
      curriculum_id: curriculumId,
      level_id: levelId,
      certificate_type: certificateType,
      certificate_url: null, // Will be generated
      verification_code: verificationCode,
      issued_at: new Date().toISOString(),
      metadata: {
        user_name: userProfile?.full_name || this.currentUser.email?.split('@')[0],
        user_nip: userProfile?.nip,
        user_jabatan: userProfile?.jabatan,
        user_unit: userProfile?.unit_kerja,
        curriculum_name: curriculum.name,
        level_name: level.name,
        completion_date: new Date().toISOString(),
        certificate_id: `CERT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
      }
    };
  }

  async checkCertificateEligibility(curriculumId, levelId) {
    try {
      if (!window.progressManager) {
        return { eligible: false, reason: 'Progress manager not available' };
      }

      const levelProgress = await window.progressManager.getLevelProgress(curriculumId, levelId);
      if (!levelProgress.success) {
        return { eligible: false, reason: 'Unable to verify progress' };
      }

      const curriculum = window.curricula?.[curriculumId];
      const level = curriculum?.levels?.[levelId];
      
      if (!curriculum || !level) {
        return { eligible: false, reason: 'Invalid curriculum or level' };
      }

      const totalModules = level.modules.length;
      const completedModules = levelProgress.data.filter(p => p.completed).length;

      // Check quiz requirements
      const quizResults = await window.progressManager.getQuizResults();
      const levelQuizResults = quizResults.success ? quizResults.data.filter(q => {
        return level.modules.some(module => module.id === q.module_id);
      }) : [];

      const passedQuizzes = levelQuizResults.filter(q => q.score >= 70).length;

      if (completedModules < totalModules) {
        return { 
          eligible: false, 
          reason: `Anda harus menyelesaikan semua modul (${completedModules}/${totalModules})` 
        };
      }

      if (passedQuizzes < totalModules) {
        return { 
          eligible: false, 
          reason: `Anda harus lulus semua quiz (${passedQuizzes}/${totalModules})` 
        };
      }

      return { eligible: true };
    } catch (error) {
      console.error('Error checking certificate eligibility:', error);
      return { eligible: false, reason: 'Error checking eligibility' };
    }
  }

  // Certificate retrieval methods
  async getUserCertificates() {
    try {
      if (!this.currentUser) {
        return { success: false, error: 'User not authenticated' };
      }

      let certificates;
      if (this.supabase) {
        const result = await this.supabase
          .from('certificates')
          .select('*')
          .eq('user_id', this.currentUser.id)
          .order('issued_at', { ascending: false });

        if (result.error) throw result.error;
        certificates = result.data;
      } else {
        certificates = await this.fallbackGetCertificates();
      }

      return { success: true, data: certificates || [] };
    } catch (error) {
      console.error('Error getting user certificates:', error);
      return { success: false, error };
    }
  }

  async getCertificateByCode(verificationCode) {
    try {
      let certificate;
      if (this.supabase) {
        const result = await this.supabase
          .from('certificates')
          .select(`
            *,
            users!inner(
              full_name,
              email,
              nip,
              jabatan,
              unit_kerja
            )
          `)
          .eq('verification_code', verificationCode)
          .single();

        if (result.error && result.error.code !== 'PGRST116') { // Not found
            throw result.error;
          }

        certificate = result.data;
      } else {
        certificate = await this.fallbackGetCertificateByCode(verificationCode);
      }

      return { success: true, data: certificate };
    } catch (error) {
      console.error('Error getting certificate by code:', error);
      return { success: false, error };
    }
  }

  // Certificate display methods
  async displayCertificate(certificateId) {
    try {
      const certificates = await this.getUserCertificates();
      if (!certificates.success) {
        throw new Error('Unable to retrieve certificates');
      }

      const certificate = certificates.data.find(c => c.id === certificateId);
      if (!certificate) {
        throw new Error('Certificate not found');
      }

      this.showCertificateModal(certificate);
    } catch (error) {
      console.error('Error displaying certificate:', error);
      window.authManager?.showNotification('Gagal menampilkan sertifikat', 'error');
    }
  }

  showCertificateModal(certificate) {
    // Create modal HTML
    const modalHtml = `
      <div id="certificate-modal" class="modal active">
        <div class="modal-content certificate-content">
          <button class="modal-close" onclick="certificateManager.closeCertificateModal()">×</button>
          <div class="certificate">
            <div class="certificate-border">
              <div class="certificate-header">
                <h2>🏆 Sertifikat Penyelesaian</h2>
                <div class="certificate-seal">
                  <div class="seal-icon">🎓</div>
                  <div class="seal-text">SPBE Academy</div>
                </div>
              </div>
              
              <div class="certificate-body">
                <p class="certificate-text">Diberikan kepada</p>
                <h3 class="certificate-name">${certificate.metadata?.user_name || 'Peserta'}</h3>
                
                <div class="certificate-details">
                  <p class="certificate-text">Telah menyelesaikan</p>
                  <h4 class="certificate-program">${certificate.metadata?.curriculum_name || 'Program'}</h4>
                  <p class="certificate-level">${certificate.metadata?.level_name || 'Level'}</p>
                </div>

                <div class="certificate-info">
                  <div class="info-row">
                    <span class="info-label">NIP:</span>
                    <span class="info-value">${certificate.metadata?.user_nip || '-'}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Jabatan:</span>
                    <span class="info-value">${certificate.metadata?.user_jabatan || '-'}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Unit Kerja:</span>
                    <span class="info-value">${certificate.metadata?.user_unit || '-'}</span>
                  </div>
                </div>

                <div class="certificate-footer">
                  <div class="certificate-date">
                    <p>Diterbitkan pada: ${new Date(certificate.issued_at).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}</p>
                  </div>
                  
                  <div class="certificate-verification">
                    <p class="verification-text">Kode Verifikasi:</p>
                    <p class="verification-code">${certificate.verification_code}</p>
                    <p class="verification-note">Verifikasi online: ${window.location.origin}/verify/${certificate.verification_code}</p>
                  </div>
                </div>
              </div>

              <div class="certificate-actions">
                <button class="btn btn--primary" onclick="certificateManager.downloadCertificate('${certificate.id}')">
                  📥 Unduh Sertifikat
                </button>
                <button class="btn btn--outline" onclick="certificateManager.shareCertificate('${certificate.verification_code}')">
                  📤 Bagikan
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Add to page
    document.body.insertAdjacentHTML('beforeend', modalHtml);
  }

  closeCertificateModal() {
    const modal = document.getElementById('certificate-modal');
    if (modal) {
      modal.remove();
    }
  }

  // Certificate utility methods
  async downloadCertificate(certificateId) {
    try {
      const certificates = await this.getUserCertificates();
      const certificate = certificates.data.find(c => c.id === certificateId);
      
      if (!certificate) {
        throw new Error('Certificate not found');
      }

      // Generate PDF (simplified version)
      await this.generateCertificatePDF(certificate);
    } catch (error) {
      console.error('Error downloading certificate:', error);
      window.authManager?.showNotification('Gagal mengunduh sertifikat', 'error');
    }
  }

  async generateCertificatePDF(certificate) {
    // This is a simplified PDF generation
    // In production, you'd use a proper PDF library like jsPDF
    const certificateHtml = this.generateCertificateHTML(certificate);
    
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Sertifikat - ${certificate.metadata?.user_name}</title>
        <style>
          ${this.getCertificatePrintStyles()}
        </style>
      </head>
      <body>
        ${certificateHtml}
      </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    
    // Wait for content to load, then print
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 1000);
  }

  generateCertificateHTML(certificate) {
    return `
      <div class="print-certificate">
        <div class="certificate-border">
          <h1>🏆 Sertifikat Penyelesaian</h1>
          <p>Diberikan kepada</p>
          <h2>${certificate.metadata?.user_name || 'Peserta'}</h2>
          <p>Telah menyelesaikan</p>
          <h3>${certificate.metadata?.curriculum_name || 'Program'}</h3>
          <p>${certificate.metadata?.level_name || 'Level'}</p>
          <p>Diterbitkan pada: ${new Date(certificate.issued_at).toLocaleDateString('id-ID')}</p>
          <p>Kode Verifikasi: ${certificate.verification_code}</p>
        </div>
      </div>
    `;
  }

  getCertificatePrintStyles() {
    return `
      @page {
        size: A4 landscape;
        margin: 2cm;
      }
      
      body {
        font-family: 'Times New Roman', serif;
        margin: 0;
        padding: 20px;
      }
      
      .print-certificate {
        width: 100%;
        height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .certificate-border {
        border: 5px solid #2563eb;
        padding: 40px;
        text-align: center;
        max-width: 800px;
        background: linear-gradient(135deg, #f8fafc 0%, #e0f2fe 100%);
        border-radius: 15px;
      }
      
      h1 {
        color: #1e40af;
        font-size: 36px;
        margin-bottom: 20px;
      }
      
      h2 {
        color: #1e293b;
        font-size: 28px;
        margin: 20px 0;
        font-weight: bold;
      }
      
      h3 {
        color: #3382a4;
        font-size: 24px;
        margin: 15px 0;
      }
      
      p {
        color: #475569;
        font-size: 18px;
        margin: 10px 0;
      }
    `;
  }

  async shareCertificate(verificationCode) {
    try {
      const shareUrl = `${window.location.origin}/verify/${verificationCode}`;
      
      if (navigator.share) {
        await navigator.share({
          title: 'Sertifikat SPBE DevOps Academy',
          text: 'Lihat sertifikat saya di SPBE DevOps Academy',
          url: shareUrl
        });
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(shareUrl);
        window.authManager?.showNotification('Link sertifikat disalin!', 'success');
      }
    } catch (error) {
      console.error('Error sharing certificate:', error);
      window.authManager?.showNotification('Gagal membagikan sertifikat', 'error');
    }
  }

  // Verification methods
  async verifyCertificate(verificationCode) {
    try {
      const result = await this.getCertificateByCode(verificationCode);
      
      if (!result.success || !result.data) {
        return { 
          valid: false, 
          reason: 'Sertifikat tidak ditemukan atau tidak valid' 
        };
      }

      const certificate = result.data;
      
      return {
        valid: true,
        certificate: {
          id: certificate.id,
          user_name: certificate.users?.full_name,
          curriculum_name: certificate.metadata?.curriculum_name,
          level_name: certificate.metadata?.level_name,
          issued_at: certificate.issued_at,
          verification_code: certificate.verification_code
        }
      };
    } catch (error) {
      console.error('Error verifying certificate:', error);
      return { 
        valid: false, 
        reason: 'Terjadi kesalahan saat verifikasi' 
      };
    }
  }

  // Helper methods
  generateVerificationCode() {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substr(2, 5).toUpperCase();
    return `SPBE-${timestamp}-${random}`;
  }

  async logActivity(activityType, description, metadata = {}) {
    if (window.authManager) {
      await window.authManager.logActivity(activityType, description, metadata);
    }
  }

  // Fallback methods
  async fallbackSaveCertificate(certificateData) {
    const stored = localStorage.getItem('spbe_certificates') || '[]';
    const certificates = JSON.parse(stored);
    
    const newCertificate = { ...certificateData, id: Date.now().toString() };
    certificates.push(newCertificate);
    
    localStorage.setItem('spbe_certificates', JSON.stringify(certificates));
    return newCertificate;
  }

  async fallbackGetCertificates() {
    const stored = localStorage.getItem('spbe_certificates') || '[]';
    return JSON.parse(stored);
  }

  async fallbackGetCertificateByCode(verificationCode) {
    const certificates = await this.fallbackGetCertificates();
    return certificates.find(c => c.verification_code === verificationCode);
  }
}

// Create global instance
const certificateManager = new CertificateManager();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = certificateManager;
} else {
  window.certificateManager = certificateManager;
}