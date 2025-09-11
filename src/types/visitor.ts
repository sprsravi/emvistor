export interface Visitor {
  id: string;
  name: string;
  company: string;
  department: string;
  purpose: string;
  phone: string;
  email: string;
  host: string;
  checkInTime: Date;
  checkOutTime?: Date;
  status: 'checked-in' | 'checked-out';
}

export interface VisitorStats {
  totalVisitors: number;
  currentlyInOffice: number;
  checkedOutToday: number;
  totalToday: number;
}