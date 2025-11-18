import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);
app.use(express.json());

// simple request logger for debugging
app.use((req, res, next) => {
  console.log(
    `[${new Date().toISOString()}] ${req.method} ${req.url} from ${req.ip}`
  );
  next();
});

console.log({
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
  DB_USER: process.env.DB_USER,
  DB_NAME: process.env.DB_NAME,
});

// -----------------------------------------------------
// Healthcheck
// -----------------------------------------------------
app.get("/api/health", (req, res) => {
  res.json({ ok: true, message: "HackRadar API is running" });
});

// -----------------------------------------------------
// Auth: Sign Up
// -----------------------------------------------------
app.post("/api/auth/signup", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ error: "Email and password are required" });
  }

  try {
    // Check if user already exists
    const [existing] = await pool.query(
      "SELECT user_id FROM users WHERE email = ?",
      [email]
    );

    if (existing.length > 0) {
      return res.status(409).json({ error: "Email already registered" });
    }

    // Insert new user (plain-text password for demo purposes)
    const [result] = await pool.query(
      "INSERT INTO users (email, password) VALUES (?, ?)",
      [email, password]
    );

    return res.status(201).json({
      message: "User registered successfully",
      user_id: result.insertId,
      email,
    });
  } catch (err) {
    console.error("Error in /api/auth/signup:", err);
    return res.status(500).json({ error: "Failed to register user" });
  }
});

// -----------------------------------------------------
// Auth: Login
// -----------------------------------------------------
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ error: "Email and password are required" });
  }

  try {
    const [rows] = await pool.query(
      "SELECT user_id, email, password FROM users WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const user = rows[0];

    // Plain-text comparison (fine for class project demo)
    if (user.password !== password) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    return res.json({
      message: "Login successful",
      user_id: user.user_id,
      email: user.email,
    });
  } catch (err) {
    console.error("Error in /api/auth/login:", err);
    return res.status(500).json({ error: "Failed to log in" });
  }
});

// -----------------------------------------------------
// All hackathons (basic list)
// -----------------------------------------------------
app.get("/api/hackathons", async (req, res) => {
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
         v.country,
         v.latitude,
         v.longitude
       FROM hackathons h
       LEFT JOIN venues v ON h.venue_id = v.venue_id
       ORDER BY h.start_date;`
    );
    res.json(rows);
  } catch (err) {
    console.error("Error fetching hackathons:", err);
    res.status(500).json({ error: "Failed to fetch hackathons" });
  }
});

// -----------------------------------------------------
// Search and Filter Hackathons (with pagination)
// -----------------------------------------------------
app.get("/api/hackathons/search", async (req, res) => {
  try {
    const {
      search = "",
      state = "",
      country = "",
      city = "",
      startDate = "",
      endDate = "",
      page = 1,
      limit = 20,
    } = req.query;

    let whereConditions = [];
    let queryParams = [];

    // Search term - searches across hackathon name, city, state, country
    if (search && search.trim() !== "") {
      whereConditions.push(
        "(h.name LIKE ? OR v.city LIKE ? OR v.state_region LIKE ? OR v.country LIKE ?)"
      );
      const searchPattern = `%${search}%`;
      queryParams.push(
        searchPattern,
        searchPattern,
        searchPattern,
        searchPattern
      );
    }

    // State filter
    if (state && state.trim() !== "") {
      const states = state.split(",").map((s) => s.trim());
      const placeholders = states.map(() => "?").join(",");
      whereConditions.push(`v.state_region IN (${placeholders})`);
      queryParams.push(...states);
    }

    // Country filter
    if (country && country.trim() !== "") {
      const countries = country.split(",").map((c) => c.trim());
      const placeholders = countries.map(() => "?").join(",");
      whereConditions.push(`v.country IN (${placeholders})`);
      queryParams.push(...countries);
    }

    // City filter
    if (city && city.trim() !== "") {
      const cities = city.split(",").map((c) => c.trim());
      const placeholders = cities.map(() => "?").join(",");
      whereConditions.push(`v.city IN (${placeholders})`);
      queryParams.push(...cities);
    }

    // Date range filters
    if (startDate && startDate.trim() !== "") {
      whereConditions.push("h.start_date >= ?");
      queryParams.push(startDate);
    }

    if (endDate && endDate.trim() !== "") {
      whereConditions.push("h.end_date <= ?");
      queryParams.push(endDate);
    }

    const whereClause =
      whereConditions.length > 0
        ? `WHERE ${whereConditions.join(" AND ")}`
        : "";

    const offset = (Number(page) - 1) * Number(limit);

    // Total count
    const countQuery = `
      SELECT COUNT(*) as total 
      FROM hackathons h
      LEFT JOIN venues v ON h.venue_id = v.venue_id
      ${whereClause}
    `;
    const [countResult] = await pool.query(countQuery, queryParams);
    const totalRecords = countResult[0].total;

    // Data query (include lat/long)
    const dataQuery = `
      SELECT 
        h.hackathon_id,
        h.name,
        h.start_date,
        h.end_date,
        h.timezone,
        v.city,
        v.state_region,
        v.country,
        v.latitude,
        v.longitude
      FROM hackathons h
      LEFT JOIN venues v ON h.venue_id = v.venue_id
      ${whereClause}
      ORDER BY h.start_date ASC
      LIMIT ? OFFSET ?
    `;

    const [rows] = await pool.query(dataQuery, [
      ...queryParams,
      Number(limit),
      offset,
    ]);

    res.json({
      data: rows,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(totalRecords / Number(limit)),
        totalRecords,
        recordsPerPage: Number(limit),
      },
    });
  } catch (err) {
    console.error("Search API error:", err);
    res.status(500).json({
      error: "Failed to search hackathons",
      message: err.message,
    });
  }
});

// -----------------------------------------------------
// Get filter options (for dropdowns)
// -----------------------------------------------------
app.get("/api/filters", async (req, res) => {
  try {
    const [states] = await pool.query(
      `SELECT DISTINCT state_region 
       FROM venues 
       WHERE state_region IS NOT NULL 
       ORDER BY state_region`
    );

    const [countries] = await pool.query(
      `SELECT DISTINCT country 
       FROM venues 
       WHERE country IS NOT NULL 
       ORDER BY country`
    );

    const [cities] = await pool.query(
      `SELECT DISTINCT city 
       FROM venues 
       WHERE city IS NOT NULL 
       ORDER BY city`
    );

    res.json({
      states: states.map((row) => row.state_region),
      countries: countries.map((row) => row.country),
      cities: cities.map((row) => row.city),
    });
  } catch (err) {
    console.error("Filters API error:", err);
    res.status(500).json({
      error: "Failed to fetch filter options",
      message: err.message,
    });
  }
});

// -----------------------------------------------------
// Hackathons filtered by state
// -----------------------------------------------------
app.get("/api/hackathons/state/:state", async (req, res) => {
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
         v.country,
         v.latitude,
         v.longitude
       FROM hackathons h
       JOIN venues v ON h.venue_id = v.venue_id
       WHERE v.state_region = ?
       ORDER BY h.start_date;`,
      [state]
    );
    res.json(rows);
  } catch (err) {
    console.error("Error fetching hackathons by state:", err);
    res.status(500).json({ error: "Failed to fetch hackathons by state" });
  }
});

// -----------------------------------------------------
// Start server
// -----------------------------------------------------
app.listen(PORT, () => {
  console.log(`HackRadar API running on http://localhost:${PORT}`);
});
