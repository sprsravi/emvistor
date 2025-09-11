import React, { useState } from 'react';
import { Calendar, Clock, Download } from 'lucide-react';
import { Visitor } from '../types/visitor';
import { useVisitors } from '../hooks/useVisitors';

interface HistoryProps {
  visitors: Visitor[];
}

const History: React.FC<HistoryProps> = ({ visitors }) => {
  const { exportCSV, loading } = useVisitors();
  const [dateFilter, setDateFilter] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'company'>('date');

  const filteredAndSortedVisitors = visitors
    .filter(visitor => {
      if (!dateFilter) return true;
      const visitorDate = visitor.checkInTime.toISOString().split('T')[0];
      return visitorDate === dateFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'company':
          return a.company.localeCompare(b.company);
        case 'date':
        default:
          return b.checkInTime.getTime() - a.checkInTime.getTime();
      }
    });

  const handleExportCSV = async () => {
    try {
      await exportCSV();
    } catch (error) {
      alert('Failed to export CSV. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <label htmlFor="date-filter" className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="date"
                id="date-filter"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label htmlFor="sort-by" className="block text-sm font-medium text-gray-700 mb-2">
              Sort by
            </label>
            <select
              id="sort-by"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="date">Date</option>
              <option value="name">Name</option>
              <option value="company">Company</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleExportCSV}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md font-medium transition-colors duration-200 flex items-center space-x-2"
            >
              <Download className="h-5 w-5" />
              <span>{loading ? 'Exporting...' : 'Export CSV'}</span>
            </button>
          </div>
        </div>

        <div className="text-sm text-gray-600">
          Showing {filteredAndSortedVisitors.length} visitor records
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {filteredAndSortedVisitors.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No visitor history found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Visitor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company & Purpose
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Host
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Check-in Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Check-out Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAndSortedVisitors.map((visitor) => {
                  const duration = visitor.checkOutTime
                    ? Math.round((visitor.checkOutTime.getTime() - visitor.checkInTime.getTime()) / (1000 * 60))
                    : null;

                  return (
                    <tr key={visitor.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{visitor.name}</div>
                        <div className="text-sm text-gray-500">{visitor.phone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{visitor.company}</div>
                        <div className="text-sm text-gray-500">{visitor.purpose}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {visitor.department}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {visitor.host}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {visitor.checkInTime.toLocaleDateString()}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {visitor.checkInTime.toLocaleTimeString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {visitor.checkOutTime ? (
                          <>
                            <div className="text-sm text-gray-900">
                              {visitor.checkOutTime.toLocaleDateString()}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              {visitor.checkOutTime.toLocaleTimeString()}
                            </div>
                          </>
                        ) : (
                          <span className="text-sm text-orange-600 font-medium">Still in office</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {duration !== null ? `${duration} minutes` : 'In progress'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;