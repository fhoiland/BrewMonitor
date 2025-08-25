# 🍺 Prefab Brew Crew Dashboard

A modern brewing dashboard and blog platform for the Prefab Brew Crew homebrewing group. Built with React, Express, and PostgreSQL.

## Features

- **Real-time Brewing Dashboard** - Monitor kettle temperature, fermenter status, and brewing progress
- **Blog Management** - Create and manage brewing blog posts with AI assistance
- **Admin Panel** - Secure authentication and content management
- **Responsive Design** - Works perfectly on desktop and mobile
- **AI-Powered Content** - Generate blog posts with OpenAI integration

## Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/brewing-dashboard.git
   cd brewing-dashboard
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your database and API keys
   ```

3. **Install and run**
   ```bash
   npm install
   npm run dev
   ```

4. **Access the app**
   - Dashboard: http://localhost:5000
   - Admin login: username `admin`, password `admin123`

## Deployment

This app is ready to deploy to any modern hosting platform:

- **Vercel** (Recommended) - One-click deployment
- **Railway** - Full-stack hosting with database
- **Render** - Free tier available

See [deploy.md](deploy.md) for detailed deployment instructions.

## Tech Stack

- **Frontend**: React, Vite, TailwindCSS, Radix UI
- **Backend**: Express.js, Drizzle ORM
- **Database**: PostgreSQL (Neon)
- **Authentication**: JWT with HTTP-only cookies
- **AI**: OpenAI GPT-4 for content generation

## Environment Variables

- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret key for authentication
- `OPENAI_API_KEY` - For AI blog generation (optional)
- `NODE_ENV` - Set to "production" for deployment

## License

MIT License - feel free to use this for your own brewing projects!

---

🍻 Happy brewing with the Prefab Brew Crew!