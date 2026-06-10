const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/attendance';
mongoose.connect(mongoURI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const AttendanceSchema = new mongoose.Schema({
  studentName: String,
  status: String,
  date: { type: Date, default: Date.now }
});
const Attendance = mongoose.model('Attendance', AttendanceSchema);

app.post('/api/attendance', async (req, res) => {
  try {
    const record = new Attendance(req.body);
    await record.save();
    res.status(201).send(record);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get('/api/attendance', async (req, res) => {
  const records = await Attendance.find().sort({ date: -1 });
  res.send(records);
});

app.listen(3000, () => console.log('Server running on port 3000'));

