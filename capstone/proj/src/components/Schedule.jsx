import React, { useState } from 'react';

const Schedule = () => {
  const [selectedDate, setSelectedDate] = useState('2025-08-15');
  const [currentMonth, setCurrentMonth] = useState('August 2025');

  const generateCalendarDays = () => {
    // Generate calendar days for August 2025
    const days = [];
    const startDate = new Date(2025, 7, 1); // August 1, 2025
    const endDate = new Date(2025, 7, 31); // August 31, 2025
    
    // Add previous month's days
    const firstDayOfWeek = startDate.getDay();
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(2025, 6, 31 - i); // July days
      days.push({ date, isCurrentMonth: false, isSelected: false });
    }
    
    // Add current month's days
    for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
      const isSelected = date.toISOString().split('T')[0] === selectedDate;
      days.push({ date: new Date(date), isCurrentMonth: true, isSelected });
    }
    
    // Add next month's days to complete the grid
    const lastDayOfWeek = endDate.getDay();
    for (let i = 1; i <= 6 - lastDayOfWeek; i++) {
      const date = new Date(2025, 8, i); // September days
      days.push({ date, isCurrentMonth: false, isSelected: false });
    }
    
    return days;
  };

  const calendarDays = generateCalendarDays();

  return (
    <div className="content-section">
     
        <div className="header-content">
          <h2>Slot Management</h2>
          <p>Configure and manage appointment slots and capacity</p>
     
  
      </div>

      <div className="slot-management-container">
        {/* Left Panel - Calendar */}
        <div className="calendar-panel">
          <h3>Select Date</h3>
          <div className="calendar-component">
            <div className="calendar-header">
              <button className="calendar-nav-btn">◀</button>
              <h4>{currentMonth}</h4>
              <button className="calendar-nav-btn">▶</button>
            </div>
            <div className="calendar-grid">
              <div className="calendar-weekdays">
                <span>Su</span>
                <span>Mo</span>
                <span>Tu</span>
                <span>We</span>
                <span>Th</span>
                <span>Fr</span>
                <span>Sa</span>
              </div>
              <div className="calendar-days">
                {calendarDays.map((day, index) => (
                  <button
                    key={index}
                    className={`calendar-day ${
                      !day.isCurrentMonth ? 'other-month' : ''
                    } ${day.isSelected ? 'selected' : ''} ${
                      day.date.getDate() === 2 || day.date.getDate() === 15 ? 'highlighted' : ''
                    }`}
                    onClick={() => setSelectedDate(day.date.toISOString().split('T')[0])}
                  >
                    {day.date.getDate()}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Slots Display */}
        <div className="slots-panel">
          <h3>Slots for August 15, 2025</h3>
          <div className="empty-slots-state">
            <div className="empty-icon">🕐</div>
            <h4>No slots configured</h4>
            <p>Create appointment slots for this date to allow scheduling.</p>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: '20px'
            }}>
              <button className="btn-primary">
                <span>➕</span>
                Add Slots
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Schedule; 