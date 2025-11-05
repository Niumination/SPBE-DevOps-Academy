-- Sample Data for SPBE DevOps Academy
-- This file contains sample curriculum data for testing and development
-- Fixed: Array to JSONB conversion

-- Insert curriculum levels
INSERT INTO curriculum_levels (curriculum_id, code, name, description, duration, sort_order) 
SELECT 
    c.id,
    cl.code,
    cl.name,
    cl.description,
    cl.duration,
    cl.sort_order
FROM (
    VALUES 
        -- DevOps levels
        ('devops', 'basic', 'Basic (Operator)', 'Level dasar untuk operator DevOps', '2-3 bulan', 1),
        ('devops', 'intermediate', 'Intermediate (Implementor)', 'Level menengah untuk implementor DevOps', '4-6 bulan', 2),
        ('devops', 'advanced', 'Advanced/Professional', 'Level lanjutan untuk profesional DevOps', '6-12 bulan', 3),
        -- SPBE levels
        ('spbe', 'basic', 'Basic (Familiarization)', 'Level dasar untuk familiarisasi SPBE', '1-2 bulan', 1),
        ('spbe', 'intermediate', 'Intermediate (Audit & Mapping)', 'Level menengah untuk audit dan mapping SPBE', '3-4 bulan', 2),
        ('spbe', 'advanced', 'Advanced/Professional', 'Level lanjutan untuk profesional SPBE', '4-6 bulan', 3)
) AS cl(curriculum_code, code, name, description, duration, sort_order)
JOIN curricula c ON c.code = cl.curriculum_code;

-- Insert modules for DevOps curriculum
INSERT INTO modules (level_id, code, title, description, project_description, duration, tools, sort_order)
SELECT 
    cl.id,
    m.code,
    m.title,
    m.description,
    m.project_description,
    m.duration,
    m.tools::jsonb,
    m.sort_order
FROM (
    VALUES 
        -- DevOps Basic Modules
        ('devops', 'basic', 'dp-b-1', 'Linux CLI Dasar', 'Perintah CLI dasar, manajemen file, dan permission', 'Setup lab virtual dengan 3 VM untuk sandbox pengembangan aplikasi SPBE', '4 jam', '["Ubuntu Server 22.04 LTS", "SSH Client (PuTTY/MobaXterm)", "htop", "systemctl"]', 1),
        ('devops', 'basic', 'dp-b-2', 'Konsep Virtualisasi', 'Pemahaman tentang virtual machine, snapshot, dan backup', 'Konfigurasi sandbox SPBE dengan snapshot VM untuk testing environment', '3 jam', '["VirtualBox", "VMware Player", "Hyper-V"]', 2),
        ('devops', 'basic', 'dp-b-3', 'Pengantar HA & Clustering', 'Konsep failover, redundancy, dan uptime SLA', 'Setup monitoring untuk server SRIKANDI dengan alert CPU/Memory tinggi', '3 jam', '["HAProxy", "Documentation", "Monitoring tools"]', 3),
        
        -- DevOps Intermediate Modules
        ('devops', 'intermediate', 'dp-i-1', 'Administrasi PostgreSQL', 'Instalasi, konfigurasi, backup/restore, user management', 'Implementasi scheduled backup database SRIKANDI dengan retention 30 hari', '6 jam', '["PostgreSQL 15/16", "pgAdmin 4", "pg_dump", "pg_restore"]', 1),
        ('devops', 'intermediate', 'dp-i-2', 'Infrastructure as Code (IaC)', 'Konsep IaC, Ansible playbook, configuration management', 'Membuat Ansible playbook untuk otomasi instalasi dan konfigurasi PostgreSQL', '8 jam', '["Ansible 2.14+", "YAML", "GitHub/GitLab"]', 2),
        ('devops', 'intermediate', 'dp-i-3', 'Git & Version Control', 'Git basics, branching, kolaborasi tim', 'Setup repository GitHub untuk dokumentasi SOP dan script tim IT Diskominfo', '4 jam', '["Git", "GitHub", "GitLab"]', 3),
        
        -- DevOps Advanced Modules
        ('devops', 'advanced', 'dp-a-1', 'Database Clustering & HA', 'PostgreSQL Streaming Replication, Patroni, HAProxy', 'Implementasi PostgreSQL HA Cluster untuk SRIKANDI dengan auto-failover', '16 jam', '["Patroni", "etcd", "HAProxy", "pgpool-II"]', 1),
        ('devops', 'advanced', 'dp-a-2', 'CI/CD Pipeline', 'Jenkins, GitLab CI, automation deployment', 'Setup CI/CD pipeline untuk automated deployment aplikasi SPBE', '12 jam', '["Jenkins", "GitLab CI", "Docker", "Git"]', 2),
        ('devops', 'advanced', 'dp-a-3', 'Docker & Containerization', 'Docker images, containers, Docker Compose', 'Containerize 1-2 aplikasi web SPBE untuk portability', '10 jam', '["Docker", "Docker Compose", "Docker Registry"]', 3),
        ('devops', 'advanced', 'dp-a-4', 'Monitoring dengan Prometheus & Grafana', 'Metrics collection, dashboards, alerting', 'Setup dashboard monitoring untuk semua database server SPBE Aceh Tengah', '12 jam', '["Prometheus", "Grafana", "postgres_exporter"]', 4)
) AS m(curriculum_code, level_code, code, title, description, project_description, duration, tools, sort_order)
JOIN curricula c ON c.code = m.curriculum_code
JOIN curriculum_levels cl ON cl.curriculum_id = c.id AND cl.code = m.level_code;

