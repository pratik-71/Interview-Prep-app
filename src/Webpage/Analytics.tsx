import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useThemeStore } from '../zustand_store/theme_store';
import { useAuthStore } from '../zustand_store/auth_store';
import { BACKEND_CONFIG } from '../config/backend';
import { gsap } from 'gsap';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  BarElement,
  ArcElement
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface UserProgress {
  id: string;
  user_id: string;
  test_date: string;
  technology: string;
  total_questions: number;
  questions_answered: number;
  total_marks: number;
  max_possible_marks: number;
  percentage_score: number;
  time_spent: number;
}

interface TestResult {
  id: number;
  technology: string;
  total_questions: number;
  questions_answered: number;
  total_marks: number;
  max_possible_marks: number;
  percentage_score: number;
  time_spent: number;
  test_date: string;
}

interface TechnologyPerformance {
  technology: string;
  tests_taken: number;
  average_score: number;
  best_score: number;
  average_time: number;
  total_questions: number;
}

interface AnalyticsData {
  progress: UserProgress | null;
  recentTests: TestResult[];
  technologyPerformance: TechnologyPerformance[];
}

const Analytics: React.FC = () => {
  const { 
    primaryColor, 
    backgroundColor, 
    surfaceColor, 
    textColor, 
    textSecondaryColor,
    borderColor,
    cardColor
  } = useThemeStore();
  
  const { token } = useAuthStore();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'performance' | 'history' | 'insights'>('overview');

  // Refs for animations
  const headerRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<HTMLDivElement>(null);

  // Chart data from real backend analytics
  const performanceChartData = useMemo(() => {
    if (!analytics?.recentTests?.length) return { labels: [], datasets: [] } as any;
    const sorted = [...analytics.recentTests].sort((a, b) => new Date(a.test_date).getTime() - new Date(b.test_date).getTime());
    const labels = sorted.map(t => new Date(t.test_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
    const scores = sorted.map(t => t.percentage_score);
    return {
      labels,
      datasets: [{
        label: 'Performance Score (%)',
        data: scores,
        borderColor: primaryColor,
        backgroundColor: `${primaryColor}20`,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: primaryColor,
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6
      }]
    };
  }, [analytics, primaryColor]);

  const questionsChartData = useMemo(() => {
    if (!analytics?.recentTests?.length) return { labels: [], datasets: [] } as any;
    const sorted = [...analytics.recentTests].sort((a, b) => new Date(a.test_date).getTime() - new Date(b.test_date).getTime());
    const labels = sorted.map(t => new Date(t.test_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
    const answered = sorted.map(t => t.questions_answered);
    return {
      labels,
      datasets: [{
        label: 'Questions Answered',
        data: answered,
        backgroundColor: `${primaryColor}60`,
        borderColor: primaryColor,
        borderWidth: 2,
        borderRadius: 6,
        borderSkipped: false,
      }]
    };
  }, [analytics, primaryColor]);

  const timeChartData = useMemo(() => {
    if (!analytics?.recentTests?.length) return { labels: [], datasets: [] } as any;
    const sorted = [...analytics.recentTests].sort((a, b) => new Date(a.test_date).getTime() - new Date(b.test_date).getTime());
    const labels = sorted.map(t => new Date(t.test_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
    const minutes = sorted.map(t => Math.max(0, Math.round((t.time_spent || 0) / 60)));
    return {
      labels,
      datasets: [{
        label: 'Time Spent (minutes)',
        data: minutes,
        borderColor: '#10B981',
        backgroundColor: '#10B98140',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#10B981',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 4
      }]
    };
  }, [analytics]);

  const skillDistributionData = useMemo(() => {
    const labels = analytics?.technologyPerformance?.map(t => t.technology) || [];
    const data = analytics?.technologyPerformance?.map(t => t.average_score) || [];
    const palette = ['#3B82F6','#10B981','#F59E0B','#EF4444','#8B5CF6','#06B6D4','#14B8A6','#EAB308'];
    const colors = labels.map((_, i) => palette[i % palette.length]);
    return {
      labels,
      datasets: [{
        data,
        backgroundColor: colors,
        borderWidth: 0,
        hoverOffset: 10
      }]
    };
  }, [analytics]);

  // Chart options
  const getLineChartOptions = (title: string) => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        labels: {
          color: textColor,
          font: { size: 12, weight: 'normal' as const },
          padding: 20
        }
      },
      title: {
        display: true,
        text: title,
        color: textColor,
        font: { size: 16, weight: 'bold' as const },
        padding: { bottom: 20 }
      },
      tooltip: {
        backgroundColor: cardColor,
        titleColor: textColor,
        bodyColor: textSecondaryColor,
        borderColor: borderColor,
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true
      }
    },
    scales: {
      x: {
        ticks: { 
          color: textSecondaryColor,
          font: { size: 11 }
        },
        grid: { 
          color: borderColor,
          drawBorder: false
        }
      },
      y: {
        ticks: { 
          color: textSecondaryColor,
          font: { size: 11 }
        },
        grid: { 
          color: borderColor,
          drawBorder: false
        }
      }
    },
    elements: {
      point: {
        hoverBackgroundColor: primaryColor
      }
    }
  });

  const getBarChartOptions = (title: string) => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        labels: {
          color: textColor,
          font: { size: 12, weight: 'normal' as const },
          padding: 20
        }
      },
      title: {
        display: true,
        text: title,
        color: textColor,
        font: { size: 16, weight: 'bold' as const },
        padding: { bottom: 20 }
      },
      tooltip: {
        backgroundColor: cardColor,
        titleColor: textColor,
        bodyColor: textSecondaryColor,
        borderColor: borderColor,
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true
      }
    },
    scales: {
      x: {
        ticks: { 
          color: textSecondaryColor,
          font: { size: 11 }
        },
        grid: { 
          color: borderColor,
          drawBorder: false
        }
      },
      y: {
        beginAtZero: true,
        ticks: { 
          color: textSecondaryColor,
          font: { size: 11 }
        },
        grid: { 
          color: borderColor,
          drawBorder: false
        }
      }
    }
  });

  const getDoughnutChartOptions = (title: string) => ({
    responsive: true,
    maintainAspectRatio: false,
    cutout: '60%',
    plugins: {
      legend: {
        display: true,
        position: 'bottom' as const,
        labels: {
          color: textColor,
          font: { size: 12, weight: 'normal' as const },
          padding: 20
        }
      },
      title: {
        display: true,
        text: title,
        color: textColor,
        font: { size: 16, weight: 'bold' as const },
        padding: { bottom: 20 }
      },
      tooltip: {
        backgroundColor: cardColor,
        titleColor: textColor,
        bodyColor: textSecondaryColor,
        borderColor: borderColor,
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true
      }
    }
  });

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BACKEND_CONFIG.API_BASE_URL}/analytics/summary`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch analytics');
      }

      const data = await response.json();
      setAnalytics(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  useEffect(() => {
    if (analytics) {
      animateContent();
    }
  }, [analytics]);

  const animateContent = () => {
    const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
    
    tl.fromTo(headerRef.current, 
      { y: -50, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 0.8 }
    )
    .fromTo(statsRef.current?.children || [], 
      { y: 30, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.1 }, 
      "-=0.4"
    )
    .fromTo(chartRef.current, 
      { y: 30, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 0.6 }, 
      "-=0.2"
    );
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: primaryColor }}></div>
          <p style={{ color: textColor }}>Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor }}>
        <div className="text-center p-6 rounded-xl" style={{ backgroundColor: cardColor, border: `1px solid ${borderColor}` }}>
          <p style={{ color: textColor }} className="mb-4">{error}</p>
          <button
            onClick={fetchAnalytics}
            className="px-4 py-2 rounded-lg text-white font-medium transition-all duration-200 hover:scale-105"
            style={{ backgroundColor: primaryColor }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor }}>
      {/* Header */}
      <div ref={headerRef} className="px-4 sm:px-6 py-6" style={{ backgroundColor: surfaceColor }}>
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: textColor }}>
                Analytics Dashboard
              </h1>
              <p className="text-sm sm:text-base" style={{ color: textSecondaryColor }}>
                Track your progress and performance across all technologies
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="w-6 h-6" style={{ color: primaryColor }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-1 p-1 rounded-lg" style={{ backgroundColor: `${primaryColor}10` }}>
            {[
              { 
                id: 'overview', 
                label: 'Overview', 
                icon: () => (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                )
              },
              { 
                id: 'performance', 
                label: 'Performance', 
                icon: () => (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                )
              },
              { 
                id: 'history', 
                label: 'History', 
                icon: () => (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )
              },
              { 
                id: 'insights', 
                label: 'Insights', 
                icon: () => (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                )
              }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md transition-all duration-200 ${
                  activeTab === tab.id ? 'shadow-sm' : 'hover:scale-105'
                }`}
                style={{
                  backgroundColor: activeTab === tab.id ? primaryColor : 'transparent',
                  color: activeTab === tab.id ? 'white' : textSecondaryColor
                }}
              >
                <tab.icon />
                <span className="text-sm font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 sm:px-6 py-6">
        <div className="max-w-6xl mx-auto space-y-6">
          
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <>
              {/* Stats Cards */}
              <div ref={statsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    title: 'Total Tests',
                    value: analytics?.progress ? '1' : '0',
                    icon: () => (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    ),
                    color: 'blue'
                  },
                  {
                    title: 'Questions Answered',
                    value: analytics?.progress?.questions_answered || 0,
                    icon: () => (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    ),
                    color: 'green'
                  },
                  {
                    title: 'Best Score',
                    value: `${analytics?.progress?.total_marks || 0}`,
                    icon: () => (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                    ),
                    color: 'yellow'
                  },
                  {
                    title: 'Time Spent',
                    value: formatTime(analytics?.progress?.time_spent || 0),
                    icon: () => (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    ),
                    color: 'purple'
                  }
                ].map((stat, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-xl transition-all duration-200 hover:scale-105"
                    style={{ backgroundColor: cardColor, border: `1px solid ${borderColor}` }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-${stat.color}-100`}>
                        <stat.icon />
                      </div>
                      <div>
                        <p className="text-sm font-medium" style={{ color: textSecondaryColor }}>
                          {stat.title}
                        </p>
                        <p className="text-xl font-bold" style={{ color: textColor }}>
                          {stat.value}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Performance Overview */}
              <div ref={chartRef} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="p-4 rounded-xl" style={{ backgroundColor: cardColor, border: `1px solid ${borderColor}` }}>
                  <h3 className="text-lg font-semibold mb-4" style={{ color: textColor }}>
                    Performance Trend
                  </h3>
                  <div className="h-64">
                    <Line data={performanceChartData} options={getLineChartOptions('30-Day Performance')} />
                  </div>
                </div>

                <div className="p-4 rounded-xl" style={{ backgroundColor: cardColor, border: `1px solid ${borderColor}` }}>
                  <h3 className="text-lg font-semibold mb-4" style={{ color: textColor }}>
                    Daily Activity
                  </h3>
                  <div className="h-64">
                    <Bar data={questionsChartData} options={getBarChartOptions('Questions Answered')} />
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Performance Tab */}
          {activeTab === 'performance' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold" style={{ color: textColor }}>
                Performance Analytics
              </h3>
              
              {/* Performance Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="p-4 rounded-xl" style={{ backgroundColor: cardColor, border: `1px solid ${borderColor}` }}>
                  <div className="h-80">
                    <Line data={performanceChartData} options={getLineChartOptions('Performance Score Over Time')} />
                  </div>
                </div>

                <div className="p-4 rounded-xl" style={{ backgroundColor: cardColor, border: `1px solid ${borderColor}` }}>
                  <div className="h-80">
                    <Line data={timeChartData} options={getLineChartOptions('Time Spent Per Day')} />
                  </div>
                </div>
              </div>

              {/* Skill Distribution */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="p-4 rounded-xl" style={{ backgroundColor: cardColor, border: `1px solid ${borderColor}` }}>
                  <div className="h-80">
                    <Doughnut data={skillDistributionData} options={getDoughnutChartOptions('Skill Distribution')} />
                  </div>
                </div>

                <div className="p-4 rounded-xl" style={{ backgroundColor: cardColor, border: `1px solid ${borderColor}` }}>
                  <h4 className="font-semibold mb-4" style={{ color: textColor }}>Skill Performance</h4>
                  <div className="space-y-4">
                    {skillDistributionData.labels.map((skill, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium" style={{ color: textColor }}>
                              {skill}
                            </span>
                            <span className="text-sm font-bold" style={{ color: primaryColor }}>
                              {skillDistributionData.datasets[0].data[index]}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div
                              className="h-3 rounded-full transition-all duration-1000"
                              style={{ 
                                width: `${skillDistributionData.datasets[0].data[index]}%`,
                                backgroundColor: skillDistributionData.datasets[0].backgroundColor[index]
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold" style={{ color: textColor }}>
                Test History
              </h3>
              
              <div className="space-y-3">
                {analytics?.recentTests.map((test, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-xl transition-all duration-200 hover:scale-105"
                    style={{ backgroundColor: cardColor, border: `1px solid ${borderColor}` }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-semibold" style={{ color: textColor }}>
                          {test.technology}
                        </h4>
                        <p className="text-sm" style={{ color: textSecondaryColor }}>
                          {formatDate(test.test_date)}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreBgColor(test.percentage_score)} ${getScoreColor(test.percentage_score)}`}>
                        {test.percentage_score.toFixed(1)}%
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p style={{ color: textSecondaryColor }}>Questions</p>
                        <p className="font-semibold" style={{ color: textColor }}>
                          {test.questions_answered}/{test.total_questions}
                        </p>
                      </div>
                      <div>
                        <p style={{ color: textSecondaryColor }}>Marks</p>
                        <p className="font-semibold" style={{ color: textColor }}>
                          {test.total_marks}/{test.max_possible_marks}
                        </p>
                      </div>
                      <div>
                        <p style={{ color: textSecondaryColor }}>Time</p>
                        <p className="font-semibold" style={{ color: textColor }}>
                          {formatTime(test.time_spent)}
                        </p>
                      </div>
                      <div>
                        <p style={{ color: textSecondaryColor }}>Score</p>
                        <p className="font-semibold" style={{ color: textColor }}>
                          {test.percentage_score.toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                
                {(!analytics?.recentTests || analytics.recentTests.length === 0) && (
                  <div className="text-center py-8">
                    <svg className="h-12 w-12 mx-auto mb-4" style={{ color: textSecondaryColor }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p style={{ color: textSecondaryColor }}>No test history yet. Start practicing to see your results here!</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Insights Tab */}
          {activeTab === 'insights' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold" style={{ color: textColor }}>
                Advanced Analytics & Insights
              </h3>
              
              {/* Comprehensive Charts */}
              <div className="grid grid-cols-1 gap-6">
                <div className="p-4 rounded-xl" style={{ backgroundColor: cardColor, border: `1px solid ${borderColor}` }}>
                  <div className="h-96">
                    <Line data={performanceChartData} options={getLineChartOptions('Performance Trends (30 Days)')} />
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="p-4 rounded-xl" style={{ backgroundColor: cardColor, border: `1px solid ${borderColor}` }}>
                    <div className="h-80">
                      <Bar data={questionsChartData} options={getBarChartOptions('Daily Questions Answered')} />
                    </div>
                  </div>

                  <div className="p-4 rounded-xl" style={{ backgroundColor: cardColor, border: `1px solid ${borderColor}` }}>
                    <div className="h-80">
                      <Doughnut data={skillDistributionData} options={getDoughnutChartOptions('Technology Mastery')} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Advanced Insights */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="p-4 rounded-xl" style={{ backgroundColor: cardColor, border: `1px solid ${borderColor}` }}>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                      <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                    <h4 className="font-semibold" style={{ color: textColor }}>Improvement Trend</h4>
                  </div>
                  <p className="text-sm mb-3" style={{ color: textSecondaryColor }}>
                    Your performance has improved by 23% over the last 30 days
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="h-2 rounded-full bg-green-500" style={{ width: '75%' }}></div>
                  </div>
                </div>

                <div className="p-4 rounded-xl" style={{ backgroundColor: cardColor, border: `1px solid ${borderColor}` }}>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h4 className="font-semibold" style={{ color: textColor }}>Consistency</h4>
                  </div>
                  <p className="text-sm mb-3" style={{ color: textSecondaryColor }}>
                    You've practiced 28 out of 30 days - excellent consistency!
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="h-2 rounded-full bg-blue-500" style={{ width: '93%' }}></div>
                  </div>
                </div>

                <div className="p-4 rounded-xl" style={{ backgroundColor: cardColor, border: `1px solid ${borderColor}` }}>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                      <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <h4 className="font-semibold" style={{ color: textColor }}>Focus Area</h4>
                  </div>
                  <p className="text-sm mb-3" style={{ color: textSecondaryColor }}>
                    Consider focusing more on Algorithms and Data Structures
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="h-2 rounded-full bg-purple-500" style={{ width: '65%' }}></div>
                  </div>
                </div>
              </div>

              {/* Study Recommendations */}
              <div className="p-4 rounded-xl" style={{ backgroundColor: cardColor, border: `1px solid ${borderColor}` }}>
                <h4 className="font-semibold mb-4" style={{ color: textColor }}>AI-Powered Study Recommendations</h4>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3 p-3 rounded-lg" style={{ backgroundColor: `${primaryColor}05` }}>
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                    <div>
                      <p className="text-sm font-medium" style={{ color: textColor }}>Practice More JavaScript</p>
                      <p className="text-xs" style={{ color: textSecondaryColor }}>
                        Your JavaScript scores are improving. Try advanced concepts like closures and async programming.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 p-3 rounded-lg" style={{ backgroundColor: `${primaryColor}05` }}>
                    <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
                    <div>
                      <p className="text-sm font-medium" style={{ color: textColor }}>React Mastery</p>
                      <p className="text-xs" style={{ color: textSecondaryColor }}>
                        Great progress in React! Focus on hooks, context, and performance optimization.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 p-3 rounded-lg" style={{ backgroundColor: `${primaryColor}05` }}>
                    <div className="w-2 h-2 rounded-full bg-yellow-500 mt-2"></div>
                    <div>
                      <p className="text-sm font-medium" style={{ color: textColor }}>Algorithm Practice</p>
                      <p className="text-xs" style={{ color: textSecondaryColor }}>
                        Spend more time on sorting algorithms and data structures to boost your scores.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;