-- Database Setup Instructions for SPBE DevOps Academy
-- This file provides step-by-step instructions for setting up the database

-- ========================================
-- SETUP INSTRUCTIONS
-- ========================================

-- 1. Create a new Supabase project at https://supabase.com
-- 2. Go to the SQL Editor in your Supabase dashboard
-- 3. Run the migration files in order:
--    - 001_initial_schema.sql
--    - 002_sample_data.sql (optional, for testing)

-- ========================================
-- ENVIRONMENT VARIABLES NEEDED
-- ========================================

-- Add these to your Supabase project settings > Configuration > Environment Variables:

-- VITE_SUPABASE_URL=your_supabase_project_url
-- VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
-- VITE_SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key (for admin operations)

-- ========================================
-- AUTHENTICATION SETUP
-- ========================================

-- 1. Go to Authentication > Settings in Supabase dashboard
-- 2. Configure the following:
--    - Site URL: http://localhost:8000 (for development)
--    - Redirect URLs: http://localhost:8000/** (for development)
--    - Enable Google OAuth provider (optional)
--    - Configure email templates for verification and password reset

-- ========================================
-- STORAGE SETUP
-- ========================================

-- 1. Go to Storage in Supabase dashboard
-- 2. Create buckets:
--    - certificates (for storing generated certificate PDFs)
--    - avatars (for user profile pictures)
-- 3. Set up storage policies for public access to certificates and private access to avatars

-- ========================================
-- ROW LEVEL SECURITY (RLS) NOTES
-- ========================================

-- The schema includes comprehensive RLS policies:
-- - Users can only access their own data (progress, certificates, etc.)
-- - Curriculum data is publicly readable
-- - Admin users (when implemented) will have broader access

-- ========================================
-- TESTING DATA
-- ========================================

-- After running the sample data migration, you'll have:
-- - 2 curricula (DevOps and SPBE)
-- - 6 levels (3 per curriculum)
-- - 14 modules with quiz questions
-- - 6 badges ready to be earned

-- ========================================
-- DEMO ACCOUNT SETUP
-- ========================================

-- The application includes a demo account feature. To create a demo user:

INSERT INTO users (id, email, full_name, role, email_verified) 
VALUES (
    uuid_generate_v4(), 
    'demo@spbe.academy', 
    'Demo User SPBE', 
    'student', 
    TRUE
) ON CONFLICT (email) DO NOTHING;

-- ========================================
-- BACKUP AND MAINTENANCE
-- ========================================

-- Regular maintenance tasks:
-- 1. Set up daily automated backups in Supabase
-- 2. Monitor storage usage for certificates
-- 3. Clean up expired sessions periodically
-- 4. Review activity logs for security monitoring

-- ========================================
-- PERFORMANCE OPTIMIZATION
-- ========================================

-- The schema includes indexes for optimal performance:
-- - User lookups by email
-- - Progress tracking queries
-- - Certificate verification lookups
-- - Activity log queries

-- Consider adding materialized views for complex analytics queries if needed.

-- ========================================
-- SECURITY CONSIDERATIONS
-- ========================================

-- 1. Always use service role key for server-side operations
-- 2. Implement rate limiting for API endpoints
-- 3. Monitor for suspicious activity in logs
-- 4. Regular security audits of user permissions
-- 5. Keep Supabase dependencies updated

-- ========================================
-- SCALABILITY NOTES
-- ========================================

-- The current schema supports:
-- - Unlimited users and certificates
-- - Flexible curriculum structure
-- - Comprehensive activity tracking
-- - Badge and achievement system

-- For large-scale deployments (10,000+ users), consider:
-- - Database read replicas
-- - CDN for certificate PDFs
-- - Caching layer for frequently accessed data
-- - Separate analytics database