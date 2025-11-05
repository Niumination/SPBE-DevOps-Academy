// Progress Tracking System for SPBE DevOps Academy
class ProgressManager {
  constructor() {
    this.supabase = null;
    this.currentUser = null;
    this.progressCache = new Map();
    this.isInitialized = false;
  }

  async initialize() {
    if (this.isInitialized) return;
    
    try {
      // Get Supabase instance
      if (window.SupabaseConfig) {
        this.supabase = window.SupabaseConfig.initializeSupabase();
      }

      // Wait for auth to be ready
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
      console.error('Progress manager initialization error:', error);
      this.initializeFallback();
    }
  }

  // Progress tracking methods
  async trackModuleProgress(curriculumId, levelId, moduleId, progress = {}) {
    try {
      if (!this.currentUser) {
        throw new Error('User not authenticated');
      }

      const progressData = {
        user_id: this.currentUser.id,
        curriculum_id: curriculumId,
        level_id: levelId,
        module_id: moduleId,
        ...progress,
        updated_at: new Date().toISOString()
      };

      let result;
      if (this.supabase) {
        // Use Supabase
        result = await this.supabase
          .from('user_progress')
          .upsert(progressData, {
            onConflict: 'user_id,curriculum_id,level_id,module_id'
          })
          .select()
          .single();
      } else {
        // Fallback to localStorage
        result = await this.fallbackTrackProgress(progressData);
      }

      if (result.error) throw result.error;

      // Update cache
      const cacheKey = `${curriculumId}-${levelId}-${moduleId}`;
      this.progressCache.set(cacheKey, result.data);

      // Log activity
      await this.logActivity('MODULE_PROGRESS', `Progress modul ${moduleId}`, {
        curriculum_id: curriculumId,
        level_id: levelId,
        module_id: moduleId,
        progress: progress
      });

      return { success: true, data: result.data };
    } catch (error) {
      console.error('Error tracking progress:', error);
      return { success: false, error };
    }
  }

  async markModuleComplete(curriculumId, levelId, moduleId) {
    return await this.trackModuleProgress(curriculumId, levelId, moduleId, {
      completed: true,
      completion_date: new Date().toISOString()
    });
  }

  async getModuleProgress(curriculumId, levelId, moduleId) {
    try {
      const cacheKey = `${curriculumId}-${levelId}-${moduleId}`;
      
      // Check cache first
      if (this.progressCache.has(cacheKey)) {
        return { success: true, data: this.progressCache.get(cacheKey) };
      }

      if (!this.currentUser) {
        return { success: false, error: 'User not authenticated' };
      }

      let result;
      if (this.supabase) {
        result = await this.supabase
          .from('user_progress')
          .select('*')
          .eq('user_id', this.currentUser.id)
          .eq('curriculum_id', curriculumId)
          .eq('level_id', levelId)
          .eq('module_id', moduleId)
          .single();
      } else {
        result = await this.fallbackGetProgress(curriculumId, levelId, moduleId);
      }

      if (result.error && result.error.code !== 'PGRST116') { // Not found
        throw result.error;
      }

      // Cache the result
      if (result.data) {
        this.progressCache.set(cacheKey, result.data);
      }

      return { success: true, data: result.data };
    } catch (error) {
      console.error('Error getting module progress:', error);
      return { success: false, error };
    }
  }

  async getAllProgress() {
    try {
      if (!this.currentUser) {
        return { success: false, error: 'User not authenticated' };
      }

      let result;
      if (this.supabase) {
        result = await this.supabase
          .from('user_progress')
          .select('*')
          .eq('user_id', this.currentUser.id)
          .order('updated_at', { ascending: false });
      } else {
        result = await this.fallbackGetAllProgress();
      }

      if (result.error) throw result.error;

      // Update cache
      result.data.forEach(progress => {
        const cacheKey = `${progress.curriculum_id}-${progress.level_id}-${progress.module_id}`;
        this.progressCache.set(cacheKey, progress);
      });

      return { success: true, data: result.data || [] };
    } catch (error) {
      console.error('Error getting all progress:', error);
      return { success: false, error };
    }
  }

  async getCurriculumProgress(curriculumId) {
    try {
      const allProgress = await this.getAllProgress();
      if (!allProgress.success) return allProgress;

      const curriculumProgress = allProgress.data.filter(
        progress => progress.curriculum_id === curriculumId
      );

      return { success: true, data: curriculumProgress };
    } catch (error) {
      console.error('Error getting curriculum progress:', error);
      return { success: false, error };
    }
  }

