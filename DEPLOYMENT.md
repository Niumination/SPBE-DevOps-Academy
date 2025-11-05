# SPBE DevOps Academy - Deployment Guide

## 🚀 Production Deployment

### Prerequisites
- Supabase project with database schema set up
- Domain name (optional)
- Vercel account (for deployment)

### Step 1: Database Setup

1. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create new project
   - Note your project URL and anon key

2. **Run Database Migrations**
   ```sql
   -- Run 001_initial_schema.sql first
   -- Then run 002_sample_data.sql (optional)
   ```

3. **Configure Authentication**
   - Enable Google OAuth (optional)
   - Set site URL to your domain
   - Configure email templates

### Step 2: Environment Configuration

1. **Create Environment Variables**
   ```bash
   # Copy .env.example to .env.production
   cp .env.example .env.production
   ```

2. **Fill in Production Values**
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your_anon_key
   VITE_APP_ENV=production
   VITE_APP_URL=https://your-domain.com
   VITE_ENABLE_DEMO_ACCOUNT=false
   VITE_DEBUG_MODE=false
   ```

### Step 3: Vercel Deployment

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy Project**
   ```bash
   vercel --prod
   ```

4. **Configure Environment Variables in Vercel**
   - Go to Vercel dashboard
   - Project > Settings > Environment Variables
   - Add all VITE_ prefixed variables

### Step 4: Post-Deployment

1. **Test Authentication Flow**
   - User registration
   - Email verification
   - Login/logout
   - Password reset

2. **Test Core Features**
   - Module completion
   - Quiz functionality
   - Certificate generation
   - Progress tracking

3. **Monitor Performance**
   - Check Vercel analytics
   - Monitor Supabase usage
   - Set up error tracking

## 🔧 Development Setup

### Local Development

1. **Clone Repository**
   ```bash
   git clone <repository-url>
   cd spbe-devops-academy
   ```

2. **Install Dependencies**
   ```bash
   # No npm dependencies needed (vanilla JS)
   # Just need a local server
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env.local
   # Fill in your Supabase credentials
   ```

4. **Start Development Server**
   ```bash
   python -m http.server 8000
   # or
   npx serve
   ```

5. **Open Application**
   - Navigate to `http://localhost:8000`
   - Test with demo account: demo@spbe.academy / demo123

## 📊 Monitoring & Analytics

### Vercel Analytics
- Built-in performance metrics
- Visitor analytics
- Error tracking

### Supabase Monitoring
- Database performance
- Authentication events
- API usage

### Custom Analytics (Optional)
```javascript
// Add Google Analytics
VITE_GA_ID=G-XXXXXXXXXX

// Add Plausible Analytics
VITE_PLAUSIBLE_URL=https://plausible.io
```

## 🔒 Security Considerations

### Production Security
1. **Environment Variables**
   - Never commit secrets to git
   - Use Vercel environment variables
   - Rotate keys regularly

2. **Database Security**
   - Enable RLS (Row Level Security)
   - Use service role key server-side only
   - Regular security audits

3. **Application Security**
   - HTTPS enforced
   - Security headers configured
   - Input validation
   - Rate limiting

### Content Security Policy
```javascript
// Additional CSP headers if needed
"Content-Security-Policy": "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
```

## 🔄 CI/CD Pipeline

### GitHub Actions (Optional)
```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## 🐛 Troubleshooting

### Common Issues

1. **Authentication Not Working**
   - Check Supabase URL and keys
   - Verify redirect URLs in Supabase
   - Check environment variables

2. **Database Connection Issues**
   - Verify RLS policies
   - Check service role key permissions
   - Test database connection

3. **Build/Deploy Failures**
   - Check for syntax errors
   - Verify environment variables
   - Check Vercel logs

4. **Performance Issues**
   - Optimize images
   - Enable caching
   - Monitor bundle size

### Debug Mode
```env
VITE_DEBUG_MODE=true
```

### Error Tracking
```javascript
// Add custom error tracking
window.addEventListener('error', (event) => {
  console.error('Application error:', event.error);
  // Send to error tracking service
});
```

## 📈 Scaling Considerations

### Database Scaling
- Read replicas for high traffic
- Connection pooling
- Query optimization

### Application Scaling
- CDN for static assets
- Load balancing
- Caching strategies

### Monitoring Scaling
- Performance monitoring
- Error tracking
- User analytics

## 🆕 Version Updates

### Deployment Process
1. Update version in `package.json`
2. Test changes locally
3. Create pull request
4. Merge to main branch
5. Auto-deploy to production

### Rollback Plan
1. Vercel maintains previous deployments
2. Quick rollback via dashboard
3. Database migrations are versioned

## 📞 Support

### Documentation
- [Supabase Documentation](https://supabase.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Application Code Comments](./)

### Contact
- Technical issues: Create GitHub issue
- Security issues: Private message to maintainers
- Feature requests: GitHub discussions