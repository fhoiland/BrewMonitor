# replit.md

## Overview

This is a full-stack brewing dashboard and blog application for the "Prefab Brew Crew" homebrewing group. The application serves as both a public-facing dashboard showing real-time brewing status and a content management system with AI-powered blog post generation. Built with modern web technologies, it features a React frontend with Express backend, PostgreSQL database, and OpenAI integration for automated content creation.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with Vite build system
- **Routing**: Wouter for client-side routing with file-based page structure
- **UI Library**: Radix UI primitives with shadcn/ui component system
- **Styling**: Tailwind CSS with custom brewing-themed color palette and CSS variables
- **State Management**: TanStack Query for server state management and caching
- **Form Handling**: React Hook Form with Zod validation schemas
- **Authentication**: Context-based auth system with JWT token management

### Backend Architecture
- **Runtime**: Node.js with Express.js framework using ESM modules
- **Database ORM**: Drizzle ORM with PostgreSQL dialect and type-safe schema definitions
- **Authentication**: JWT-based sessions stored in HTTP-only cookies with bcrypt password hashing
- **API Structure**: RESTful API with separate routes for public endpoints and protected admin functionality
- **Middleware**: Cookie parsing, authentication guards, and request logging
- **Error Handling**: Centralized error handling with proper HTTP status codes

### Data Storage
- **Primary Database**: PostgreSQL with connection via @neondatabase/serverless
- **Schema Design**: Four main entities - users, brewing_data, blog_posts, and stats
- **Migration System**: Drizzle Kit for schema migrations and database synchronization
- **Storage Strategy**: In-memory storage interface with database persistence layer

### Authentication & Authorization
- **Session Management**: JWT tokens with 24-hour expiration stored in HTTP-only cookies
- **Password Security**: bcrypt hashing with salt rounds for user credentials
- **Route Protection**: Middleware-based authentication for admin routes (/admin/*)
- **Role-based Access**: Simple user-based authentication without complex role systems

### External Integrations
- **AI Content Generation**: OpenAI GPT-4o integration for automated blog post creation
- **Image Handling**: URL-based image storage for blog post featured images
- **Font Integration**: Google Fonts (Space Grotesk, Inter, Fira Code, Geist Mono)

## External Dependencies

### Core Framework Dependencies
- **React Ecosystem**: React 18 with React DOM, React Hook Form, and TanStack Query
- **Express Server**: Express.js with cookie-parser middleware
- **Database**: Drizzle ORM, PostgreSQL via Neon serverless, connect-pg-simple for sessions

### UI and Styling
- **Component Library**: Complete Radix UI primitive collection (@radix-ui/react-*)
- **Styling**: Tailwind CSS with PostCSS, class-variance-authority for component variants
- **Utilities**: clsx and tailwind-merge for conditional styling, date-fns for date formatting

### Authentication and Security
- **JWT Management**: jsonwebtoken for token creation and verification
- **Password Security**: bcrypt for password hashing and comparison
- **Session Storage**: connect-pg-simple for PostgreSQL session storage

### Development and Build Tools
- **Build System**: Vite with React plugin and runtime error overlay for development
- **TypeScript**: Full TypeScript support with strict configuration
- **Development**: tsx for TypeScript execution, esbuild for production builds

### AI and Content Generation
- **OpenAI Integration**: OpenAI SDK for GPT-4o model access and structured content generation
- **Validation**: Zod schemas for runtime type checking and form validation

### Replit-Specific
- **Development Tools**: Replit-specific Vite plugins for cartographer and runtime error handling
- **Environment**: Configured for Replit development environment with proper asset handling