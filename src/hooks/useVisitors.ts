import { useState, useEffect, useCallback } from 'react';
import { Visitor } from '../types/visitor';
import { apiService, ApiVisitor } from '../services/api';

// Convert API visitor to local visitor format
const convertApiVisitor = (apiVisitor: ApiVisitor): Visitor => ({
  id: apiVisitor.id.toString(),
  name: apiVisitor.name,
  company: apiVisitor.company,
  department: apiVisitor.department,
  purpose: apiVisitor.purpose,
  phone: apiVisitor.phone,
  email: apiVisitor.email,
  host: apiVisitor.host,
  checkInTime: new Date(apiVisitor.checkInTime),
  checkOutTime: apiVisitor.checkOutTime ? new Date(apiVisitor.checkOutTime) : undefined,
  status: apiVisitor.status,
});

export const useVisitors = () => {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVisitors = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const apiVisitors = await apiService.getVisitors();
      const convertedVisitors = apiVisitors.map(convertApiVisitor);
      setVisitors(convertedVisitors);
    } catch (err) {
      setError('Failed to fetch visitors');
      console.error('Error fetching visitors:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVisitors();
  }, [fetchVisitors]);

  const addVisitor = async (visitorData: Omit<Visitor, 'id' | 'checkInTime' | 'status'>) => {
    setLoading(true);
    setError(null);
    try {
      const apiVisitor = await apiService.createVisitor(visitorData);
      const newVisitor = convertApiVisitor(apiVisitor);
      setVisitors(prev => [newVisitor, ...prev]);
      return newVisitor;
    } catch (err) {
      setError('Failed to add visitor');
      console.error('Error adding visitor:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const checkOutVisitor = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const apiVisitor = await apiService.checkOutVisitor(parseInt(id));
      const updatedVisitor = convertApiVisitor(apiVisitor);
      setVisitors(prev =>
        prev.map(visitor =>
          visitor.id === id ? updatedVisitor : visitor
        )
      );
    } catch (err) {
      setError('Failed to check out visitor');
      console.error('Error checking out visitor:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteVisitor = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await apiService.deleteVisitor(parseInt(id));
      setVisitors(prev => prev.filter(visitor => visitor.id !== id));
    } catch (err) {
      setError('Failed to delete visitor');
      console.error('Error deleting visitor:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const exportCSV = async () => {
    setLoading(true);
    setError(null);
    try {
      await apiService.exportVisitorsCSV();
    } catch (err) {
      setError('Failed to export CSV');
      console.error('Error exporting CSV:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getStats = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayVisitors = visitors.filter(visitor => {
      const checkInDate = new Date(visitor.checkInTime);
      checkInDate.setHours(0, 0, 0, 0);
      return checkInDate.getTime() === today.getTime();
    });

    return {
      totalVisitors: visitors.length,
      currentlyInOffice: visitors.filter(v => v.status === 'checked-in').length,
      checkedOutToday: todayVisitors.filter(v => v.status === 'checked-out').length,
      totalToday: todayVisitors.length,
    };
  };

  return {
    visitors,
    loading,
    error,
    addVisitor,
    checkOutVisitor,
    deleteVisitor,
    exportCSV,
    refreshVisitors: fetchVisitors,
    getStats,
  };
};