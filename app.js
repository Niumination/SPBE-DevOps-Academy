// Data Structure
const curricula = {
  devops: {
    name: "DevOps Engineer (Fokus Database SPBE)",
    description: "Jalur pembelajaran untuk menjadi DevOps Engineer dengan fokus pada database clustering dan high availability",
    color: "#2563eb",
    levels: {
      basic: {
        name: "Basic (Operator)",
        duration: "2-3 bulan",
        modules: [
          {
            id: "dp-b-1",
            title: "Linux CLI Dasar",
            description: "Perintah CLI dasar, manajemen file, dan permission",
            tools: ["Ubuntu Server 22.04 LTS", "SSH Client (PuTTY/MobaXterm)", "htop", "systemctl"],
            project: "Setup lab virtual dengan 3 VM untuk sandbox pengembangan aplikasi SPBE",
            duration: "4 jam",
            quiz: [
              {
                question: "Perintah mana yang digunakan untuk melihat permission file di Linux?",
                options: ["ls -la", "cat", "pwd", "mkdir"],
                correct: 0,
                explanation: "Perintah 'ls -la' menampilkan daftar file dengan permission details"
              },
              {
                question: "Bagaimana cara memberikan permission execute ke owner pada file?",
                options: ["chmod 755", "chmod 644", "chmod 777", "chmod 444"],
                correct: 0,
                explanation: "chmod 755 memberikan rwx ke owner, rx ke group dan others"
              }
            ]
          },
          {
            id: "dp-b-2",
            title: "Konsep Virtualisasi",
            description: "Pemahaman tentang virtual machine, snapshot, dan backup",
            tools: ["VirtualBox", "VMware Player", "Hyper-V"],
            project: "Konfigurasi sandbox SPBE dengan snapshot VM untuk testing environment",
            duration: "3 jam",
            quiz: [
              {
                question: "Apa keuntungan utama menggunakan snapshot VM?",
                options: ["Menghemat storage", "Dapat kembali ke state sebelumnya dengan cepat", "Meningkatkan performa VM", "Mengurangi konsumsi RAM"],
                correct: 1,
                explanation: "Snapshot memungkinkan kita untuk save dan restore state VM secara cepat"
              }
            ]
          },
          {
            id: "dp-b-3",
            title: "Pengantar HA & Clustering",
            description: "Konsep failover, redundancy, dan uptime SLA",
            tools: ["HAProxy", "Documentation", "Monitoring tools"],
            project: "Setup monitoring untuk server SRIKANDI dengan alert CPU/Memory tinggi",
            duration: "3 jam",
            quiz: [
              {
                question: "Apa itu High Availability (HA)?",
                options: ["Kecepatan server tinggi", "Kemampuan sistem tetap beroperasi saat ada kegagalan", "Storage yang besar", "Network yang cepat"],
                correct: 1,
                explanation: "HA adalah kemampuan sistem untuk tetap operasional bahkan saat terjadi kegagalan komponen"
              }
            ]
          }
        ]
      },
      intermediate: {
        name: "Intermediate (Implementor)",
        duration: "4-6 bulan",
        modules: [
          {
            id: "dp-i-1",
            title: "Administrasi PostgreSQL",
            description: "Instalasi, konfigurasi, backup/restore, user management",
            tools: ["PostgreSQL 15/16", "pgAdmin 4", "pg_dump", "pg_restore"],
            project: "Implementasi scheduled backup database SRIKANDI dengan retention 30 hari",
            duration: "6 jam",
            quiz: [
              {
                question: "Command mana yang digunakan untuk backup database PostgreSQL?",
                options: ["pg_dump", "pg_restore", "psql", "createdb"],
                correct: 0,
                explanation: "pg_dump adalah utility untuk membuat backup database PostgreSQL"
              }
            ]
          },
          {
            id: "dp-i-2",
            title: "Infrastructure as Code (IaC)",
            description: "Konsep IaC, Ansible playbook, configuration management",
            tools: ["Ansible 2.14+", "YAML", "GitHub/GitLab"],
            project: "Membuat Ansible playbook untuk otomasi instalasi dan konfigurasi PostgreSQL",
            duration: "8 jam",
            quiz: [
              {
                question: "Apa keuntungan menggunakan Infrastructure as Code?",
                options: ["Dokumentasi otomatis", "Reproducible dan versionable", "Lebih murah", "Lebih cepat dari manual"],
                correct: 1,
                explanation: "IaC memungkinkan konfigurasi infrastruktur yang dapat direproduksi dan di-version control"
              }
            ]
          },
          {
            id: "dp-i-3",
            title: "Git & Version Control",
            description: "Git basics, branching, kolaborasi tim",
            tools: ["Git", "GitHub", "GitLab"],
            project: "Setup repository GitHub untuk dokumentasi SOP dan script tim IT Diskominfo",
            duration: "4 jam",
            quiz: [
              {
                question: "Apa perbedaan antara git clone dan git pull?",
                options: ["Tidak ada perbedaan", "Clone mengunduh repo baru, pull update repo yang sudah ada", "Clone lebih cepat", "Pull mengunduh repo baru"],
                correct: 1,
                explanation: "Clone adalah download repository pertama kali, pull adalah update repository yang sudah ada"
              }
            ]
          }
        ]
      },
      advanced: {
        name: "Advanced/Professional",
        duration: "6-12 bulan",
        modules: [
          {
            id: "dp-a-1",
            title: "Database Clustering & HA",
            description: "PostgreSQL Streaming Replication, Patroni, HAProxy",
            tools: ["Patroni", "etcd", "HAProxy", "pgpool-II"],
            project: "Implementasi PostgreSQL HA Cluster untuk SRIKANDI dengan auto-failover",
            duration: "16 jam",
            quiz: [
              {
                question: "Apa fungsi Patroni dalam setup HA PostgreSQL?",
                options: ["Backup database", "Automatic failover management", "Load balancing", "Monitoring"],
                correct: 1,
                explanation: "Patroni adalah tool untuk mengelola automatic failover dan cluster management PostgreSQL"
              }
            ]
          },
          {
            id: "dp-a-2",
            title: "CI/CD Pipeline",
            description: "Jenkins, GitLab CI, automation deployment",
            tools: ["Jenkins", "GitLab CI", "Docker", "Git"],
            project: "Setup CI/CD pipeline untuk automated deployment aplikasi SPBE",
            duration: "12 jam",
            quiz: [
              {
                question: "Apa tahap utama dalam CI/CD pipeline?",
                options: ["Build saja", "Build, Test, Deploy", "Deploy saja", "Backup saja"],
                correct: 1,
                explanation: "CI/CD terdiri dari tahap Build (kompilasi), Test (validasi), dan Deploy (production)"
              }
            ]
          },
          {
            id: "dp-a-3",
            title: "Docker & Containerization",
            description: "Docker images, containers, Docker Compose",
            tools: ["Docker", "Docker Compose", "Docker Registry"],
            project: "Containerize 1-2 aplikasi web SPBE untuk portability",
            duration: "10 jam",
            quiz: [
              {
                question: "Apa perbedaan antara Docker image dan container?",
                options: ["Tidak ada perbedaan", "Image adalah template, container adalah instance image", "Container lebih ringan dari image", "Image bisa berjalan tanpa container"],
                correct: 1,
                explanation: "Image adalah blueprint/template, container adalah instance yang sedang berjalan dari image"
              }
            ]
          },
          {
            id: "dp-a-4",
            title: "Monitoring dengan Prometheus & Grafana",
            description: "Metrics collection, dashboards, alerting",
            tools: ["Prometheus", "Grafana", "postgres_exporter"],
            project: "Setup dashboard monitoring untuk semua database server SPBE Aceh Tengah",
            duration: "12 jam",
            quiz: [
              {
                question: "Fungsi Prometheus dalam monitoring stack?",
                options: ["Visualization", "Metrics collection dan storage", "Alerting", "Logging"],
                correct: 1,
                explanation: "Prometheus adalah time-series database untuk mengumpulkan dan menyimpan metrics"
              }
            ]
          }
        ]
      }
    }
  },
  spbe: {
    name: "Penggiat Penilaian Indeks SPBE",
    description: "Jalur pembelajaran untuk menjadi penggiat penilaian indeks SPBE dengan fokus pada audit dan improvement",
    color: "#059669",
    levels: {
      basic: {
        name: "Basic (Familiarization)",
        duration: "1-2 bulan",
        modules: [
          {
            id: "sb-b-1",
            title: "Perpres 95/2018 & Regulasi SPBE",
            description: "Pemahaman regulasi SPBE, Perpres 95/2018, Permen PANRB",
            tools: ["Perpres 95/2018", "Permen PANRB 59/2020", "Portal SPBE Nasional"],
            project: "Menyusun checklist bukti dukung untuk Domain Infrastruktur SPBE",
            duration: "4 jam",
            quiz: [
              {
                question: "Berapa banyak domain dalam SPBE?",
                options: ["2 domain", "4 domain", "6 domain", "8 domain"],
                correct: 1,
                explanation: "SPBE memiliki 4 domain utama: Kebijakan, Tata Kelola, Manajemen, dan Layanan"
              }
            ]
          },
          {
            id: "sb-b-2",
            title: "8 Domain & 47 Indikator SPBE",
            description: "Struktur 47 indikator penilaian SPBE",
            tools: ["Portal SPBE Nasional", "Spreadsheet Excel"],
            project: "Membuat infografis atau mind map 47 indikator SPBE untuk sosialisasi internal",
            duration: "6 jam",
            quiz: [
              {
                question: "Indikator SPBE dikelompokkan ke dalam berapa aspek?",
                options: ["4 aspek", "6 aspek", "8 aspek", "10 aspek"],
                correct: 2,
                explanation: "47 indikator SPBE dikelompokkan ke dalam 8 aspek/kategori penilaian"
              }
            ]
          },
          {
            id: "sb-b-3",
            title: "Peran Diskominfo dalam SPBE",
            description: "Fungsi Diskominfo sebagai koordinator SPBE, Tim Koordinasi",
            tools: ["Dokumentasi SPBE", "Kerangka kerja SPBE"],
            project: "Melakukan pemetaan jobdesk teknis tim IT ke indikator SPBE",
            duration: "3 jam",
            quiz: [
              {
                question: "Siapa yang menjadi koordinator SPBE di tingkat Pemda?",
                options: ["OPD Teknis", "Diskominfo/Dinas TI", "Bagian Organisasi", "Kepala Daerah"],
                correct: 1,
                explanation: "Diskominfo atau Dinas Komunikasi dan Informatika adalah koordinator utama SPBE di Pemda"
              }
            ]
          }
        ]
      },
      intermediate: {
        name: "Intermediate (Audit & Mapping)",
        duration: "3-4 bulan",
        modules: [
          {
            id: "sb-i-1",
            title: "Metode Self-Assessment SPBE",
            description: "Teknik pengisian form evaluasi mandiri dan pengumpulan bukti",
            tools: ["Excel/Google Sheets", "Form Assessment", "Zoom/Google Meet"],
            project: "Melakukan self-assessment komprehensif untuk Domain Tata Kelola (10 indikator)",
            duration: "8 jam",
            quiz: [
              {
                question: "Apa tujuan utama self-assessment SPBE?",
                options: ["Mendapat score tinggi", "Mengidentifikasi kondisi riil dan gap", "Memenuhi regulasi saja", "Membuat laporan"],
                correct: 1,
                explanation: "Self-assessment bertujuan untuk mengidentifikasi kondisi existing dan gap terhadap kriteria"
              }
            ]
          },
          {
            id: "sb-i-2",
            title: "Teknik Mapping Bukti Dukung",
            description: "Mencocokkan bukti dengan indikator, gap analysis",
            tools: ["Excel Mapping Template", "Assessment Checklist"],
            project: "Identifikasi 5 indikator dengan nilai terendah dan analisis akar masalahnya",
            duration: "8 jam",
            quiz: [
              {
                question: "Mengapa gap analysis penting dalam SPBE assessment?",
                options: ["Untuk mendapat score tinggi", "Untuk mengidentifikasi area improvement", "Untuk membuat report", "Untuk dokumentasi saja"],
                correct: 1,
                explanation: "Gap analysis membantu mengidentifikasi perbedaan antara kondisi existing dan target state"
              }
            ]
          },
          {
            id: "sb-i-3",
            title: "Kriteria Penilaian Interoperabilitas",
            description: "Domain Layanan SPBE, interoperabilitas aplikasi",
            tools: ["Portal Evaluasi SPBE", "Dokumentasi Interoperabilitas"],
            project: "Membuat matriks interoperabilitas aplikasi SPBE di Aceh Tengah",
            duration: "6 jam",
            quiz: [
              {
                question: "Apa yang dimaksud interoperabilitas dalam SPBE?",
                options: ["Aplikasi berjalan cepat", "Aplikasi dapat berkomunikasi dan berbagi data", "Aplikasi user-friendly", "Aplikasi aman"],
                correct: 1,
                explanation: "Interoperabilitas adalah kemampuan aplikasi untuk berkomunikasi dan berbagi data satu sama lain"
              }
            ]
          }
        ]
      },
      advanced: {
        name: "Advanced/Professional",
        duration: "4-6 bulan",
        modules: [
          {
            id: "sb-a-1",
            title: "Strategi Peningkatan Nilai Indeks",
            description: "Konsolidasi data center, peningkatan interoperabilitas, keamanan siber",
            tools: ["Roadmap SPBE Nasional", "SWOT Analysis"],
            project: "Menyusun proposal teknis implementasi HA Database sebagai peningkatan indeks SPBE",
            duration: "10 jam",
            quiz: [
              {
                question: "Apa quick wins dalam peningkatan indeks SPBE?",
                options: ["Proyek besar dengan ROI tinggi", "Inisiatif cepat dengan effort rendah namun impact tinggi", "Implementasi teknologi canggih", "Pelatihan massal"],
                correct: 1,
                explanation: "Quick wins adalah inisiatif yang bisa diimplementasikan cepat dengan impact signifikan"
              }
            ]
          },
          {
            id: "sb-a-2",
            title: "Penyusunan Peta Rencana SPBE",
            description: "Roadmap SPBE 5 tahun selaras dengan RPJMD",
            tools: ["Microsoft Project", "PowerPoint", "Gantt Chart"],
            project: "Menyusun Peta Rencana SPBE Kabupaten Aceh Tengah 2025-2029",
            duration: "16 jam",
            quiz: [
              {
                question: "Berapa muatan yang harus ada dalam Peta Rencana SPBE?",
                options: ["3 muatan", "5 muatan", "7 muatan", "10 muatan"],
                correct: 2,
                explanation: "Peta Rencana SPBE memiliki 7 muatan: Tata Kelola, Manajemen, Layanan, Aplikasi, Infrastruktur, Keamanan, dan Audit"
              }
            ]
          },
          {
            id: "sb-a-3",
            title: "Arsitektur SPBE (As-is & To-be)",
            description: "Enterprise Architecture, dokumentasi arsitektur sistem",
            tools: ["TOGAF", "Visio/Draw.io", "Enterprise Architecture Tools"],
            project: "Menyusun dokumentasi Arsitektur SPBE Aceh Tengah (as-is dan to-be)",
            duration: "12 jam",
            quiz: [
              {
                question: "Apa perbedaan As-is dan To-be architecture?",
                options: ["Tidak ada perbedaan", "As-is adalah kondisi saat ini, To-be adalah kondisi target", "As-is lebih baik dari To-be", "To-be adalah documentation saja"],
                correct: 1,
                explanation: "As-is adalah state saat ini, To-be adalah target state yang ingin dicapai dalam periode tertentu"
              }
            ]
          },
          {
            id: "sb-a-4",
            title: "Presentasi Eksekutif & Storytelling",
            description: "Teknik presentasi, data visualization, stakeholder engagement",
            tools: ["PowerPoint", "Canva", "Data Visualization Tools"],
            project: "Membuat presentasi hasil evaluasi SPBE untuk Bupati/Sekda",
            duration: "8 jam",
            quiz: [
              {
                question: "Elemen apa yang penting dalam presentasi eksekutif SPBE?",
                options: ["Data teknis detail saja", "Executive summary, insight kunci, rekomendasi actionable", "Grafik yang banyak", "Laporan tertulis saja"],
                correct: 1,
                explanation: "Presentasi eksekutif harus fokus pada insight kunci dan rekomendasi yang actionable"
              }
            ]
          }
        ]
      }
    }
  }
};