-- Insert modules for SPBE curriculum
INSERT INTO modules (level_id, code, title, description, project_description, duration, tools, sort_order)
SELECT 
    cl.id,
    m.code,
    m.title,
    m.description,
    m.project_description,
    m.duration,
    m.tools::jsonb,
    m.sort_order
FROM (
    VALUES 
        -- SPBE Basic Modules
        ('spbe', 'basic', 'sb-b-1', 'Perpres 95/2018 & Regulasi SPBE', 'Pemahaman regulasi SPBE, Perpres 95/2018, Permen PANRB', 'Menyusun checklist bukti dukung untuk Domain Infrastruktur SPBE', '4 jam', '["Perpres 95/2018", "Permen PANRB 59/2020", "Portal SPBE Nasional"]', 1),
        ('spbe', 'basic', 'sb-b-2', '8 Domain & 47 Indikator SPBE', 'Struktur 47 indikator penilaian SPBE', 'Membuat infografis atau mind map 47 indikator SPBE untuk sosialisasi internal', '6 jam', '["Portal SPBE Nasional", "Spreadsheet Excel"]', 2),
        ('spbe', 'basic', 'sb-b-3', 'Peran Diskominfo dalam SPBE', 'Fungsi Diskominfo sebagai koordinator SPBE, Tim Koordinasi', 'Melakukan pemetaan jobdesk teknis tim IT ke indikator SPBE', '3 jam', '["Dokumentasi SPBE", "Kerangka kerja SPBE"]', 3),
        
        -- SPBE Intermediate Modules
        ('spbe', 'intermediate', 'sb-i-1', 'Metode Self-Assessment SPBE', 'Teknik pengisian form evaluasi mandiri dan pengumpulan bukti', 'Melakukan self-assessment komprehensif untuk Domain Tata Kelola (10 indikator)', '8 jam', '["Excel/Google Sheets", "Form Assessment", "Zoom/Google Meet"]', 1),
        ('spbe', 'intermediate', 'sb-i-2', 'Teknik Mapping Bukti Dukung', 'Mencocokkan bukti dengan indikator, gap analysis', 'Identifikasi 5 indikator dengan nilai terendah dan analisis akar masalahnya', '8 jam', '["Excel Mapping Template", "Assessment Checklist"]', 2),
        ('spbe', 'intermediate', 'sb-i-3', 'Kriteria Penilaian Interoperabilitas', 'Domain Layanan SPBE, interoperabilitas aplikasi', 'Membuat matriks interoperabilitas aplikasi SPBE di Aceh Tengah', '6 jam', '["Portal Evaluasi SPBE", "Dokumentasi Interoperabilitas"]', 3),
        
        -- SPBE Advanced Modules
        ('spbe', 'advanced', 'sb-a-1', 'Strategi Peningkatan Nilai Indeks', 'Konsolidasi data center, peningkatan interoperabilitas, keamanan siber', 'Menyusun proposal teknis implementasi HA Database sebagai peningkatan indeks SPBE', '10 jam', '["Roadmap SPBE Nasional", "SWOT Analysis"]', 1),
        ('spbe', 'advanced', 'sb-a-2', 'Penyusunan Peta Rencana SPBE', 'Roadmap SPBE 5 tahun selaras dengan RPJMD', 'Menyusun Peta Rencana SPBE Kabupaten Aceh Tengah 2025-2029', '16 jam', '["Microsoft Project", "PowerPoint", "Gantt Chart"]', 2),
        ('spbe', 'advanced', 'sb-a-3', 'Arsitektur SPBE (As-is & To-be)', 'Enterprise Architecture, dokumentasi arsitektur sistem', 'Menyusun dokumentasi Arsitektur SPBE Aceh Tengah (as-is dan to-be)', '12 jam', '["TOGAF", "Visio/Draw.io", "Enterprise Architecture Tools"]', 3),
        ('spbe', 'advanced', 'sb-a-4', 'Presentasi Eksekutif & Storytelling', 'Teknik presentasi, data visualization, stakeholder engagement', 'Membuat presentasi hasil evaluasi SPBE untuk Bupati/Sekda', '8 jam', '["PowerPoint", "Canva", "Data Visualization Tools"]', 4)
) AS m(curriculum_code, level_code, code, title, description, project_description, duration, tools, sort_order)
JOIN curricula c ON c.code = m.curriculum_code
JOIN curriculum_levels cl ON cl.curriculum_id = c.id AND cl.code = m.level_code;

