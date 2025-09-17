import React, { useState } from 'react';
import { UserPlus, CheckCircle } from 'lucide-react';
import { Visitor } from '../types/visitor';

interface CheckInProps {
  onAddVisitor: (visitor: Omit<Visitor, 'id' | 'checkInTime' | 'status'>) => void;
}

const CheckIn: React.FC<CheckInProps> = ({ onAddVisitor }) => {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    department: '',
    purpose: '',
    phone: '',
    email: '',
    host: '',
    idType: '',
    idNumber: '',
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddVisitor(formData);
    setFormData({
      name: '',
      company: '',
      department: '',
      purpose: '',
      phone: '',
      email: '',
      host: '',
      idType: '',
      idNumber: '',
    });
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  if (showSuccess) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Check-in Successful!</h2>
          <p className="text-gray-600 mb-6">The visitor has been successfully checked in.</p>
          <button
            onClick={() => setShowSuccess(false)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium transition-colors duration-200"
          >
            Check In Another Visitor
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex items-center mb-6">
          <div className="p-3 bg-blue-100 rounded-lg">
            <UserPlus className="h-6 w-6 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 ml-4">Visitor Check-In</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                placeholder="Enter visitor's full name"
              />
            </div>

            <div>
              <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                Company *
              </label>
              <input
                type="text"
                id="company"
                name="company"
                required
                value={formData.company}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                placeholder="Enter company name"
              />
            </div>

            <div>
              <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">
                Department *
              </label>
              <select
                id="department"
                name="department"
                required
                value={formData.department}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
              >
                <option value="">Select department</option>
                <option value="Administration">Administration</option>
                <option value="Bluesky">Bluesky</option>
                <option value="Consulting Division">Consulting Division</option>
                <option value="Customer Support">Customer Support</option>
                <option value="ESS Sales">ESS Sales</option>
                <option value="ESS Technology">ESS Technology</option>
                <option value="finance">finance</option>
                <option value="Foreign employee">Foreign employee</option>
                <option value="GRC">GRC</option>
                <option value="HR">HR</option>
                <option value="Inside Sales">Inside Sales</option>
                <option value="International Team">International Team</option>
                <option value="IT-Infrastructure">IT-Infrastructure</option>
                <option value="Marketing">Marketing</option>
                <option value="Operation">Operation</option>
                <option value="Technology">Technology</option>
                <option value="US Inside Sales">US Inside Sales</option>
              </select>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                placeholder="Enter phone number"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                placeholder="Enter email address"
              />
            </div>

            <div>
              <label htmlFor="idType" className="block text-sm font-medium text-gray-700 mb-2">
                Identity Document Type
              </label>
              <select
                id="idType"
                name="idType"
                value={formData.idType}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
              >
                <option value="">Select ID type (Optional)</option>
                <option value="aadhaar">Aadhaar Card</option>
                <option value="pan">PAN Card</option>
                <option value="driving_license">Driving License</option>
                <option value="passport">Passport</option>
                <option value="voter_id">Voter ID</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="idNumber" className="block text-sm font-medium text-gray-700 mb-2">
                Identity Document Number
              </label>
              <input
                type="text"
                id="idNumber"
                name="idNumber"
                value={formData.idNumber}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                placeholder="Enter ID number"
                disabled={!formData.idType}
              />
              {formData.idType && (
                <p className="text-xs text-gray-500 mt-1">
                  {formData.idType === 'aadhaar' && 'Enter 12-digit Aadhaar number'}
                  {formData.idType === 'pan' && 'Enter 10-character PAN number (e.g., ABCDE1234F)'}
                  {formData.idType === 'driving_license' && 'Enter driving license number'}
                  {formData.idType === 'passport' && 'Enter passport number'}
                  {formData.idType === 'voter_id' && 'Enter voter ID number'}
                  {formData.idType === 'other' && 'Enter ID number'}
                </p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="purpose" className="block text-sm font-medium text-gray-700 mb-2">
              Purpose of Visit *
            </label>
            <select
              id="purpose"
              name="purpose"
              required
              value={formData.purpose}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
            >
              <option value="">Select purpose of visit</option>
              <option value="Business Meeting">Business Meeting</option>
              <option value="Interview">Interview</option>
              <option value="Delivery">Delivery</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Training">Training</option>
              <option value="Consultation">Consultation</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="host" className="block text-sm font-medium text-gray-700 mb-2">
              Host Employee *
            </label>
            <input
              type="text"
              id="host"
              name="host"
              required
              value={formData.host}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
              placeholder="Enter host employee name"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-md font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <UserPlus className="h-5 w-5" />
            <span>Check In Visitor</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default CheckIn;