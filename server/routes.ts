import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";
import { authenticateToken, generateToken, asAuthRequest, type AuthRequest } from "./middleware/auth";
import { insertUserSchema, insertBrewingDataSchema, insertBlogPostSchema, insertStatsSchema } from "@shared/schema";
import { generateBlogPost } from "./services/openai";
import { raptApi } from "./rapt-api";

export async function registerRoutes(app: Express): Promise<Server> {
  app.use(cookieParser());

  // Authentication routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;

      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = generateToken({ id: user.id, username: user.username });
      
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      });

      res.json({ user: { id: user.id, username: user.username } });
    } catch (error) {
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = await storage.createUser({
        username: userData.username,
        password: hashedPassword,
      });

      const token = generateToken({ id: user.id, username: user.username });
      
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000,
      });

      res.json({ user: { id: user.id, username: user.username } });
    } catch (error) {
      res.status(400).json({ message: "Registration failed" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    res.clearCookie("token");
    res.json({ message: "Logged out successfully" });
  });

  app.get("/api/auth/me", authenticateToken, async (req, res) => {
    const authReq = asAuthRequest(req);
    res.json({ user: authReq.user });
  });

  // Public brewing data routes
  app.get("/api/brewing-data", async (req, res) => {
    try {
      // Try RAPT API first if configured
      if (process.env.RAPT_USERNAME && process.env.RAPT_API_SECRET) {
        try {
          const raptData = await raptApi.fetchBrewingData({
            username: process.env.RAPT_USERNAME,
            apiSecret: process.env.RAPT_API_SECRET
          });
          return res.json(raptData);
        } catch (error) {
          console.log('RAPT API failed, falling back to database:', error.message);
        }
      }
      
      // Fallback to database data  
      const data = await storage.getBrewingData();
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch brewing data" });
    }
  });

  // Admin brewing data routes
  app.put("/api/brewing-data", authenticateToken, async (req, res) => {
    try {
      const brewingData = insertBrewingDataSchema.parse(req.body);
      const updated = await storage.updateBrewingData(brewingData);
      res.json(updated);
    } catch (error) {
      res.status(400).json({ message: "Failed to update brewing data" });
    }
  });

  // Public blog routes
  app.get("/api/blog-posts", async (req, res) => {
    try {
      const posts = await storage.getPublishedBlogPosts();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch blog posts" });
    }
  });

  app.get("/api/blog-posts/:id", async (req, res) => {
    try {
      const post = await storage.getBlogPost(req.params.id);
      if (!post || !post.published) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      res.json(post);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch blog post" });
    }
  });

  // Admin blog routes
  app.get("/api/admin/blog-posts", authenticateToken, async (req, res) => {
    try {
      const posts = await storage.getAllBlogPosts();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch blog posts" });
    }
  });

  app.get("/api/admin/blog-posts/:id", authenticateToken, async (req, res) => {
    try {
      const post = await storage.getBlogPost(req.params.id);
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      res.json(post);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch blog post" });
    }
  });

  app.post("/api/admin/blog-posts", authenticateToken, async (req, res) => {
    try {
      const postData = insertBlogPostSchema.parse(req.body);
      const post = await storage.createBlogPost(postData);
      res.json(post);
    } catch (error) {
      res.status(400).json({ message: "Failed to create blog post" });
    }
  });

  app.put("/api/admin/blog-posts/:id", authenticateToken, async (req, res) => {
    try {
      const postData = insertBlogPostSchema.partial().parse(req.body);
      const post = await storage.updateBlogPost(req.params.id, postData);
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      res.json(post);
    } catch (error) {
      res.status(400).json({ message: "Failed to update blog post" });
    }
  });

  app.delete("/api/admin/blog-posts/:id", authenticateToken, async (req, res) => {
    try {
      const success = await storage.deleteBlogPost(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      res.json({ message: "Blog post deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete blog post" });
    }
  });

  // AI blog generation route
  app.post("/api/admin/generate-blog-post", authenticateToken, async (req, res) => {
    try {
      const { topic, additionalContext } = req.body;
      
      if (!topic) {
        return res.status(400).json({ message: "Topic is required" });
      }

      const generatedPost = await generateBlogPost(topic, additionalContext);
      res.json(generatedPost);
    } catch (error) {
      res.status(500).json({ message: "Failed to generate blog post: " + (error as Error).message });
    }
  });

  // Public stats route
  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  // Admin stats route
  app.put("/api/stats", authenticateToken, async (req, res) => {
    try {
      const statsData = insertStatsSchema.parse(req.body);
      const stats = await storage.updateStats(statsData);
      res.json(stats);
    } catch (error) {
      res.status(400).json({ message: "Failed to update stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