  async getLevelProgress(curriculumId, levelId) {
    try {
      const allProgress = await this.getAllProgress();
      if (!allProgress.success) return allProgress;

      const levelProgress = allProgress.data.filter(
        progress => progress.curriculum_id === curriculumId && progress.level_id === levelId
      );

      return { success: true, data: levelProgress };
    } catch (error) {
      console.error('Error getting level progress:', error);
      return { success: false, error };
    }
  }

  // Video progress methods
  async trackVideoProgress(moduleId, videoIndex, currentTime, progressPercent) {
    try {
      if (!this.currentUser) {
        throw new Error('User not authenticated');
      }

      const progressData = {
        user_id: this.currentUser.id,
        module_id: moduleId,
        video_index: videoIndex,
        current_time: currentTime,
        progress_percent: progressPercent,
        last_watched: new Date().toISOString()
      };

      // Save to localStorage for now (can be extended to database later)
      const videoProgress = JSON.parse(localStorage.getItem('videoProgress') || '{}');
      const key = `${moduleId}_${videoIndex}`;
      videoProgress[key] = progressData;
      localStorage.setItem('videoProgress', JSON.stringify(videoProgress));

      return { success: true, data: progressData };
    } catch (error) {
      console.error('Error tracking video progress:', error);
      return { success: false, error };
    }
  }

  async markVideoCompleted(moduleId, videoIndex) {
    try {
      if (!this.currentUser) {
        throw new Error('User not authenticated');
      }

      const completionData = {
        user_id: this.currentUser.id,
        module_id: moduleId,
        video_index: videoIndex,
        completed_at: new Date().toISOString()
      };

      // Save to localStorage
      const videoCompletions = JSON.parse(localStorage.getItem('videoCompletions') || '{}');
      const key = `${moduleId}_${videoIndex}`;
      videoCompletions[key] = completionData;
      localStorage.setItem('videoCompletions', JSON.stringify(videoCompletions));

      // Log activity
      await this.logActivity('VIDEO_COMPLETED', `Video selesai untuk modul ${moduleId}`, {
        module_id: moduleId,
        video_index: videoIndex
      });

      return { success: true, data: completionData };
    } catch (error) {
      console.error('Error marking video completed:', error);
      return { success: false, error };
    }
  }

  async getVideoProgress(moduleId, videoIndex) {
    try {
      const videoProgress = JSON.parse(localStorage.getItem('videoProgress') || '{}');
      const key = `${moduleId}_${videoIndex}`;
      return videoProgress[key] || null;
    } catch (error) {
      console.error('Error getting video progress:', error);
      return null;
    }
  }

  async isVideoCompleted(moduleId, videoIndex) {
    try {
      const videoCompletions = JSON.parse(localStorage.getItem('videoCompletions') || '{}');
      const key = `${moduleId}_${videoIndex}`;
      return !!videoCompletions[key];
    } catch (error) {
      console.error('Error checking video completion:', error);
      return false;
    }
  }

  // Quiz progress methods
  async saveQuizResult(moduleId, quizResult) {
    try {
      if (!this.currentUser) {
        throw new Error('User not authenticated');
      }

      const quizData = {
        user_id: this.currentUser.id,
        module_id: moduleId,
        score: quizResult.score,
        total_questions: quizResult.totalQuestions,
        correct_answers: quizResult.correctAnswers,
        answers: quizResult.answers,
        completion_date: new Date().toISOString()
      };

      let result;
      if (this.supabase) {
        result = await this.supabase
          .from('quiz_results')
          .insert(quizData)
          .select()
          .single();
      } else {
        result = await this.fallbackSaveQuizResult(quizData);
      }

      if (result.error) throw result.error;

      // Log activity
      await this.logActivity('QUIZ_COMPLETED', `Quiz selesai untuk modul ${moduleId}`, {
        module_id: moduleId,
        score: quizResult.score,
        total_questions: quizResult.totalQuestions
      });

      return { success: true, data: result.data };
    } catch (error) {
      console.error('Error saving quiz result:', error);
      return { success: false, error };
    }
  }

