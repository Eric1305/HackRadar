import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({
  origin: 'http://localhost:5173',
}));
app.use(express.json());

// Healthcheck
app.get('/api/health', (req, res) => {
  res.json({ ok: true, message: 'HackRadar API is running' });
});

// All hackathons
app.get('/api/hackathons', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT 
         h.hackathon_id,
         h.name,
         h.start_date,
         h.end_date,
         h.timezone,
         v.city,
         v.state_region,
         v.country
       FROM hackathons h
       LEFT JOIN venues v ON h.venue_id = v.venue_id
       ORDER BY h.start_date;`
    );
    res.json(rows);
  } catch (err) {
    console.error('Error fetching hackathons:', err);
    res.status(500).json({ error: 'Failed to fetch hackathons' });
  }
});

// Hackathons filtered by state
app.get('/api/hackathons/state/:state', async (req, res) => {
  const { state } = req.params;
  try {
    const [rows] = await pool.query(
      `SELECT 
         h.hackathon_id,
         h.name,
         h.start_date,
         h.end_date,
         h.timezone,
         v.city,
         v.state_region,
         v.country
       FROM hackathons h
       JOIN venues v ON h.venue_id = v.venue_id
       WHERE v.state_region = ?
       ORDER BY h.start_date;`,
      [state]
    );
    res.json(rows);
  } catch (err) {
    console.error('Error fetching hackathons by state:', err);
    res.status(500).json({ error: 'Failed to fetch hackathons by state' });
  }
});

app.listen(PORT, () => {
  console.log(`HackRadar API running on http://localhost:${PORT}`);
});
