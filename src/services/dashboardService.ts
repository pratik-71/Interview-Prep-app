import { BACKEND_CONFIG } from '../config/backend';

export interface DashboardData {
  progress: {
    total_tests: number;
    total_questions: number;
    total_marks: number;
    best_marks: number;
    total_time: number;
    average_score: number;
  };
  recentTests: Array<{
    id: string;
    test_date: string;
    technology: string;
    total_questions: number;
    questions_answered: number;
    total_marks: number;
    max_possible_marks: number;
    percentage_score: number;
    time_spent: number;
  }>;
  technologyPerformance: Array<{
    technology: string;
    tests_taken: number;
    average_score: number;
    best_score: number;
    average_time: number;
    total_questions: number;
  }>;
}

export interface RecentActivity {
  id: string;
  type: 'test' | 'practice' | 'question';
  title: string;
  description: string;
  date: string;
  score?: number;
  technology?: string;
}

class DashboardService {
  private static instance: DashboardService;

  public static getInstance(): DashboardService {
    if (!DashboardService.instance) {
      DashboardService.instance = new DashboardService();
    }
    return DashboardService.instance;
  }

  async getDashboardData(token: string): Promise<DashboardData> {
    try {
      const response = await fetch(`${BACKEND_CONFIG.API_BASE_URL}/analytics/summary`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      throw error;
    }
  }

  async getTestHistory(token: string): Promise<any[]> {
    try {
      const response = await fetch(`${BACKEND_CONFIG.API_BASE_URL}/analytics/test-history`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching test history:', error);
      throw error;
    }
  }

  async getTechnologyPerformance(token: string): Promise<any[]> {
    try {
      const response = await fetch(`${BACKEND_CONFIG.API_BASE_URL}/analytics/technology-performance`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching technology performance:', error);
      throw error;
    }
  }

  formatRecentActivity(data: DashboardData): RecentActivity[] {
    const activities: RecentActivity[] = [];

    // Add recent tests
    data.recentTests.forEach((test, index) => {
      activities.push({
        id: test.id || `test-${index}`,
        type: 'test',
        title: `${test.technology} Test`,
        description: `Scored ${test.percentage_score?.toFixed(1) || 0}% (${test.total_marks || 0}/${test.max_possible_marks || 10} marks)`,
        date: test.test_date,
        score: test.percentage_score,
        technology: test.technology
      });
    });

    // Sort by date (most recent first)
    activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return activities.slice(0, 5); // Return only the 5 most recent activities
  }

  calculateProgressScore(data: DashboardData): number {
    if (!data.progress || data.progress.total_questions === 0) {
      return 0;
    }
    
    // Calculate progress score based on average performance
    const avgScore = data.progress.average_score || 0;
    const completionRate = Math.min(data.progress.total_questions / 50, 1); // Assume 50 questions is full progress
    const timeEfficiency = Math.min(data.progress.total_time / 3600, 1); // 1 hour is good time
    
    // Weighted score: 60% performance, 30% completion, 10% time efficiency
    return Math.round((avgScore * 0.6 + completionRate * 30 + timeEfficiency * 10) * 10) / 10;
  }

  formatTimeSpent(seconds: number): string {
    if (seconds < 60) {
      return `${seconds}s`;
    } else if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60);
      return `${minutes}m`;
    } else {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      return `${hours}h ${minutes}m`;
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else if (diffInHours < 168) { // 7 days
      return `${Math.floor(diffInHours / 24)}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  }
}

export default DashboardService;