  async getQuizResults(moduleId = null) {
    try {
      if (!this.currentUser) {
        return { success: false, error: 'User not authenticated' };
      }

      let query;
      if (this.supabase) {
        query = this.supabase
          .from('quiz_results')
          .select('*')
          .eq('user_id', this.currentUser.id)
          .order('completion_date', { ascending: false });

        if (moduleId) {
          query = query.eq('module_id', moduleId);
        }

        const result = await query;
        return { success: true, data: result.data || [] };
      } else {
        return await this.fallbackGetQuizResults(moduleId);
      }
    } catch (error) {
      console.error('Error getting quiz results:', error);
      return { success: false, error };
    }
  }

  // Statistics methods
  async getOverallStats() {
    try {
      const allProgress = await this.getAllProgress();
      if (!allProgress.success) return allProgress;

      const quizResults = await this.getQuizResults();
      if (!quizResults.success) return quizResults;

      const stats = {
        totalModules: allProgress.data.length,
        completedModules: allProgress.data.filter(p => p.completed).length,
        totalQuizzes: quizResults.data.length,
        averageScore: quizResults.data.length > 0 
          ? Math.round(quizResults.data.reduce((sum, q) => sum + q.score, 0) / quizResults.data.length)
          : 0,
        studyTime: this.calculateStudyTime(allProgress.data),
        streakDays: await this.calculateStreak(),
        lastActivity: this.getLastActivity(allProgress.data, quizResults.data)
      };

      return { success: true, data: stats };
    } catch (error) {
      console.error('Error getting overall stats:', error);
      return { success: false, error };
    }
  }

  async getCurriculumStats(curriculumId) {
    try {
      const curriculumProgress = await this.getCurriculumProgress(curriculumId);
      if (!curriculumProgress.success) return curriculumProgress;

      const quizResults = await this.getQuizResults();
      if (!quizResults.success) return quizResults;

      // Get curriculum modules from global data
      const curriculum = window.curricula?.[curriculumId];
      if (!curriculum) {
        return { success: false, error: 'Curriculum not found' };
      }

      const totalModules = Object.values(curriculum.levels)
        .reduce((total, level) => total + level.modules.length, 0);

      const completedModules = curriculumProgress.data.filter(p => p.completed).length;
      const curriculumQuizResults = quizResults.data.filter(q => {
        // Check if quiz result belongs to this curriculum
        return curriculumProgress.data.some(p => 
          p.module_id === q.module_id && p.completed
        );
      });

      const stats = {
        totalModules,
        completedModules,
        progressPercentage: Math.round((completedModules / totalModules) * 100),
        totalQuizzes: curriculumQuizResults.length,
        averageScore: curriculumQuizResults.length > 0
          ? Math.round(curriculumQuizResults.reduce((sum, q) => sum + q.score, 0) / curriculumQuizResults.length)
          : 0,
        levels: await this.getLevelStats(curriculumId)
      };

      return { success: true, data: stats };
    } catch (error) {
      console.error('Error getting curriculum stats:', error);
      return { success: false, error };
    }
  }

  async getLevelStats(curriculumId) {
    try {
      const curriculum = window.curricula?.[curriculumId];
      if (!curriculum) {
        return { success: false, error: 'Curriculum not found' };
      }

      const levelStats = {};
      
      for (const [levelId, level] of Object.entries(curriculum.levels)) {
        const levelProgress = await this.getLevelProgress(curriculumId, levelId);
        if (levelProgress.success) {
          const completedModules = levelProgress.data.filter(p => p.completed).length;
          const totalModules = level.modules.length;
          
          levelStats[levelId] = {
            name: level.name,
            totalModules,
            completedModules,
            progressPercentage: Math.round((completedModules / totalModules) * 100),
            isCompleted: completedModules === totalModules
          };
        }
      }

      return { success: true, data: levelStats };
    } catch (error) {
      console.error('Error getting level stats:', error);
      return { success: false, error };
    }
  }

  // Helper methods
  calculateStudyTime(progressData) {
    // This is a simplified calculation
    // In a real implementation, you'd track actual time spent
    const completedModules = progressData.filter(p => p.completed);
    return completedModules.length * 30; // Assume 30 minutes per module
  }

  async calculateStreak() {
    // Simplified streak calculation
    // In a real implementation, you'd track daily activity
    return 1; // Default streak
  }

  getLastActivity(progressData, quizResults) {
    const allActivities = [
      ...progressData.map(p => ({ date: p.updated_at, type: 'progress' })),
      ...quizResults.map(q => ({ date: q.completion_date, type: 'quiz' }))
    ];

    if (allActivities.length === 0) return null;

    const latestActivity = allActivities.reduce((latest, activity) => {
      return new Date(activity.date) > new Date(latest.date) ? activity : latest;
    });

    return latestActivity;
  }

