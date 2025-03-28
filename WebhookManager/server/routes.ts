import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertWebhookSchema } from "@shared/schema";
import axios from "axios";

export async function registerRoutes(app: Express): Promise<Server> {
  // Webhook routes
  app.post("/api/webhooks", async (req, res) => {
    try {
      const data = insertWebhookSchema.parse(req.body);
      const webhook = await storage.createWebhook(data);
      return res.json(webhook);
    } catch (error) {
      console.error("Error creating webhook:", error);
      return res.status(400).json({ message: "Invalid webhook data" });
    }
  });

  app.get("/api/webhooks", async (req, res) => {
    try {
      const webhooks = await storage.getWebhooks();
      return res.json(webhooks);
    } catch (error) {
      console.error("Error fetching webhooks:", error);
      return res.status(500).json({ message: "Failed to fetch webhooks" });
    }
  });

  // Webhook send route
  app.post("/api/webhooks/send", async (req, res) => {
    try {
      const schema = z.object({
        url: z.string().url(),
        message: z.object({
          content: z.string().optional(),
          username: z.string().optional(),
          avatar_url: z.string().optional(),
          embeds: z.array(z.any()).optional(),
          components: z.array(z.any()).optional(),
        }),
      });

      const { url, message } = schema.parse(req.body);

      try {
        const response = await axios.post(url, message);
        return res.json({ success: true, response: response.data });
      } catch (error: any) {
        console.error("Webhook request error:", error.response?.data || error.message);
        return res.status(error.response?.status || 500).json({
          success: false,
          message: "Failed to send webhook",
          error: error.response?.data || error.message,
        });
      }
    } catch (error) {
      console.error("Error sending webhook message:", error);
      return res.status(400).json({ message: "Invalid webhook data" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
