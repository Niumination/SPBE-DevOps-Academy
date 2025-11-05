-- SPBE DevOps Academy Database Schema
-- Migration Script for Supabase PostgreSQL
-- Created: 2025-11-05

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE user_role AS ENUM ('admin', 'student', 'instructor');
CREATE TYPE certificate_status AS ENUM ('issued', 'revoked', 'expired');
CREATE TYPE activity_type AS ENUM ('login', 'module_start', 'module_complete', 'quiz_start', 'quiz_complete', 'certificate_earned');

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    nip VARCHAR(50), -- Nomor Induk Pegawai
    jabatan VARCHAR(255), -- Jabatan/Posisi
    unit_kerja VARCHAR(255), -- Unit Kerja/Instansi
    role user_role DEFAULT 'student',
    avatar_url TEXT,
    email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_sign_in_at TIMESTAMP WITH TIME ZONE
);

-- User profiles table (additional metadata)
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    phone VARCHAR(20),
    address TEXT,
    province VARCHAR(100),
    regency VARCHAR(100),
    education_level VARCHAR(100),
    experience_years INTEGER DEFAULT 0,
    bio TEXT,
    preferences JSONB DEFAULT '{}', -- User preferences like theme, language, etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Curriculum definitions
CREATE TABLE curricula (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL, -- devops, spbe
    name VARCHAR(255) NOT NULL,
    description TEXT,
    color VARCHAR(7), -- Hex color code
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Levels within curricula
CREATE TABLE curriculum_levels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    curriculum_id UUID REFERENCES curricula(id) ON DELETE CASCADE,
    code VARCHAR(50) NOT NULL, -- basic, intermediate, advanced
    name VARCHAR(255) NOT NULL,
    description TEXT,
    duration VARCHAR(100), -- e.g., "2-3 bulan"
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(curriculum_id, code)
);

-- Modules
CREATE TABLE modules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    level_id UUID REFERENCES curriculum_levels(id) ON DELETE CASCADE,
    code VARCHAR(50) NOT NULL, -- dp-b-1, sb-i-2, etc.
    title VARCHAR(255) NOT NULL,
    description TEXT,
    project_description TEXT, -- Project requirements
    duration VARCHAR(50), -- e.g., "4 jam"
    tools JSONB DEFAULT '[]', -- Array of tools required
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(level_id, code)
);

-- Quiz questions
CREATE TABLE quiz_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    module_id UUID REFERENCES modules(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    options JSONB NOT NULL, -- Array of options
    correct_answer INTEGER NOT NULL, -- Index of correct answer
    explanation TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User progress tracking
CREATE TABLE user_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    module_id UUID REFERENCES modules(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'not_started', -- not_started, in_progress, completed
    completion_percentage INTEGER DEFAULT 0,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    time_spent_minutes INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, module_id)
);

-- Quiz results
CREATE TABLE quiz_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    module_id UUID REFERENCES modules(id) ON DELETE CASCADE,
    score INTEGER NOT NULL, -- 0-100
    correct_answers INTEGER NOT NULL,
    total_questions INTEGER NOT NULL,
    answers JSONB, -- Array of user's answers
    time_taken_minutes INTEGER,
    passed BOOLEAN NOT NULL, -- True if score >= 70
    attempt_number INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Badges
CREATE TABLE badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL, -- devops_basic, spbe_advanced, etc.
    name VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(10), -- Emoji icon
    criteria JSONB, -- Requirements to earn this badge
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User badges (earned badges)
CREATE TABLE user_badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    badge_id UUID REFERENCES badges(id) ON DELETE CASCADE,
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, badge_id)
);

-- Certificates
CREATE TABLE certificates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    badge_id UUID REFERENCES badges(id) ON DELETE CASCADE,
    verification_code VARCHAR(20) UNIQUE NOT NULL,
    course_name VARCHAR(255) NOT NULL,
    recipient_name VARCHAR(255) NOT NULL,
    issued_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status certificate_status DEFAULT 'issued',
    pdf_url TEXT,
    metadata JSONB DEFAULT '{}', -- Additional certificate data
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activity log
CREATE TABLE activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    activity_type activity_type NOT NULL,
    description TEXT,
    metadata JSONB DEFAULT '{}', -- Additional activity data
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sessions (for tracking user sessions)
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_curricula_code ON curricula(code);
CREATE INDEX idx_curriculum_levels_curriculum_id ON curriculum_levels(curriculum_id);
CREATE INDEX idx_modules_level_id ON modules(level_id);
CREATE INDEX idx_modules_code ON modules(code);
CREATE INDEX idx_quiz_questions_module_id ON quiz_questions(module_id);
CREATE INDEX idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX idx_user_progress_module_id ON user_progress(module_id);
CREATE INDEX idx_quiz_results_user_id ON quiz_results(user_id);
CREATE INDEX idx_quiz_results_module_id ON quiz_results(module_id);
CREATE INDEX idx_user_badges_user_id ON user_badges(user_id);
CREATE INDEX idx_certificates_user_id ON certificates(user_id);
CREATE INDEX idx_certificates_verification_code ON certificates(verification_code);
CREATE INDEX idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at);
CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_session_token ON user_sessions(session_token);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_curricula_updated_at BEFORE UPDATE ON curricula FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_curriculum_levels_updated_at BEFORE UPDATE ON curriculum_levels FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_modules_updated_at BEFORE UPDATE ON modules FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_quiz_questions_updated_at BEFORE UPDATE ON quiz_questions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_progress_updated_at BEFORE UPDATE ON user_progress FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_badges_updated_at BEFORE UPDATE ON badges FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_certificates_updated_at BEFORE UPDATE ON certificates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own user profile" ON user_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own user profile" ON user_profiles FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own progress" ON user_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own progress" ON user_progress FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own quiz results" ON quiz_results FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own quiz results" ON quiz_results FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own badges" ON user_badges FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view own certificates" ON certificates FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view own activity logs" ON activity_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own activity logs" ON activity_logs FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own sessions" ON user_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own sessions" ON user_sessions FOR ALL USING (auth.uid() = user_id);

