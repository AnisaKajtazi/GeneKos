import React, { useState, useEffect, useContext } from 'react';
import api from '../../api/axios';
import { AuthContext } from '../../context/AuthContext';


const MyAppointmentsList = ({ appointments }) => {
  if (!appointments.length) return <p>No appointments yet.</p>;

  return (
    <table border="1" cellPadding="8" style={{ marginBottom: '20px', width: '100%' }}>
      <thead>
        <tr>
          <th>Date & Time</th>
          <th>Status</th>
          <th>Note</th>
        </tr>
      </thead>
      <tbody>
        {appointments.map(a => (
          <tr key={a.id}>
            <td>{a.scheduled_date.replace('T', ' ')}</td>
            <td>{a.status}</td>
            <td>{a.note}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const UserAppointmentsPage = () => {
  const { user } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [note, setNote] = useState('');


  const fetchAppointments = async () => {
    try {
      const res = await api.get(`/appointments/user/${user.id}`);
      setAppointments(res.data);
      setAppointments(res.data.appointments);
    } catch (err) {
      console.error(err);
    }
  };


  const fetchAvailableSlots = async () => {
    if (!selectedDate) return;
    try {
      const res = await api.get(`/appointments/available?date=${selectedDate}`);
      setAvailableSlots(res.data.available_slots);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  useEffect(() => {
    fetchAvailableSlots();
  }, [selectedDate]);

  const handleRequestAppointment = async () => {
    if (!selectedDate || !selectedSlot) return alert('Zgjidh datën dhe slot-in');

    try {
      await api.post('/appointments', {
        user_id: user.id,
        scheduled_date: `${selectedDate}T${selectedSlot}`,
        note
      });
      alert('Appointment request submitted!');
      setSelectedDate('');
      setSelectedSlot('');
      setNote('');
      fetchAppointments();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Gabim gjatë dërgimit të kërkesës');
    }
  };

  return (
    <div>
      <h2>My Appointments</h2>

      <MyAppointmentsList appointments={appointments} />

      <div style={{ marginTop: '20px' }}>
        <h3>Request Appointment</h3>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
          <label>
            Date:
            <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} />
          </label>

          <label>
            Slot:
            <select value={selectedSlot} onChange={e => setSelectedSlot(e.target.value)}>
              <option value="">Select slot</option>
              {availableSlots.map(slot => (
                <option key={slot} value={slot}>{slot}</option>
              ))}
            </select>
          </label>

          <label>
            Note:
            <input type="text" value={note} onChange={e => setNote(e.target.value)} />
          </label>

          <button onClick={handleRequestAppointment} style={{ padding: '5px 15px' }}>
            Request
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserAppointmentsPage;