const badges = {
  devops_basic: { name: "DevOps Operator", icon: "🥉", description: "Menyelesaikan Basic Level" },
  devops_intermediate: { name: "DevOps Implementor", icon: "🥈", description: "Menyelesaikan Intermediate Level" },
  devops_advanced: { name: "DevOps Architect", icon: "🥇", description: "Menyelesaikan Advanced Level" },
  spbe_basic: { name: "SPBE Familiarizer", icon: "🥉", description: "Menyelesaikan Basic Level" },
  spbe_intermediate: { name: "SPBE Auditor", icon: "🥈", description: "Menyelesaikan Intermediate Level" },
  spbe_advanced: { name: "SPBE Strategist", icon: "🥇", description: "Menyelesaikan Advanced Level" }
};

// State Management (In-memory)
const state = {
  currentView: 'dashboard',
  currentCurriculum: null,
  currentModule: null,
  completedModules: [],
  quizResults: {},
  earnedBadges: [],
  activities: []
};

// Application Object
const app = {
  init() {
    this.showView('dashboard');
    this.updateStats();
  },

  showView(viewName) {
    // Hide all views
    document.querySelectorAll('.view').forEach(view => {
      view.classList.remove('active');
    });

    // Show selected view
    const view = document.getElementById(`${viewName}-view`);
    if (view) {
      view.classList.add('active');
      state.currentView = viewName;
    }

    // Update content based on view
    if (viewName === 'progress') {
      this.updateProgressView();
    }
  },

  selectCurriculum(curriculumId) {
    state.currentCurriculum = curriculumId;
    this.showView('curriculum');
    this.renderCurriculum(curriculumId);
  },

  renderCurriculum(curriculumId) {
    const curriculum = curricula[curriculumId];
    document.getElementById('curriculum-title').textContent = curriculum.name;
    document.getElementById('curriculum-description').textContent = curriculum.description;

    const levelsContainer = document.getElementById('levels-container');
    levelsContainer.innerHTML = '';

    Object.keys(curriculum.levels).forEach(levelKey => {
      const level = curriculum.levels[levelKey];
      const levelSection = document.createElement('div');
      levelSection.className = 'level-section';

      const levelHeader = document.createElement('div');
      levelHeader.className = 'level-header';
      levelHeader.innerHTML = `
        <h3>${level.name}</h3>
        <span class="duration-badge">⏱️ ${level.duration}</span>
      `;

      const modulesGrid = document.createElement('div');
      modulesGrid.className = 'modules-grid';

      level.modules.forEach(module => {
        const isCompleted = state.completedModules.includes(module.id);
        const moduleCard = document.createElement('div');
        moduleCard.className = `module-card ${isCompleted ? 'completed' : ''}`;
        moduleCard.onclick = () => this.openModule(curriculumId, levelKey, module.id);

        moduleCard.innerHTML = `
          <span class="module-status">${isCompleted ? '✅' : '⭕'}</span>
          <h4>${module.title}</h4>
          <p>${module.description}</p>
          <span class="duration-badge">⏱️ ${module.duration}</span>
        `;

        modulesGrid.appendChild(moduleCard);
      });

      levelSection.appendChild(levelHeader);
      levelSection.appendChild(modulesGrid);
      levelsContainer.appendChild(levelSection);
    });
  },

  openModule(curriculumId, levelKey, moduleId) {
    const curriculum = curricula[curriculumId];
    const module = curriculum.levels[levelKey].modules.find(m => m.id === moduleId);

    if (!module) return;

    state.currentModule = { curriculumId, levelKey, moduleId, data: module };
    this.showView('module');
    this.renderModule(module);

    // Add activity
    this.addActivity(`Membuka modul: ${module.title}`);
  },

  renderModule(module) {
    document.getElementById('module-title').textContent = module.title;
    document.getElementById('module-duration').textContent = `⏱️ ${module.duration}`;
    document.getElementById('module-description').textContent = module.description;
    document.getElementById('module-project').textContent = module.project;

    // Render tools
    const toolsList = document.getElementById('module-tools');
    toolsList.innerHTML = '';
    module.tools.forEach(tool => {
      const toolBadge = document.createElement('span');
      toolBadge.className = 'tool-badge';
      toolBadge.textContent = tool;
      toolsList.appendChild(toolBadge);
    });

    // Update progress
    const isCompleted = state.completedModules.includes(module.id);
    const progressFill = document.getElementById('module-progress-fill');
    progressFill.style.width = isCompleted ? '100%' : '50%';
  },

  startQuiz() {
    if (!state.currentModule) return;

    const module = state.currentModule.data;
    const modal = document.getElementById('quiz-modal');
    const quizContent = document.getElementById('quiz-content');
    const quizResult = document.getElementById('quiz-result');

    quizContent.innerHTML = '';
    quizResult.classList.add('hidden');

    const quizState = {
      answers: [],
      submitted: false
    };

    module.quiz.forEach((q, index) => {
      const questionDiv = document.createElement('div');
      questionDiv.className = 'quiz-question';

      const questionTitle = document.createElement('h4');
      questionTitle.innerHTML = `<span class="question-number">Pertanyaan ${index + 1}:</span> ${q.question}`;
      questionDiv.appendChild(questionTitle);

      const optionsDiv = document.createElement('div');
      optionsDiv.className = 'quiz-options';

      q.options.forEach((option, optIndex) => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'quiz-option';
        optionDiv.textContent = option;
        optionDiv.onclick = () => {
          // Remove previous selection
          optionsDiv.querySelectorAll('.quiz-option').forEach(opt => {
            opt.classList.remove('selected');
          });
          optionDiv.classList.add('selected');
          quizState.answers[index] = optIndex;
        };
        optionsDiv.appendChild(optionDiv);
      });

      questionDiv.appendChild(optionsDiv);

      const explanationDiv = document.createElement('div');
      explanationDiv.className = 'quiz-explanation';
      explanationDiv.style.display = 'none';
      explanationDiv.textContent = `💡 ${q.explanation}`;
      questionDiv.appendChild(explanationDiv);

      quizContent.appendChild(questionDiv);
    });

    // Add submit button
    const submitBtn = document.createElement('button');
    submitBtn.className = 'btn btn--primary btn--full-width';
    submitBtn.textContent = 'Submit Jawaban';
    submitBtn.style.marginTop = '24px';
    submitBtn.onclick = () => {
      if (quizState.answers.length < module.quiz.length) {
        alert('Mohon jawab semua pertanyaan!');
        return;
      }

      // Calculate score
      let correct = 0;
      module.quiz.forEach((q, index) => {
        const questionDiv = quizContent.children[index];
        const optionsDiv = questionDiv.querySelector('.quiz-options');
        const explanationDiv = questionDiv.querySelector('.quiz-explanation');

        if (quizState.answers[index] === q.correct) {
          correct++;
          optionsDiv.children[quizState.answers[index]].classList.add('correct');
        } else {
          optionsDiv.children[quizState.answers[index]].classList.add('incorrect');
          optionsDiv.children[q.correct].classList.add('correct');
        }

        explanationDiv.style.display = 'block';
      });

      const score = Math.round((correct / module.quiz.length) * 100);
      state.quizResults[module.id] = score;

      // Show result
      quizContent.style.display = 'none';
      quizResult.classList.remove('hidden');
      document.getElementById('result-title').textContent = score >= 70 ? '🎉 Selamat!' : '📚 Perlu Belajar Lagi';
      document.getElementById('result-message').textContent = score >= 70 ? 'Anda telah lulus quiz ini!' : 'Silakan pelajari kembali materi ini.';
      document.getElementById('result-score').textContent = `Skor: ${correct}/${module.quiz.length} (${score}%)`;

      this.addActivity(`Menyelesaikan quiz: ${module.title} (Skor: ${score}%)`);
      this.updateStats();

      submitBtn.style.display = 'none';
    };
    quizContent.appendChild(submitBtn);

    modal.classList.add('active');
  },

  closeQuiz() {
    document.getElementById('quiz-modal').classList.remove('active');
  },

  markModuleComplete() {
    if (!state.currentModule) return;

    const moduleId = state.currentModule.moduleId;
    if (!state.completedModules.includes(moduleId)) {
      state.completedModules.push(moduleId);
      this.addActivity(`Menyelesaikan modul: ${state.currentModule.data.title}`);
      this.updateStats();

      // Check for badges
      this.checkBadges();

      // Update progress bar
      const progressFill = document.getElementById('module-progress-fill');
      progressFill.style.width = '100%';

      alert('✅ Modul berhasil ditandai selesai!');
    }
  },

  checkBadges() {
    const devopsBasicModules = curricula.devops.levels.basic.modules.map(m => m.id);
    const devopsIntermediateModules = curricula.devops.levels.intermediate.modules.map(m => m.id);
    const devopsAdvancedModules = curricula.devops.levels.advanced.modules.map(m => m.id);
    const spbeBasicModules = curricula.spbe.levels.basic.modules.map(m => m.id);
    const spbeIntermediateModules = curricula.spbe.levels.intermediate.modules.map(m => m.id);
    const spbeAdvancedModules = curricula.spbe.levels.advanced.modules.map(m => m.id);

    // Check DevOps badges
    if (devopsBasicModules.every(id => state.completedModules.includes(id)) && !state.earnedBadges.includes('devops_basic')) {
      state.earnedBadges.push('devops_basic');
      this.showCertificate('DevOps Engineer - Basic (Operator)', 'devops_basic');
    }
    if (devopsIntermediateModules.every(id => state.completedModules.includes(id)) && !state.earnedBadges.includes('devops_intermediate')) {
      state.earnedBadges.push('devops_intermediate');
      this.showCertificate('DevOps Engineer - Intermediate (Implementor)', 'devops_intermediate');
    }
    if (devopsAdvancedModules.every(id => state.completedModules.includes(id)) && !state.earnedBadges.includes('devops_advanced')) {
      state.earnedBadges.push('devops_advanced');
      this.showCertificate('DevOps Engineer - Advanced/Professional', 'devops_advanced');
    }

    // Check SPBE badges
    if (spbeBasicModules.every(id => state.completedModules.includes(id)) && !state.earnedBadges.includes('spbe_basic')) {
      state.earnedBadges.push('spbe_basic');
      this.showCertificate('Penggiat SPBE - Basic (Familiarization)', 'spbe_basic');
    }
    if (spbeIntermediateModules.every(id => state.completedModules.includes(id)) && !state.earnedBadges.includes('spbe_intermediate')) {
      state.earnedBadges.push('spbe_intermediate');
      this.showCertificate('Penggiat SPBE - Intermediate (Audit & Mapping)', 'spbe_intermediate');
    }
    if (spbeAdvancedModules.every(id => state.completedModules.includes(id)) && !state.earnedBadges.includes('spbe_advanced')) {
      state.earnedBadges.push('spbe_advanced');
      this.showCertificate('Penggiat SPBE - Advanced/Professional', 'spbe_advanced');
    }
  },

  showCertificate(levelName, badgeKey) {
    const modal = document.getElementById('certificate-modal');
    document.getElementById('certificate-level').textContent = levelName;
    document.getElementById('certificate-badge').textContent = badges[badgeKey].icon;
    document.getElementById('certificate-date').textContent = `Tanggal: ${new Date().toLocaleDateString('id-ID')}`;
    modal.classList.add('active');
  },

  closeCertificate() {
    document.getElementById('certificate-modal').classList.remove('active');
  },

  backToCurriculum() {
    if (state.currentCurriculum) {
      this.selectCurriculum(state.currentCurriculum);
    } else {
      this.showView('dashboard');
    }
  },

  updateStats() {
    // Update dashboard stats
    document.getElementById('stats-modules').textContent = state.completedModules.length;
    document.getElementById('stats-quizzes').textContent = Object.keys(state.quizResults).length;
    document.getElementById('stats-badges').textContent = state.earnedBadges.length;

    // Calculate overall progress
    const totalModules = Object.values(curricula).reduce((total, curriculum) => {
      return total + Object.values(curriculum.levels).reduce((levelTotal, level) => {
        return levelTotal + level.modules.length;
      }, 0);
    }, 0);
    const overallProgress = Math.round((state.completedModules.length / totalModules) * 100);
    document.getElementById('stats-progress').textContent = `${overallProgress}%`;

    // Update recent activities
    this.updateRecentActivities();
  },

  updateRecentActivities() {
    const activityList = document.querySelector('.activity-list');
    if (state.activities.length === 0) {
      activityList.innerHTML = '<p class="no-activity">Belum ada aktivitas. Mulai pembelajaran untuk melihat progress Anda!</p>';
      return;
    }

    activityList.innerHTML = '';
    state.activities.slice(-5).reverse().forEach(activity => {
      const activityItem = document.createElement('div');
      activityItem.className = 'activity-item';
      activityItem.textContent = activity;
      activityList.appendChild(activityItem);
    });
  },

  addActivity(activity) {
    const timestamp = new Date().toLocaleString('id-ID');
    state.activities.push(`${timestamp} - ${activity}`);
    this.updateRecentActivities();
  },

  updateProgressView() {
    // Update level progress for DevOps
    const devopsBasicModules = curricula.devops.levels.basic.modules.map(m => m.id);
    const devopsIntermediateModules = curricula.devops.levels.intermediate.modules.map(m => m.id);
    const devopsAdvancedModules = curricula.devops.levels.advanced.modules.map(m => m.id);

    const devopsBasicProgress = this.calculateProgress(devopsBasicModules);
    const devopsIntermediateProgress = this.calculateProgress(devopsIntermediateModules);
    const devopsAdvancedProgress = this.calculateProgress(devopsAdvancedModules);

    document.getElementById('devops-basic-progress').style.width = `${devopsBasicProgress}%`;
    document.getElementById('devops-basic-percent').textContent = `${devopsBasicProgress}%`;
    document.getElementById('devops-intermediate-progress').style.width = `${devopsIntermediateProgress}%`;
    document.getElementById('devops-intermediate-percent').textContent = `${devopsIntermediateProgress}%`;
    document.getElementById('devops-advanced-progress').style.width = `${devopsAdvancedProgress}%`;
    document.getElementById('devops-advanced-percent').textContent = `${devopsAdvancedProgress}%`;

    // Update level progress for SPBE
    const spbeBasicModules = curricula.spbe.levels.basic.modules.map(m => m.id);
    const spbeIntermediateModules = curricula.spbe.levels.intermediate.modules.map(m => m.id);
    const spbeAdvancedModules = curricula.spbe.levels.advanced.modules.map(m => m.id);

    const spbeBasicProgress = this.calculateProgress(spbeBasicModules);
    const spbeIntermediateProgress = this.calculateProgress(spbeIntermediateModules);
    const spbeAdvancedProgress = this.calculateProgress(spbeAdvancedModules);

    document.getElementById('spbe-basic-progress').style.width = `${spbeBasicProgress}%`;
    document.getElementById('spbe-basic-percent').textContent = `${spbeBasicProgress}%`;
    document.getElementById('spbe-intermediate-progress').style.width = `${spbeIntermediateProgress}%`;
    document.getElementById('spbe-intermediate-percent').textContent = `${spbeIntermediateProgress}%`;
    document.getElementById('spbe-advanced-progress').style.width = `${spbeAdvancedProgress}%`;
    document.getElementById('spbe-advanced-percent').textContent = `${spbeAdvancedProgress}%`;

    // Update badges
    this.updateBadgesGrid();

    // Update recommendations
    this.updateRecommendations();
  },

  calculateProgress(moduleIds) {
    const completed = moduleIds.filter(id => state.completedModules.includes(id)).length;
    return Math.round((completed / moduleIds.length) * 100);
  },

  updateBadgesGrid() {
    const badgesGrid = document.getElementById('badges-grid');
    badgesGrid.innerHTML = '';

    Object.keys(badges).forEach(badgeKey => {
      const badge = badges[badgeKey];
      const isEarned = state.earnedBadges.includes(badgeKey);

      const badgeItem = document.createElement('div');
      badgeItem.className = `badge-item ${isEarned ? 'earned' : 'locked'}`;
      badgeItem.innerHTML = `
        <div class="badge-icon">${isEarned ? badge.icon : '🔒'}</div>
        <div class="badge-name">${badge.name}</div>
        <div class="badge-description">${badge.description}</div>
      `;

      if (isEarned) {
        badgeItem.onclick = () => {
          const curriculumName = badgeKey.startsWith('devops') ? 'DevOps Engineer' : 'Penggiat SPBE';
          const level = badgeKey.includes('basic') ? 'Basic' : badgeKey.includes('intermediate') ? 'Intermediate' : 'Advanced/Professional';
          this.showCertificate(`${curriculumName} - ${level}`, badgeKey);
        };
        badgeItem.style.cursor = 'pointer';
      }

      badgesGrid.appendChild(badgeItem);
    });
  },

  updateRecommendations() {
    const recommendationsDiv = document.getElementById('recommendations');
    recommendationsDiv.innerHTML = '';

    // Find next module to complete
    let recommendations = [];

    Object.keys(curricula).forEach(curriculumKey => {
      const curriculum = curricula[curriculumKey];
      Object.keys(curriculum.levels).forEach(levelKey => {
        const level = curriculum.levels[levelKey];
        level.modules.forEach(module => {
          if (!state.completedModules.includes(module.id)) {
            recommendations.push({
              curriculum: curriculum.name,
              module: module.title,
              level: level.name,
              curriculumKey,
              levelKey,
              moduleId: module.id
            });
          }
        });
      });
    });

    if (recommendations.length === 0) {
      recommendationsDiv.innerHTML = '<p>🎉 Selamat! Anda telah menyelesaikan semua modul!</p>';
      return;
    }

    recommendations.slice(0, 3).forEach(rec => {
      const recItem = document.createElement('div');
      recItem.className = 'recommendation-item';
      recItem.innerHTML = `
        <strong>${rec.module}</strong>
        <p style="margin: 4px 0; font-size: 12px; color: var(--color-text-secondary);">${rec.curriculum} - ${rec.level}</p>
        <button class="btn btn--primary" style="margin-top: 8px;" onclick="app.openModule('${rec.curriculumKey}', '${rec.levelKey}', '${rec.moduleId}')">Mulai Modul</button>
      `;
      recommendationsDiv.appendChild(recItem);
    });
  }
};

// Initialize app when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => app.init());
} else {
  app.init();
}