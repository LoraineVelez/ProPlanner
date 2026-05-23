import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Use JSON middleware for state serialization up to 20MB
  app.use(express.json({ limit: "20mb" }));

  const DATA_FILE = path.join(process.cwd(), "calendar-store.json");

  // Helper to read current database state safely
  const loadState = () => {
    try {
      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, "utf-8");
        return JSON.parse(raw);
      }
    } catch (e) {
      console.error("Error reading local database file:", e);
    }
    return {};
  };

  // endpoint to retrieve the latest state
  app.get("/api/calendar-state", (req, res) => {
    const data = loadState();
    res.json(data);
  });

  // endpoint to save the modified state
  app.post("/api/calendar-state", (req, res) => {
    try {
      const state = req.body;
      fs.writeFileSync(DATA_FILE, JSON.stringify(state, null, 2), "utf-8");
      res.json({ success: true, savedAt: new Date().toISOString() });
    } catch (e) {
      console.error("Error writing local database file:", e);
      res.status(500).json({ error: "Failed to persist calendar state to disk" });
    }
  });

  // Vite middleware setup for assets and SPA rendering
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in DEVELOPMENT mode with Vite dev middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "custom",
    });
    app.use(vite.middlewares);

    app.get("*", async (req, res, next) => {
      if (req.path.startsWith("/api") || req.path.includes(".")) {
        return next();
      }
      try {
        const url = req.originalUrl;
        let template = fs.readFileSync(path.resolve(process.cwd(), "index.html"), "utf-8");
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ "Content-Type": "text/html" }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    console.log("Starting server in PRODUCTION mode with static file assets...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Success: Full-Stack Dev Server is live at http://localhost:${PORT}`);
  });
}

startServer();
