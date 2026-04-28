import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";

const db = new Database("wellness.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'student',
    interests TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS resources (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    type TEXT NOT NULL, -- article, video, pdf
    content_url TEXT,
    tags TEXT,
    is_published INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS programs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    duration_days INTEGER,
    category TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS program_enrollments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    program_id INTEGER,
    status TEXT DEFAULT 'enrolled', -- enrolled, completed
    progress INTEGER DEFAULT 0,
    enrolled_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(program_id) REFERENCES programs(id)
  );

  CREATE TABLE IF NOT EXISTS appointments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER,
    counselor_name TEXT,
    appointment_date DATETIME,
    status TEXT DEFAULT 'scheduled', -- scheduled, cancelled, completed
    type TEXT, -- mental_health, general, nutrition
    FOREIGN KEY(student_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS favorites (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    resource_id INTEGER,
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(resource_id) REFERENCES resources(id)
  );
`);

// Seed Data
const seedData = () => {
  const userCount = db.prepare("SELECT COUNT(*) as count FROM users").get();
  if (userCount.count === 0) {
    db.prepare("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)").run(
      "Admin User", "admin@eduwell.com", "admin123", "admin"
    );
    db.prepare("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)").run(
      "John Student", "student@eduwell.com", "student123", "student"
    );

    // Seed Resources
    const resources = [
      ["Managing Exam Stress", "Tips for staying calm during finals.", "Mental Health", "article", "https://example.com/stress"],
      ["10-Minute Morning Yoga", "A quick routine to start your day.", "Fitness", "video", "https://example.com/yoga"],
      ["Healthy Meal Prep for Students", "Budget-friendly recipes.", "Nutrition", "pdf", "https://example.com/mealprep"],
      ["Better Sleep Habits", "Improve your academic performance with rest.", "Sleep Improvement", "article", "https://example.com/sleep"]
    ];
    const insertResource = db.prepare("INSERT INTO resources (title, description, category, type, content_url) VALUES (?, ?, ?, ?, ?)");
    resources.forEach(r => insertResource.run(...r));

    // Seed Programs
    const programs = [
      ["30-Day Mindfulness Challenge", "Daily meditation and reflection.", 30, "Mental Health"],
      ["Beginner Strength Training", "Build a foundation for fitness.", 21, "Fitness"]
    ];
    const insertProgram = db.prepare("INSERT INTO programs (title, description, duration_days, category) VALUES (?, ?, ?, ?)");
    programs.forEach(p => insertProgram.run(...p));
  }
};
seedData();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Auth Middleware (Mock)
  app.use((req, res, next) => {
    // In a real app, we'd check JWT. For this demo, we'll use a header.
    const userId = req.headers["x-user-id"];
    if (userId) {
      const user = db.prepare("SELECT * FROM users WHERE id = ?").get(userId);
      req.user = user;
    }
    next();
  });

  // API Routes
  app.get("/api/me", (req, res) => {
    res.json(req.user || null);
  });

  app.post("/api/login", (req, res) => {
    const { email, password } = req.body;
    const user = db.prepare("SELECT * FROM users WHERE email = ? AND password = ?").get(email, password);
    if (user) {
      res.json(user);
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  });

  app.get("/api/resources", (req, res) => {
    const resources = db.prepare("SELECT * FROM resources WHERE is_published = 1").all();
    res.json(resources);
  });

  app.get("/api/programs", (req, res) => {
    const programs = db.prepare("SELECT * FROM programs").all();
    res.json(programs);
  });

  app.get("/api/my-programs", (req, res) => {
    const user = req.user;
    if (!user) return res.status(401).json({ error: "Unauthorized" });
    const enrollments = db.prepare(`
      SELECT p.*, e.status as enrollment_status, e.progress, e.enrolled_at 
      FROM programs p 
      JOIN program_enrollments e ON p.id = e.program_id 
      WHERE e.user_id = ?
    `).all(user.id);
    res.json(enrollments);
  });

  app.post("/api/enroll", (req, res) => {
    const user = req.user;
    const { programId } = req.body;
    if (!user) return res.status(401).json({ error: "Unauthorized" });
    try {
      db.prepare("INSERT INTO program_enrollments (user_id, program_id) VALUES (?, ?)").run(user.id, programId);
      res.json({ success: true });
    } catch {
      res.status(400).json({ error: "Already enrolled or error" });
    }
  });

  app.get("/api/appointments", (req, res) => {
    const user = req.user;
    if (!user) return res.status(401).json({ error: "Unauthorized" });
    const appointments = db.prepare("SELECT * FROM appointments WHERE student_id = ?").all(user.id);
    res.json(appointments);
  });

  app.post("/api/appointments", (req, res) => {
    const user = req.user;
    const { counselorName, date, type } = req.body;
    if (!user) return res.status(401).json({ error: "Unauthorized" });
    db.prepare("INSERT INTO appointments (student_id, counselor_name, appointment_date, type) VALUES (?, ?, ?, ?)")
      .run(user.id, counselorName, date, type);
    res.json({ success: true });
  });

  // Admin Routes
  app.get("/api/admin/stats", (req, res) => {
    const user = req.user;
    if (!user || user.role !== 'admin') return res.status(403).json({ error: "Forbidden" });
    
    const totalUsers = db.prepare("SELECT COUNT(*) as count FROM users").get();
    const totalResources = db.prepare("SELECT COUNT(*) as count FROM resources").get();
    const totalEnrollments = db.prepare("SELECT COUNT(*) as count FROM program_enrollments").get();
    const totalAppointments = db.prepare("SELECT COUNT(*) as count FROM appointments").get();

    res.json({
      totalUsers: totalUsers.count,
      totalResources: totalResources.count,
      totalEnrollments: totalEnrollments.count,
      totalAppointments: totalAppointments.count
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