-- Public read access for curriculum data
ALTER TABLE curricula ENABLE ROW LEVEL SECURITY;
ALTER TABLE curriculum_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Curriculum data is publicly readable" ON curricula FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Curriculum levels are publicly readable" ON curriculum_levels FOR SELECT USING (TRUE);
CREATE POLICY "Modules are publicly readable" ON modules FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Quiz questions are publicly readable" ON quiz_questions FOR SELECT USING (TRUE);
CREATE POLICY "Badges are publicly readable" ON badges FOR SELECT USING (is_active = TRUE);

-- Insert initial curriculum data
INSERT INTO curricula (code, name, description, color, sort_order) VALUES
('devops', 'DevOps Engineer', 'Jalur pembelajaran untuk menjadi DevOps Engineer dengan fokus pada database clustering dan high availability', '#2563eb', 1),
('spbe', 'Penggiat Penilaian Indeks SPBE', 'Jalur pembelajaran untuk menjadi penggiat penilaian indeks SPBE dengan fokus pada audit dan improvement', '#059669', 2);

-- Insert initial badges
INSERT INTO badges (code, name, description, icon, criteria) VALUES
('devops_basic', 'DevOps Operator', 'Menyelesaikan Basic Level', '🥉', '{"curriculum": "devops", "level": "basic"}'),
('devops_intermediate', 'DevOps Implementor', 'Menyelesaikan Intermediate Level', '🥈', '{"curriculum": "devops", "level": "intermediate"}'),
('devops_advanced', 'DevOps Architect', 'Menyelesaikan Advanced Level', '🥇', '{"curriculum": "devops", "level": "advanced"}'),
('spbe_basic', 'SPBE Familiarizer', 'Menyelesaikan Basic Level', '🥉', '{"curriculum": "spbe", "level": "basic"}'),
('spbe_intermediate', 'SPBE Auditor', 'Menyelesaikan Intermediate Level', '🥈', '{"curriculum": "spbe", "level": "intermediate"}'),
('spbe_advanced', 'SPBE Strategist', 'Menyelesaikan Advanced Level', '🥇', '{"curriculum": "spbe", "level": "advanced"}');

-- Create function to generate verification codes
CREATE OR REPLACE FUNCTION generate_verification_code()
RETURNS TEXT AS $$
DECLARE
    chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    result TEXT := '';
    i INTEGER;
BEGIN
    FOR i IN 1..8 LOOP
        result := result || SUBSTRING(chars, FLOOR(RANDOM() * LENGTH(chars) + 1)::INTEGER, 1);
    END LOOP;
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Create function to check and award badges
CREATE OR REPLACE FUNCTION check_and_award_badges(
    p_user_id UUID,
    p_curriculum_code VARCHAR
)
RETURNS TABLE(badge_code VARCHAR, badge_name VARCHAR) AS $$
DECLARE
    completed_modules INTEGER;
    total_modules INTEGER;
    badge_record RECORD;
BEGIN
    -- Check each badge for the curriculum
    FOR badge_record IN 
        SELECT b.* FROM badges b 
        WHERE b.criteria->>'curriculum' = p_curriculum_code
    LOOP
        -- Count completed modules for this level
        SELECT COUNT(mp.id) INTO completed_modules
        FROM user_progress mp
        JOIN modules m ON mp.module_id = m.id
        JOIN curriculum_levels cl ON m.level_id = cl.id
        JOIN curricula c ON cl.curriculum_id = c.id
        WHERE mp.user_id = p_user_id 
        AND c.code = p_curriculum_code 
        AND cl.code = badge_record.criteria->>'level'
        AND mp.status = 'completed';
        
        -- Count total modules for this level
        SELECT COUNT(m.id) INTO total_modules
        FROM modules m
        JOIN curriculum_levels cl ON m.level_id = cl.id
        JOIN curricula c ON cl.curriculum_id = c.id
        WHERE c.code = p_curriculum_code 
        AND cl.code = badge_record.criteria->>'level';
        
        -- Award badge if all modules completed
        IF completed_modules = total_modules AND total_modules > 0 THEN
            -- Check if badge not already awarded
            IF NOT EXISTS (
                SELECT 1 FROM user_badges ub 
                WHERE ub.user_id = p_user_id AND ub.badge_id = badge_record.id
            ) THEN
                INSERT INTO user_badges (user_id, badge_id) 
                VALUES (p_user_id, badge_record.id);
                
                badge_code := badge_record.code;
                badge_name := badge_record.name;
                RETURN NEXT;
            END IF;
        END IF;
    END LOOP;
    
    RETURN;
END;
$$ LANGUAGE plpgsql;