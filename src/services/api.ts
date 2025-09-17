const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

export interface ApiVisitor {
  id: number;
  name: string;
  company: string;
  department: string;
  purpose: string;
  phone: string;
  email: string;
  host: string;
  idType?: string;
  idNumber?: string;
  idVerified?: boolean;
  checkInTime: string;
  checkOutTime?: string;
  status: 'checked-in' | 'checked-out';
}

export interface ApiVisitorStats {
  totalVisitors: number;
  currentlyInOffice: number;
  checkedOutToday: number;
  totalToday: number;
}

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async getVisitors(): Promise<ApiVisitor[]> {
    return this.request<ApiVisitor[]>('/visitors');
  }

  async getVisitorStats(): Promise<ApiVisitorStats> {
    return this.request<ApiVisitorStats>('/visitors/stats');
  }

  async createVisitor(visitorData: Omit<ApiVisitor, 'id' | 'checkInTime' | 'status'>): Promise<ApiVisitor> {
    return this.request<ApiVisitor>('/visitors', {
      method: 'POST',
      body: JSON.stringify(visitorData),
    });
  }

  async checkOutVisitor(id: number): Promise<ApiVisitor> {
    return this.request<ApiVisitor>(`/visitors/${id}/checkout`, {
      method: 'PUT',
    });
  }

  async deleteVisitor(id: number): Promise<void> {
    await this.request(`/visitors/${id}`, {
      method: 'DELETE',
    });
  }

  async exportVisitorsCSV(): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/visitors/export/csv`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `visitors_export_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('CSV export failed:', error);
      throw error;
    }
  }
}

export const apiService = new ApiService();