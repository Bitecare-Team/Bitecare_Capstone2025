import React, { useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import dayjs from 'dayjs';
import './AppointmentCalendar.css';

const generateCalendar = (year, month) => {
  const startOfMonth = dayjs(`${year}-${month}-01`);
  const daysInMonth = startOfMonth.daysInMonth();
  const firstDay = startOfMonth.day(); // Sunday = 0

  const dates = [];
  let day = 1 - firstDay;

  for (let week = 0; week < 6; week++) {
    const row = [];
    for (let d = 0; d < 7; d++) {
      const date = dayjs(`${year}-${month}-01`).add(day - 1, 'day');
      row.push(day > 0 && day <= daysInMonth ? date : null);
      day++;
    }
    dates.push(row);
  }
  return dates;
};

const AppointmentCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [appointments, setAppointments] = useState({});
  const maxSlots = 20;

  const year = 2025;
  const month = '07'; // July
  const calendar = generateCalendar(year, month);

  const handleDateClick = (date) => {
    setSelectedDate(date.format('YYYY-MM-DD'));
    setShowModal(true);
  };

  const handleSaveAppointment = (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    if (!name) return;

    setAppointments((prev) => {
      const updated = {
        ...prev,
        [selectedDate]: [...(prev[selectedDate] || []), name],
      };
      return updated;
    });

    setShowModal(false);
  };

  const getRemainingSlots = (dateStr) => {
    const used = appointments[dateStr]?.length || 0;
    return maxSlots - used;
  };

  return (
    <div className="calendar-container">
      <h4>Appointment Availability</h4>
      <h5>July 2025</h5>
      <div className="calendar-grid">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="day-header">{day}</div>
        ))}
        {calendar.flat().map((date, index) => {
          const dateStr = date?.format('YYYY-MM-DD');
          const remaining = date ? getRemainingSlots(dateStr) : null;

          return (
            <div key={index} className="calendar-cell">
              {date && remaining > 0 ? (
                <Button
                  variant="primary"
                  className="slot-button"
                  onClick={() => handleDateClick(date)}
                >
                  {remaining}
                </Button>
              ) : (
                <div className="empty-cell" />
              )}
            </div>
          );
        })}
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Set Appointment for {selectedDate}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSaveAppointment}>
          <Modal.Body>
            <Form.Group>
              <Form.Label>Patient Name</Form.Label>
              <Form.Control type="text" name="name" required />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
            <Button type="submit" variant="primary">Save Appointment</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default AppointmentCalendar;
