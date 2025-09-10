import React, { useMemo, useState } from 'react';
import { BarChart3, PieChart, Download, TrendingUp } from 'lucide-react';
import { Visitor } from '../types/visitor';
import { useVisitors } from '../hooks/useVisitors';

interface ReportsProps {
  visitors: Visitor[];
}

const Reports: React.FC<ReportsProps> = ({ visitors }) => {
  const { exportCSV, loading } = useVisitors();
  const [reportType, setReportType] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  
  const reportData = useMemo(() => {
    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const startOfWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    let filteredVisitors: Visitor[];
    let dateRange: string;

    switch (reportType) {
      case 'weekly':
        filteredVisitors = visitors.filter(v => v.checkInTime >= startOfWeek);
        dateRange = `${startOfWeek.toLocaleDateString()} - ${today.toLocaleDateString()}`;
        break;
      case 'monthly':
        filteredVisitors = visitors.filter(v => v.checkInTime >= startOfMonth);
        dateRange = `${startOfMonth.toLocaleDateString()} - ${today.toLocaleDateString()}`;
        break;
      case 'daily':
      default:
        filteredVisitors = visitors.filter(v => v.checkInTime >= startOfToday);
        dateRange = today.toLocaleDateString();
        break;
    }

    // Purpose distribution
    const purposeCount = filteredVisitors.reduce((acc, visitor) => {
      acc[visitor.purpose] = (acc[visitor.purpose] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Company distribution
    const companyCount = filteredVisitors.reduce((acc, visitor) => {
      acc[visitor.company] = (acc[visitor.company] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Top companies (limit to 10)
    const topCompanies = Object.entries(companyCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10);

    // Daily visitor count for the period
    const dailyVisitors = filteredVisitors.reduce((acc, visitor) => {
      const date = visitor.checkInTime.toLocaleDateString();
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Average duration
    const completedVisits = filteredVisitors.filter(v => v.checkOutTime);
    const averageDuration = completedVisits.length > 0
      ? completedVisits.reduce((sum, visitor) => {
          const duration = visitor.checkOutTime!.getTime() - visitor.checkInTime.getTime();
          return sum + duration;
        }, 0) / completedVisits.length / (1000 * 60) // Convert to minutes
      : 0;

    return {
      filteredVisitors,
      dateRange,
      purposeCount,
      topCompanies,
      dailyVisitors,
      averageDuration,
      totalVisitors: filteredVisitors.length,
      checkedOutVisitors: filteredVisitors.filter(v => v.status === 'checked-out').length,
      currentlyInOffice: filteredVisitors.filter(v => v.status === 'checked-in').length,
    };
  }, [visitors, reportType]);

  const handleExportReport = async () => {
    try {
      await exportCSV();
    } catch (error) {
      alert('Failed to export report. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Report Controls */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Visitor Reports</h2>
            <p className="text-gray-600 mt-1">Period: {reportData.dateRange}</p>
          </div>
          
          <div className="flex gap-3">
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="daily">Today</option>
              <option value="weekly">Last 7 Days</option>
              <option value="monthly">This Month</option>
            </select>
            
            <button
              onClick={handleExportReport}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md font-medium transition-colors duration-200 flex items-center space-x-2"
            >
              <Download className="h-5 w-5" />
              <span>{loading ? 'Exporting...' : 'Export'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: 'Total Visitors',
            value: reportData.totalVisitors,
            icon: BarChart3,
            color: 'bg-blue-500',
          },
          {
            title: 'Currently In Office',
            value: reportData.currentlyInOffice,
            icon: TrendingUp,
            color: 'bg-green-500',
          },
          {
            title: 'Checked Out',
            value: reportData.checkedOutVisitors,
            icon: PieChart,
            color: 'bg-red-500',
          },
          {
            title: 'Avg Duration (min)',
            value: Math.round(reportData.averageDuration),
            icon: BarChart3,
            color: 'bg-purple-500',
          },
        ].map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${metric.color}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">{metric.title}</h3>
                  <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Purpose Distribution */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Visit Purposes</h3>
          <div className="space-y-3">
            {Object.entries(reportData.purposeCount)
              .sort(([, a], [, b]) => b - a)
              .map(([purpose, count]) => {
                const percentage = reportData.totalVisitors > 0 
                  ? Math.round((count / reportData.totalVisitors) * 100)
                  : 0;
                
                return (
                  <div key={purpose} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-700">{purpose}</span>
                        <span className="text-sm text-gray-500">{count} ({percentage}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Top Companies */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Companies</h3>
          <div className="space-y-3">
            {reportData.topCompanies.map(([company, count], index) => {
              const percentage = reportData.totalVisitors > 0 
                ? Math.round((count / reportData.totalVisitors) * 100)
                : 0;
              
              return (
                <div key={company} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-700">
                        {index + 1}. {company}
                      </span>
                      <span className="text-sm text-gray-500">{count} ({percentage}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Daily Visitor Chart */}
      {reportType !== 'daily' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Visitor Count</h3>
          <div className="space-y-2">
            {Object.entries(reportData.dailyVisitors)
              .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
              .map(([date, count]) => {
                const maxCount = Math.max(...Object.values(reportData.dailyVisitors));
                const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;
                
                return (
                  <div key={date} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 w-24">{date}</span>
                    <div className="flex-1 mx-4">
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-sm text-gray-500 w-8 text-right">{count}</span>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;