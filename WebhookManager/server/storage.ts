import { users, type User, type InsertUser, type Webhook, type InsertWebhook, type Message, type InsertMessage } from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Webhook methods
  getWebhooks(): Promise<Webhook[]>;
  getWebhook(id: number): Promise<Webhook | undefined>;
  createWebhook(webhook: InsertWebhook): Promise<Webhook>;
  
  // Message methods
  getMessages(webhookId: number): Promise<Message[]>;
  getMessage(id: number): Promise<Message | undefined>;
  createMessage(message: InsertMessage): Promise<Message>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private webhooks: Map<number, Webhook>;
  private messages: Map<number, Message>;
  private userId: number;
  private webhookId: number;
  private messageId: number;

  constructor() {
    this.users = new Map();
    this.webhooks = new Map();
    this.messages = new Map();
    this.userId = 1;
    this.webhookId = 1;
    this.messageId = 1;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Webhook methods
  async getWebhooks(): Promise<Webhook[]> {
    return Array.from(this.webhooks.values());
  }
  
  async getWebhook(id: number): Promise<Webhook | undefined> {
    return this.webhooks.get(id);
  }
  
  async createWebhook(webhook: InsertWebhook): Promise<Webhook> {
    const id = this.webhookId++;
    const now = new Date().toISOString();
    const newWebhook: Webhook = { ...webhook, id, createdAt: now };
    this.webhooks.set(id, newWebhook);
    return newWebhook;
  }
  
  // Message methods
  async getMessages(webhookId: number): Promise<Message[]> {
    return Array.from(this.messages.values()).filter(
      (message) => message.webhookId === webhookId
    );
  }
  
  async getMessage(id: number): Promise<Message | undefined> {
    return this.messages.get(id);
  }
  
  async createMessage(message: InsertMessage): Promise<Message> {
    const id = this.messageId++;
    const now = new Date().toISOString();
    const newMessage: Message = { ...message, id, createdAt: now };
    this.messages.set(id, newMessage);
    return newMessage;
  }
}

export const storage = new MemStorage();
