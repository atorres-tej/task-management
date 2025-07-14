# 🚀 Quick Start Guide

## Prerequisites
- Node.js 18+ installed
- Git installed

## Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/atorres-tej/task-management-front.git
cd task-management-front
```

### 2. Install dependencies
```bash
npm install
# or if you have pnpm
pnpm install
```

### 3. Set up environment variables
```bash
# Copy the example file
cp .env.example .env.local

# Edit .env.local with your credentials
# You can use any text editor
notepad .env.local
```

**Important**: Replace the placeholder values in `.env.local` with your actual Microsoft OAuth credentials, or contact the project maintainer for development credentials.

### 4. Run the development server
```bash
npm run dev
# or
pnpm dev
```

### 5. Open your browser
Navigate to [http://localhost:3000](http://localhost:3000)

## 🔑 Getting OAuth Credentials

To get new Microsoft OAuth credentials:

1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to **Azure Active Directory** > **App registrations**
3. Click **New registration**
4. Set redirect URI to: `http://localhost:3000/auth/callback`
5. Copy the **Application (client) ID**
6. Generate a **Client secret**
7. Update your `.env.local` file with these values

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run code linter

## 🆘 Troubleshooting

**Authentication not working?**
- Check your `.env.local` file has the correct credentials
- Verify the redirect URI matches in Azure and your `.env.local`

**Dependencies issues?**
- Delete `node_modules` and run `npm install` again
- Make sure you're using Node.js 18+
