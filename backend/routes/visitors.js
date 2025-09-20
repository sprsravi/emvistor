const express = require('express');
const router = express.Router();
const Visitor = require('../models/Visitor');

// Get all visitors
router.get('/', async (req, res) => {
  try {
    const visitors = await Visitor.findAll();
    res.json(visitors);
  } catch (error) {
    console.error('Error fetching visitors:', error);
    res.status(500).json({ error: 'Failed to fetch visitors' });
  }
});

// Get visitor stats
router.get('/stats', async (req, res) => {
  try {
    const stats = await Visitor.getStats();
    res.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// Create new visitor (check-in)
router.post('/', async (req, res) => {
  try {
    const visitor = await Visitor.create(req.body);
    res.status(201).json(visitor);
  } catch (error) {
    console.error('Error creating visitor:', error);
    res.status(500).json({ error: 'Failed to create visitor' });
  }
});

// Check out visitor
router.put('/:id/checkout', async (req, res) => {
  try {
    const visitor = await Visitor.checkOut(req.params.id);
    if (!visitor) {
      return res.status(404).json({ error: 'Visitor not found' });
    }
    res.json(visitor);
  } catch (error) {
    console.error('Error checking out visitor:', error);
    res.status(500).json({ error: 'Failed to check out visitor' });
  }
});

// Delete visitor
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Visitor.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Visitor not found' });
    }
    res.json({ message: 'Visitor deleted successfully' });
  } catch (error) {
    console.error('Error deleting visitor:', error);
    res.status(500).json({ error: 'Failed to delete visitor' });
  }
});

// Export visitors to CSV
router.get('/export/csv', async (req, res) => {
  try {
    const visitors = await Visitor.findAll();
    
    // CSV headers
    const headers = [
      'ID', 'Name', 'Company', 'Department', 'Purpose', 'Phone', 'Email', 
      'Host', 'Location', 'Appointment With', 'Appointment Time',
      'Has Electronic Devices', 'Electronic Devices List',
      'ID Type (Any One)', 'ID Number (Any One)',
      'Check-in Time', 'Check-out Time', 'Status', 'Duration (minutes)'
    ];
    
    // Convert visitors to CSV format
    const csvData = visitors.map(visitor => {
      const checkInTime = new Date(visitor.checkInTime);
      const checkOutTime = visitor.checkOutTime ? new Date(visitor.checkOutTime) : null;
      const duration = checkOutTime 
        ? Math.round((checkOutTime.getTime() - checkInTime.getTime()) / (1000 * 60))
        : 'In progress';

      return [
        visitor.id,
        visitor.name,
        visitor.company,
        visitor.department,
        visitor.purpose,
        visitor.phone,
        visitor.email || '',
        visitor.idType || '',
        visitor.idNumber || '',
        visitor.host,
        visitor.location || '',
        visitor.appointmentWith || '',
        visitor.appointmentTime ? new Date(visitor.appointmentTime).toLocaleString() : '',
        visitor.hasElectronicDevices ? 'Yes' : 'No',
        checkInTime.toLocaleString(),
        checkOutTime ? checkOutTime.toLocaleString() : 'Not checked out',
        visitor.status,
        duration
      ];
    });

    // Create CSV content
    const csvContent = [headers, ...csvData]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    // Set response headers for file download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=visitors_export_${new Date().toISOString().split('T')[0]}.csv`);
    
    res.send(csvContent);
  } catch (error) {
    console.error('Error exporting CSV:', error);
    res.status(500).json({ error: 'Failed to export CSV' });
  }
});

module.exports = router;