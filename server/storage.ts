import {
  type User,
  type InsertUser,
  type BrewingData,
  type InsertBrewingData,
  type BlogPost,
  type InsertBlogPost,
  type Stats,
  type InsertStats,
} from "@shared/schema";
import { supabaseRequest } from "./db";
import { randomUUID } from "crypto";

export interface IStorage {
  // User operations (IMPORTANT: required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  upsertUser(user: InsertUser): Promise<User>;

  // Brewing data operations
  getBrewingData(): Promise<BrewingData | undefined>;
  updateBrewingData(data: any): Promise<BrewingData>;

  // Blog operations
  getAllBlogPosts(): Promise<BlogPost[]>;
  getPublishedBlogPosts(): Promise<BlogPost[]>;
  getBlogPost(id: string): Promise<BlogPost | undefined>;
  createBlogPost(post: any): Promise<BlogPost>;
  updateBlogPost(id: string, post: any): Promise<BlogPost | undefined>;
  deleteBlogPost(id: string): Promise<boolean>;

  // Stats operations
  getStats(): Promise<Stats | undefined>;
  updateStats(stats: any): Promise<Stats>;
}

export class SupabaseStorage implements IStorage {
  // User operations (IMPORTANT: required for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const users = await supabaseRequest(`users?id=eq.${id}`);
    return users[0] || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const users = await supabaseRequest(`users?username=eq.${username}`);
    return users[0] || undefined;
  }

  async createUser(userData: InsertUser): Promise<User> {
    const user = {
      id: randomUUID(),
      ...userData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    const [created] = await supabaseRequest('users', {
      method: 'POST',
      body: JSON.stringify(user),
    });
    return created;
  }

  async upsertUser(userData: InsertUser): Promise<User> {
    const user = {
      ...userData,
      updated_at: new Date().toISOString(),
    };
    const [upserted] = await supabaseRequest(`users?username=eq.${userData.username}`, {
      method: 'POST',
      headers: { 'Prefer': 'resolution=merge-duplicates,return=representation' },
      body: JSON.stringify(user),
    });
    return upserted;
  }

  // Brewing data operations
  async getBrewingData(): Promise<BrewingData | undefined> {
    const data = await supabaseRequest('brewing_data?limit=1');
    return data[0] || undefined;
  }

  async updateBrewingData(data: any): Promise<BrewingData> {
    const existingData = await this.getBrewingData();
    const brewingData = {
      ...data,
      updated_at: new Date().toISOString(),
    };
    
    if (existingData) {
      const [updated] = await supabaseRequest(`brewing_data?id=eq.${existingData.id}`, {
        method: 'PATCH',
        body: JSON.stringify(brewingData),
      });
      return updated;
    } else {
      const [created] = await supabaseRequest('brewing_data', {
        method: 'POST',
        body: JSON.stringify({ id: randomUUID(), ...brewingData }),
      });
      return created;
    }
  }

  // Blog operations
  async getAllBlogPosts(): Promise<BlogPost[]> {
    return await supabaseRequest('blog_posts?order=created_at.desc');
  }

  async getPublishedBlogPosts(): Promise<BlogPost[]> {
    return await supabaseRequest('blog_posts?published=eq.true&order=created_at.desc');
  }

  async getBlogPost(id: string): Promise<BlogPost | undefined> {
    const posts = await supabaseRequest(`blog_posts?id=eq.${id}`);
    return posts[0] || undefined;
  }

  async createBlogPost(post: any): Promise<BlogPost> {
    const blogPost = {
      id: randomUUID(),
      ...post,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    const [created] = await supabaseRequest('blog_posts', {
      method: 'POST',
      body: JSON.stringify(blogPost),
    });
    return created;
  }

  async updateBlogPost(id: string, post: any): Promise<BlogPost | undefined> {
    const blogPost = {
      ...post,
      updated_at: new Date().toISOString(),
    };
    const updated = await supabaseRequest(`blog_posts?id=eq.${id}`, {
      method: 'PATCH',
      body: JSON.stringify(blogPost),
    });
    return updated[0] || undefined;
  }

  async deleteBlogPost(id: string): Promise<boolean> {
    await supabaseRequest(`blog_posts?id=eq.${id}`, {
      method: 'DELETE',
    });
    return true;
  }

  // Stats operations
  async getStats(): Promise<Stats | undefined> {
    const data = await supabaseRequest('stats?limit=1');
    return data[0] || undefined;
  }

  async updateStats(statsData: any): Promise<Stats> {
    const existingStats = await this.getStats();
    const stats = {
      ...statsData,
      updated_at: new Date().toISOString(),
    };
    
    if (existingStats) {
      const [updated] = await supabaseRequest(`stats?id=eq.${existingStats.id}`, {
        method: 'PATCH',
        body: JSON.stringify(stats),
      });
      return updated;
    } else {
      const [created] = await supabaseRequest('stats', {
        method: 'POST',
        body: JSON.stringify({ id: randomUUID(), ...stats }),
      });
      return created;
    }
  }
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private brewingData: BrewingData | undefined;
  private blogPosts: Map<string, BlogPost>;
  private stats: Stats | undefined;

  constructor() {
    this.users = new Map();
    this.blogPosts = new Map();
    this.initializeDefaultData();
    this.initializeAdminUser();
  }

  private initializeDefaultData() {
    // Initialize default brewing data
    this.brewingData = {
      id: randomUUID(),
      kettleTemperature: 100,
      maltTemperature: 99.8,
      mode: "Boil",
      power: 5000,
      timeGMT: "09:45:12",
      fermenterBeerType: "NEIPA",
      fermenterTemperature: 19.5,
      fermenterGravity: 1.012,
      fermenterTotal: "25L",
      fermenterTimeRemaining: "3 dager 4 timer",
      fermenterProgress: 75,
      updatedAt: new Date(),
    };

    // Initialize default stats
    this.stats = {
      id: randomUUID(),
      totalBatches: 47,
      litersProduced: 1180,
      activeFermenters: 3,
      daysSinceLastBatch: 12,
      updatedAt: new Date(),
    };

    // Initialize sample blog posts
    const samplePosts: InsertBlogPost[] = [
      {
        title: "Vårt Første NEIPA Brygg",
        summary: "En dyptykk i vår første erfaring med å brygge en New England IPA. Lærdommer, utfordringer og triumfer.",
        content: "New England IPA har blitt en av våre favorittøl å brygge. I dette innlegget deler vi vår erfaring med å brygge vår første NEIPA, inkludert ingrediensene vi brukte, bryggeprosessen, og hva vi lærte underveis.",
        imageUrl: "https://images.unsplash.com/photo-1608270586620-248524c67de9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        published: true,
      },
      {
        title: "Temperaturkontroll under gjæring",
        summary: "Hvorfor er stabil temperatur så viktig? Vi deler våre beste tips for perfekt gjæring hver gang.",
        content: "Temperaturkontroll er kritisk for å oppnå konsistente resultater i hjemmebryggeriet. Her deler vi våre metoder for å holde stabil temperatur gjennom hele gjæringsprosessen.",
        imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        published: true,
      },
      {
        title: "RAPT.io: En Game Changer",
        summary: "Hvordan sanntidsdata fra RAPT.io har forandret måten vi brygger på. En oversikt over verktøyet.",
        content: "RAPT.io har revolusjonert måten vi overvåker våre brygg på. Med sanntidsdata og fjernkontroll har vi oppnådd bedre konsistens og kvalitet i våre øl.",
        imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        published: true,
      },
    ];

    samplePosts.forEach(post => {
      const blogPost: BlogPost = {
        ...post,
        id: randomUUID(),
        imageUrl: post.imageUrl || null,
        published: post.published || false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.blogPosts.set(blogPost.id, blogPost);
    });
  }

  private async initializeAdminUser() {
    // Create default admin user (password: admin123)
    const bcrypt = await import('bcrypt');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const adminUser: User = {
      id: randomUUID(),
      username: 'admin',
      password: hashedPassword,
      email: null,
      firstName: null,
      lastName: null,
      profileImageUrl: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(adminUser.id, adminUser);
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser,
      id,
      email: insertUser.email || null,
      firstName: insertUser.firstName || null,
      lastName: insertUser.lastName || null,
      profileImageUrl: insertUser.profileImageUrl || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async upsertUser(insertUser: InsertUser): Promise<User> {
    const existingUser = await this.getUserByUsername(insertUser.username);
    if (existingUser) {
      const updatedUser: User = {
        ...existingUser,
        ...insertUser,
        email: insertUser.email || existingUser.email,
        firstName: insertUser.firstName || existingUser.firstName,
        lastName: insertUser.lastName || existingUser.lastName,
        profileImageUrl: insertUser.profileImageUrl || existingUser.profileImageUrl,
        updatedAt: new Date(),
      };
      this.users.set(existingUser.id, updatedUser);
      return updatedUser;
    } else {
      return this.createUser(insertUser);
    }
  }

  async getBrewingData(): Promise<BrewingData | undefined> {
    return this.brewingData;
  }

  async updateBrewingData(data: InsertBrewingData): Promise<BrewingData> {
    this.brewingData = {
      ...data,
      id: this.brewingData?.id || randomUUID(),
      updatedAt: new Date(),
    };
    return this.brewingData;
  }

  async getAllBlogPosts(): Promise<BlogPost[]> {
    return Array.from(this.blogPosts.values()).sort(
      (a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0)
    );
  }

  async getPublishedBlogPosts(): Promise<BlogPost[]> {
    return Array.from(this.blogPosts.values())
      .filter(post => post.published)
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async getBlogPost(id: string): Promise<BlogPost | undefined> {
    return this.blogPosts.get(id);
  }

  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const id = randomUUID();
    const blogPost: BlogPost = {
      ...post,
      id,
      imageUrl: post.imageUrl || null,
      published: post.published || false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.blogPosts.set(id, blogPost);
    return blogPost;
  }

  async updateBlogPost(id: string, post: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    const existing = this.blogPosts.get(id);
    if (!existing) return undefined;

    const updated: BlogPost = {
      ...existing,
      ...post,
      updatedAt: new Date(),
    };
    this.blogPosts.set(id, updated);
    return updated;
  }

  async deleteBlogPost(id: string): Promise<boolean> {
    return this.blogPosts.delete(id);
  }

  async getStats(): Promise<Stats | undefined> {
    return this.stats;
  }

  async updateStats(statsData: InsertStats): Promise<Stats> {
    this.stats = {
      ...statsData,
      id: this.stats?.id || randomUUID(),
      updatedAt: new Date(),
    };
    return this.stats;
  }
}

// Use in-memory storage for local development
export const storage = new MemStorage();
