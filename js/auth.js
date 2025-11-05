// Authentication System for SPBE DevOps Academy
class AuthManager {
  constructor() {
    this.supabase = null;
    this.currentUser = null;
    this.authListeners = [];
    this.isInitialized = false;
  }

  async initialize() {
    if (this.isInitialized) return;
    
    try {
      // Initialize Supabase
      if (window.SupabaseConfig) {
        this.supabase = window.SupabaseConfig.initializeSupabase();
      }

      if (this.supabase) {
        // Set up auth state listener
        this.supabase.auth.onAuthStateChange((event, session) => {
          this.handleAuthStateChange(event, session);
        });

        // Get current session
        const { data: { session } } = await this.supabase.auth.getSession();
        if (session) {
          this.currentUser = session.user;
          await this.loadUserProfile(session.user.id);
        }
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      // Fallback to localStorage for development
      this.initializeFallbackAuth();
    }

    this.isInitialized = true;
  }

  handleAuthStateChange(event, session) {
    this.currentUser = session?.user || null;
    
    // Notify all listeners
    this.authListeners.forEach(listener => {
      listener(event, this.currentUser);
    });

    // Handle specific auth events
    switch (event) {
      case 'SIGNED_IN':
        this.onSignIn(session.user);
        break;
      case 'SIGNED_OUT':
        this.onSignOut();
        break;
      case 'TOKEN_REFRESHED':
        this.onTokenRefreshed(session.user);
        break;
    }
  }

  async onSignIn(user) {
    try {
      // Create or update user profile
      await this.createOrUpdateUserProfile(user);
      
      // Log activity
      await this.logActivity('USER_LOGIN', 'User berhasil login', {
        email: user.email,
        last_sign_in: user.last_sign_in_at
      });

      // Update UI
      this.updateAuthUI(true);
    } catch (error) {
      console.error('Error handling sign in:', error);
    }
  }

  async onSignOut() {
    try {
      // Log activity
      if (this.currentUser) {
        await this.logActivity('USER_LOGOUT', 'User berhasil logout', {
          email: this.currentUser.email
        });
      }

      // Clear local data
      this.currentUser = null;
      this.updateAuthUI(false);
    } catch (error) {
      console.error('Error handling sign out:', error);
    }
  }

  async onTokenRefreshed(user) {
    // Update user data with new token
    this.currentUser = user;
  }

  // Registration methods
  async signUp(email, password, userData = {}) {
    try {
      if (!this.supabase) {
        throw new Error('Supabase not available');
      }

      const { data, error } = await this.supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: userData.fullName || '',
            nip: userData.nip || '',
            jabatan: userData.jabatan || '',
            unit_kerja: userData.unitKerja || ''
          },
          emailRedirectTo: window.SupabaseConfig.SUPABASE_CONFIG.redirectUrl
        }
      });

      if (error) throw error;

      // Show success message
      this.showNotification('Registrasi berhasil! Silakan cek email untuk verifikasi.', 'success');
      
      return { success: true, data };
    } catch (error) {
      console.error('Sign up error:', error);
      this.showNotification(this.getErrorMessage(error), 'error');
      return { success: false, error };
    }
  }

  // Login methods
  async signIn(email, password) {
    try {
      if (!this.supabase) {
        return this.fallbackSignIn(email, password);
      }

      const { data, error } = await this.supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      this.showNotification('Login berhasil!', 'success');
      return { success: true, data };
    } catch (error) {
      console.error('Sign in error:', error);
      this.showNotification(this.getErrorMessage(error), 'error');
      return { success: false, error };
    }
  }

  async signInWithGoogle() {
    try {
      if (!this.supabase) {
        throw new Error('Google sign in not available in fallback mode');
      }

      const { data, error } = await this.supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Google sign in error:', error);
      this.showNotification(this.getErrorMessage(error), 'error');
      return { success: false, error };
    }
  }

  // Sign out
  async signOut() {
    try {
      if (this.supabase) {
        const { error } = await this.supabase.auth.signOut();
        if (error) throw error;
      } else {
        // Fallback sign out
        localStorage.removeItem('spbe_user');
        localStorage.removeItem('spbe_token');
        this.currentUser = null;
        this.updateAuthUI(false);
      }

      this.showNotification('Logout berhasil!', 'success');
      return { success: true };
    } catch (error) {
      console.error('Sign out error:', error);
      this.showNotification(this.getErrorMessage(error), 'error');
      return { success: false, error };
    }
  }

  // Password reset
  async resetPassword(email) {
    try {
      if (!this.supabase) {
        throw new Error('Password reset not available in fallback mode');
      }

      const { data, error } = await this.supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) throw error;

      this.showNotification('Email reset password telah dikirim!', 'success');
      return { success: true, data };
    } catch (error) {
      console.error('Password reset error:', error);
      this.showNotification(this.getErrorMessage(error), 'error');
      return { success: false, error };
    }
  }

  // Update user profile
  async updateProfile(profileData) {
    try {
      if (!this.supabase || !this.currentUser) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await this.supabase
        .from('users')
        .update(profileData)
        .eq('id', this.currentUser.id)
        .select()
        .single();

      if (error) throw error;

      // Also update auth metadata
      const { error: authError } = await this.supabase.auth.updateUser({
        data: profileData
      });

      if (authError) throw authError;

      this.showNotification('Profil berhasil diperbarui!', 'success');
      return { success: true, data };
    } catch (error) {
      console.error('Update profile error:', error);
      this.showNotification(this.getErrorMessage(error), 'error');
      return { success: false, error };
    }
  }

  // Helper methods
  async createOrUpdateUserProfile(user) {
    if (!this.supabase) return;

    const profileData = {
      email: user.email,
      full_name: user.user_metadata?.full_name || user.email?.split('@')[0],
      nip: user.user_metadata?.nip || '',
      jabatan: user.user_metadata?.jabatan || '',
      unit_kerja: user.user_metadata?.unit_kerja || '',
      updated_at: new Date().toISOString()
    };

    // Upsert user profile
    const { data, error } = await this.supabase
      .from('users')
      .upsert(profileData, {
        onConflict: 'email',
        ignoreDuplicates: false
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating user profile:', error);
    }

    return data;
  }

  async loadUserProfile(userId) {
    if (!this.supabase) return;

    try {
      const { data, error } = await this.supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') { // Not found error
        console.error('Error loading user profile:', error);
      }

      return data;
    } catch (error) {
      console.error('Error loading user profile:', error);
      return null;
    }
  }

  async logActivity(activityType, description, metadata = {}) {
    if (!this.supabase || !this.currentUser) return;

    try {
      await this.supabase
        .from('activity_logs')
        .insert({
          user_id: this.currentUser.id,
          activity_type: activityType,
          description,
          metadata
        });
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  }

  // Fallback methods for development
  initializeFallbackAuth() {
    const storedUser = localStorage.getItem('spbe_user');
    if (storedUser) {
      this.currentUser = JSON.parse(storedUser);
      this.updateAuthUI(true);
    }
  }

  fallbackSignIn(email, password) {
    return new Promise((resolve) => {
      // Simple demo authentication
      setTimeout(() => {
        if (email === 'demo@spbe.academy' && password === 'demo123') {
          const user = {
            id: 'demo-user-id',
            email: 'demo@spbe.academy',
            user_metadata: {
              full_name: 'Demo User',
              nip: '123456789',
              jabatan: 'Pranata Komputer',
              unit_kerja: 'Diskominfo Aceh Tengah'
            }
          };
          
          this.currentUser = user;
          localStorage.setItem('spbe_user', JSON.stringify(user));
          this.updateAuthUI(true);
          
          resolve({ success: true, data: { user } });
        } else {
          resolve({ 
            success: false, 
            error: { message: 'Email atau password salah. Gunakan demo@spbe.academy / demo123' } 
          });
        }
      }, 1000);
    });
  }

  // UI methods
  updateAuthUI(isAuthenticated) {
    // Update navigation
    const authButtons = document.getElementById('auth-buttons');
    const userMenu = document.getElementById('user-menu');
    const userName = document.getElementById('user-name');

    if (authButtons && userMenu) {
      if (isAuthenticated && this.currentUser) {
        authButtons.style.display = 'none';
        userMenu.style.display = 'block';
        
        if (userName) {
          userName.textContent = this.currentUser.user_metadata?.full_name || 
                           this.currentUser.email?.split('@')[0] || 
                           'User';
        }
      } else {
        authButtons.style.display = 'flex';
        userMenu.style.display = 'none';
      }
    }

    // Update main app if available
    if (window.app && window.app.updateAuthState) {
      window.app.updateAuthState(isAuthenticated, this.currentUser);
    }
  }

  showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.textContent = message;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 5000);
  }

  getErrorMessage(error) {
    const errorMessages = {
      'Invalid login credentials': 'Email atau password salah',
      'User already registered': 'Email sudah terdaftar',
      'Email not confirmed': 'Email belum diverifikasi',
      'Invalid email': 'Format email tidak valid',
      'Password should be at least 6 characters': 'Password minimal 6 karakter',
      'Network request failed': 'Koneksi internet bermasalah',
      'signup_disabled': 'Registrasi dinonaktifkan',
      'email_address_invalid': 'Format email tidak valid',
      'password_too_short': 'Password terlalu pendek'
    };

    return errorMessages[error.message] || error.message || 'Terjadi kesalahan';
  }

  // Event listeners
  onAuthStateChanged(callback) {
    this.authListeners.push(callback);
    
    // Call immediately with current state
    if (this.isInitialized) {
      callback(this.currentUser ? 'SIGNED_IN' : 'SIGNED_OUT', this.currentUser);
    }
  }

  offAuthStateChanged(callback) {
    const index = this.authListeners.indexOf(callback);
    if (index > -1) {
      this.authListeners.splice(index, 1);
    }
  }

  // Getters
  getCurrentUser() {
    return this.currentUser;
  }

  isAuthenticated() {
    return this.currentUser !== null;
  }

  async getUserProfile() {
    if (!this.currentUser) return null;
    return await this.loadUserProfile(this.currentUser.id);
  }
}

// Create global instance
const authManager = new AuthManager();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = authManager;
} else {
  window.authManager = authManager;
}