  async logActivity(activityType, description, metadata = {}) {
    if (window.authManager) {
      await window.authManager.logActivity(activityType, description, metadata);
    }
  }

  // Fallback methods for development
  initializeFallback() {
    // Initialize with localStorage
    const storedProgress = localStorage.getItem('spbe_progress');
    if (storedProgress) {
      try {
        const progress = JSON.parse(storedProgress);
        progress.forEach(p => {
          const cacheKey = `${p.curriculum_id}-${p.level_id}-${p.module_id}`;
          this.progressCache.set(cacheKey, p);
        });
      } catch (error) {
        console.error('Error parsing stored progress:', error);
      }
    }
  }

  async fallbackTrackProgress(progressData) {
    const stored = localStorage.getItem('spbe_progress') || '[]';
    const progress = JSON.parse(stored);
    
    const existingIndex = progress.findIndex(p => 
      p.user_id === progressData.user_id &&
      p.curriculum_id === progressData.curriculum_id &&
      p.level_id === progressData.level_id &&
      p.module_id === progressData.module_id
    );

    if (existingIndex >= 0) {
      progress[existingIndex] = { ...progress[existingIndex], ...progressData };
    } else {
      progress.push({ ...progressData, id: Date.now().toString() });
    }

    localStorage.setItem('spbe_progress', JSON.stringify(progress));
    
    const newProgress = progress.find(p => 
      p.curriculum_id === progressData.curriculum_id &&
      p.level_id === progressData.level_id &&
      p.module_id === progressData.module_id
    );

    return { data: newProgress };
  }

  async fallbackGetProgress(curriculumId, levelId, moduleId) {
    const stored = localStorage.getItem('spbe_progress') || '[]';
    const progress = JSON.parse(stored);
    
    const found = progress.find(p => 
      p.curriculum_id === curriculumId &&
      p.level_id === levelId &&
      p.module_id === moduleId
    );

    return { data: found || null };
  }

  async fallbackGetAllProgress() {
    const stored = localStorage.getItem('spbe_progress') || '[]';
    return { data: JSON.parse(stored) };
  }

  async fallbackSaveQuizResult(quizData) {
    const stored = localStorage.getItem('spbe_quiz_results') || '[]';
    const results = JSON.parse(stored);
    
    const newResult = { ...quizData, id: Date.now().toString() };
    results.push(newResult);
    
    localStorage.setItem('spbe_quiz_results', JSON.stringify(results));
    return { data: newResult };
  }

  async fallbackGetQuizResults(moduleId = null) {
    const stored = localStorage.getItem('spbe_quiz_results') || '[]';
    const results = JSON.parse(stored);
    
    const filtered = moduleId 
      ? results.filter(r => r.module_id === moduleId)
      : results;
    
    return { data: filtered };
  }

  // Public methods
  async refreshProgress() {
    this.progressCache.clear();
    return await this.getAllProgress();
  }

  clearCache() {
    this.progressCache.clear();
  }

  // Activity tracking methods
  async trackActivity(activityType, description, metadata = {}) {
    try {
      if (!this.currentUser) {
        throw new Error('User not authenticated');
      }

      const activityData = {
        user_id: this.currentUser.id,
        activity_type: activityType,
        description,
        metadata,
        created_at: new Date().toISOString()
      };

      // Save to localStorage for now
      const activities = JSON.parse(localStorage.getItem('userActivities') || '[]');
      activities.unshift(activityData); // Add to beginning
      // Keep only last 100 activities
      if (activities.length > 100) {
        activities.splice(100);
      }
      localStorage.setItem('userActivities', JSON.stringify(activities));

      return { success: true, data: activityData };
    } catch (error) {
      console.error('Error tracking activity:', error);
      return { success: false, error };
    }
  }

  async getActivities(limit = 50) {
    try {
      const activities = JSON.parse(localStorage.getItem('userActivities') || '[]');
      return { success: true, data: activities.slice(0, limit) };
    } catch (error) {
      console.error('Error getting activities:', error);
      return { success: false, error };
    }
  }
}

// Create global instance
const progressManager = new ProgressManager();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = progressManager;
} else {
  window.progressManager = progressManager;
}