-- Insert sample quiz questions for some modules
INSERT INTO quiz_questions (module_id, question, options, correct_answer, explanation, sort_order)
SELECT 
    m.id,
    q.question,
    q.options::jsonb,
    q.correct_answer,
    q.explanation,
    q.sort_order
FROM (
    VALUES 
        -- Linux CLI Quiz
        ('dp-b-1', 'Perintah mana yang digunakan untuk melihat permission file di Linux?', '["ls -la", "cat", "pwd", "mkdir"]', 0, 'Perintah ''ls -la'' menampilkan daftar file dengan permission details', 1),
        ('dp-b-1', 'Bagaimana cara memberikan permission execute ke owner pada file?', '["chmod 755", "chmod 644", "chmod 777", "chmod 444"]', 0, 'chmod 755 memberikan rwx ke owner, rx ke group dan others', 2),
        
        -- Virtualization Quiz
        ('dp-b-2', 'Apa keuntungan utama menggunakan snapshot VM?', '["Menghemat storage", "Dapat kembali ke state sebelumnya dengan cepat", "Meningkatkan performa VM", "Mengurangi konsumsi RAM"]', 1, 'Snapshot memungkinkan kita untuk save dan restore state VM secara cepat', 1),
        
        -- HA & Clustering Quiz
        ('dp-b-3', 'Apa itu High Availability (HA)?', '["Kecepatan server tinggi", "Kemampuan sistem tetap beroperasi saat ada kegagalan", "Storage yang besar", "Network yang cepat"]', 1, 'HA adalah kemampuan sistem untuk tetap operasional bahkan saat terjadi kegagalan komponen', 1),
        
        -- PostgreSQL Quiz
        ('dp-i-1', 'Command mana yang digunakan untuk backup database PostgreSQL?', '["pg_dump", "pg_restore", "psql", "createdb"]', 0, 'pg_dump adalah utility untuk membuat backup database PostgreSQL', 1),
        
        -- IaC Quiz
        ('dp-i-2', 'Apa keuntungan menggunakan Infrastructure as Code?', '["Dokumentasi otomatis", "Reproducible dan versionable", "Lebih murah", "Lebih cepat dari manual"]', 1, 'IaC memungkinkan konfigurasi infrastruktur yang dapat direproduksi dan di-version control', 1),
        
        -- Git Quiz
        ('dp-i-3', 'Apa perbedaan antara git clone dan git pull?', '["Tidak ada perbedaan", "Clone mengunduh repo baru, pull update repo yang sudah ada", "Clone lebih cepat", "Pull mengunduh repo baru"]', 1, 'Clone adalah download repository pertama kali, pull adalah update repository yang sudah ada', 1),
        
        -- SPBE Regulation Quiz
        ('sb-b-1', 'Berapa banyak domain dalam SPBE?', '["2 domain", "4 domain", "6 domain", "8 domain"]', 1, 'SPBE memiliki 4 domain utama: Kebijakan, Tata Kelola, Manajemen, dan Layanan', 1),
        
        -- SPBE Indicators Quiz
        ('sb-b-2', 'Indikator SPBE dikelompokkan ke dalam berapa aspek?', '["4 aspek", "6 aspek", "8 aspek", "10 aspek"]', 2, '47 indikator SPBE dikelompokkan ke dalam 8 aspek/kategori penilaian', 1),
        
        -- SPBE Role Quiz
        ('sb-b-3', 'Siapa yang menjadi koordinator SPBE di tingkat Pemda?', '["OPD Teknis", "Diskominfo/Dinas TI", "Bagian Organisasi", "Kepala Daerah"]', 1, 'Diskominfo atau Dinas Komunikasi dan Informatika adalah koordinator utama SPBE di Pemda', 1)
) AS q(module_code, question, options, correct_answer, explanation, sort_order)
JOIN modules m ON m.code = q.module_code;