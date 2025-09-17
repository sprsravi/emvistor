export interface Visitor {
  id: string;
  name: string;
  company: string;
  department: string;
  purpose: string;
  phone: string;
  email: string;
  host: string;
  idType?: 'pan' | 'aadhaar' | 'driving_license' | 'passport' | 'voter_id' | 'other';
  idNumber?: string;
  idVerified?: boolean;
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