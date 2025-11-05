// Supabase Configuration
const SUPABASE_CONFIG = {
  url: process.env.SUPABASE_URL || 'https://your-project.supabase.co',
  anonKey: process.env.SUPABASE_ANON_KEY || 'your-anon-key',
  // For development, you can use these placeholder values
  // In production, these should be set as environment variables
};

// Initialize Supabase client
let supabase;

function initializeSupabase() {
  if (typeof supabase !== 'undefined') {
    return supabase;
  }

  // Check if we're in a browser environment
  if (typeof window !== 'undefined' && window.supabase) {
    supabase = window.supabase;
  } else if (typeof createClient !== 'undefined') {
    supabase = createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
  } else {
    console.warn('Supabase client not available. Using fallback storage.');
    return null;
  }

  return supabase;
}

// Database schema constants
const DB_TABLES = {
  USERS: 'users',
  USER_PROGRESS: 'user_progress',
  QUIZ_RESULTS: 'quiz_results',
  CERTIFICATES: 'certificates',
  ACTIVITIES: 'activities'
};

const DB_SCHEMAS = {
  USERS: `
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    nip TEXT UNIQUE, -- Nomor Induk Pegawai
    jabatan TEXT,
    unit_kerja TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  `,
  USER_PROGRESS: `
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES ${DB_TABLES.USERS}(id) ON DELETE CASCADE,
    curriculum_id TEXT NOT NULL,
    level_id TEXT NOT NULL,
    module_id TEXT NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    completion_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, curriculum_id, level_id, module_id)
  `,
  QUIZ_RESULTS: `
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES ${DB_TABLES.USERS}(id) ON DELETE CASCADE,
    module_id TEXT NOT NULL,
    score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
    total_questions INTEGER NOT NULL,
    correct_answers INTEGER NOT NULL,
    answers JSONB, -- Store user's answers
    completion_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  `,
  CERTIFICATES: `
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES ${DB_TABLES.USERS}(id) ON DELETE CASCADE,
    curriculum_id TEXT NOT NULL,
    level_id TEXT NOT NULL,
    certificate_type TEXT NOT NULL,
    certificate_url TEXT,
    verification_code TEXT UNIQUE NOT NULL,
    issued_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  `,
  ACTIVITIES: `
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES ${DB_TABLES.USERS}(id) ON DELETE CASCADE,
    activity_type TEXT NOT NULL,
    description TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  `
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    SUPABASE_CONFIG,
    DB_TABLES,
    DB_SCHEMAS,
    initializeSupabase
  };
} else {
  window.SupabaseConfig = {
    SUPABASE_CONFIG,
    DB_TABLES,
    DB_SCHEMAS,
    initializeSupabase
  };
}