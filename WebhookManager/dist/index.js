// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
var MemStorage = class {
  users;
  webhooks;
  messages;
  userId;
  webhookId;
  messageId;
  constructor() {
    this.users = /* @__PURE__ */ new Map();
    this.webhooks = /* @__PURE__ */ new Map();
    this.messages = /* @__PURE__ */ new Map();
    this.userId = 1;
    this.webhookId = 1;
    this.messageId = 1;
  }
  // User methods
  async getUser(id) {
    return this.users.get(id);
  }
  async getUserByUsername(username) {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }
  async createUser(insertUser) {
    const id = this.userId++;
    const user = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  // Webhook methods
  async getWebhooks() {
    return Array.from(this.webhooks.values());
  }
  async getWebhook(id) {
    return this.webhooks.get(id);
  }
  async createWebhook(webhook) {
    const id = this.webhookId++;
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const newWebhook = { ...webhook, id, createdAt: now };
    this.webhooks.set(id, newWebhook);
    return newWebhook;
  }
  // Message methods
  async getMessages(webhookId) {
    return Array.from(this.messages.values()).filter(
      (message) => message.webhookId === webhookId
    );
  }
  async getMessage(id) {
    return this.messages.get(id);
  }
  async createMessage(message) {
    const id = this.messageId++;
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const newMessage = { ...message, id, createdAt: now };
    this.messages.set(id, newMessage);
    return newMessage;
  }
};
var storage = new MemStorage();

// server/routes.ts
import { z } from "zod";

// shared/schema.ts
import { pgTable, text, serial, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull()
});
var webhooks = pgTable("webhooks", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  url: text("url").notNull(),
  avatar: text("avatar"),
  createdAt: text("created_at").notNull().default("NOW()")
});
var messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  webhookId: serial("webhook_id").references(() => webhooks.id),
  content: text("content"),
  username: text("username"),
  avatarUrl: text("avatar_url"),
  embeds: jsonb("embeds").$type(),
  components: jsonb("components").$type(),
  createdAt: text("created_at").notNull().default("NOW()")
});
var insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true
});
var insertWebhookSchema = createInsertSchema(webhooks).pick({
  name: true,
  url: true,
  avatar: true
});
var insertMessageSchema = createInsertSchema(messages).pick({
  webhookId: true,
  content: true,
  username: true,
  avatarUrl: true,
  embeds: true,
  components: true
});

// server/routes.ts
import axios from "axios";
async function registerRoutes(app2) {
  app2.post("/api/webhooks", async (req, res) => {
    try {
      const data = insertWebhookSchema.parse(req.body);
      const webhook = await storage.createWebhook(data);
      return res.json(webhook);
    } catch (error) {
      console.error("Error creating webhook:", error);
      return res.status(400).json({ message: "Invalid webhook data" });
    }
  });
  app2.get("/api/webhooks", async (req, res) => {
    try {
      const webhooks2 = await storage.getWebhooks();
      return res.json(webhooks2);
    } catch (error) {
      console.error("Error fetching webhooks:", error);
      return res.status(500).json({ message: "Failed to fetch webhooks" });
    }
  });
  app2.post("/api/webhooks/send", async (req, res) => {
    try {
      const schema = z.object({
        url: z.string().url(),
        message: z.object({
          content: z.string().optional(),
          username: z.string().optional(),
          avatar_url: z.string().optional(),
          embeds: z.array(z.any()).optional(),
          components: z.array(z.any()).optional()
        })
      });
      const { url, message } = schema.parse(req.body);
      try {
        const response = await axios.post(url, message);
        return res.json({ success: true, response: response.data });
      } catch (error) {
        console.error("Webhook request error:", error.response?.data || error.message);
        return res.status(error.response?.status || 500).json({
          success: false,
          message: "Failed to send webhook",
          error: error.response?.data || error.message
        });
      }
    } catch (error) {
      console.error("Error sending webhook message:", error);
      return res.status(400).json({ message: "Invalid webhook data" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2, { dirname as dirname2 } from "path";
import { fileURLToPath as fileURLToPath2 } from "url";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import themePlugin from "@replit/vite-plugin-shadcn-theme-json";
import path, { dirname } from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { fileURLToPath } from "url";
var __filename = fileURLToPath(import.meta.url);
var __dirname = dirname(__filename);
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    themePlugin(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "attached_assets")
    }
  },
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var __filename2 = fileURLToPath2(import.meta.url);
var __dirname2 = dirname2(__filename2);
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        __dirname2,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(__dirname2, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
