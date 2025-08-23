# Dev Server Instructions

## Stopping the Development Server

### Method 1: Keyboard Shortcut (Recommended)
1. In the command prompt where `npm run dev` is running
2. Press **`Ctrl + C`** to stop the server
3. You should see the server stop and return to the command prompt

### Method 2: Close Command Window
1. Simply close the command prompt/terminal window
2. This will automatically stop the development server

### After Stopping
- You can safely close the browser tab showing `http://localhost:3000`
- Close any other command prompt windows you opened for the project

---

## Starting the Development Server

### Prerequisites
- Make sure you're in the correct project directory
- Ensure PostgreSQL is running (if you're using a local database)

### Steps to Start

1. **Open Command Prompt/Terminal**
   - Press `Windows + R`, type `cmd`, and press Enter
   - Or search for "Command Prompt" in the Start menu

2. **Navigate to Project Directory**
   ```bash
   cd C:\Users\jdomi\Claude\CompetitionSite\competition-site
   ```

3. **Start the Development Server**
   ```bash
   npm run dev
   ```

4. **Wait for Server to Start**
   - You should see output similar to:
   ```
   ▲ Next.js 15.5.0 (Turbopack)
   - Local:        http://localhost:3000
   - Network:      http://192.168.x.x:3000

   ✓ Ready in 3.5s
   ```

5. **Open Browser**
   - Open your web browser
   - Navigate to: `http://localhost:3000`
   - You should see your Next.js application running

---

## Troubleshooting

### Port Already in Use Error
If you see an error like "Port 3000 is already in use":

```bash
# Kill any process using port 3000
npx kill-port 3000

# Then try starting the server again
npm run dev
```

### Database Connection Issues
If you encounter database errors:

1. **Check if PostgreSQL is running**
2. **Verify your `.env.local` file has correct database credentials**
3. **Try regenerating the Prisma client:**
   ```bash
   npx prisma generate
   ```

### Module Not Found Errors
If you see missing module errors:

```bash
# Reinstall dependencies
npm install

# Then start the server
npm run dev
```

---

## Development Workflow

### Typical Development Session

1. **Start Development Server**
   ```bash
   npm run dev
   ```

2. **Make Code Changes**
   - Edit files in your code editor
   - Changes will automatically reload in the browser (Hot Reload)

3. **Test Changes**
   - View changes at `http://localhost:3000`
   - Check browser console for any errors

4. **Stop Server When Done**
   - Press `Ctrl + C` in the command prompt
   - Close browser tabs

### Useful Development Commands

```bash
# Start development server
npm run dev

# Build for production (test build)
npm run build

# Run linting
npm run lint

# Generate Prisma client (after schema changes)
npx prisma generate

# Push database schema changes
npx prisma db push

# Open Prisma Studio (database GUI)
npx prisma studio
```

---

## Quick Reference

| Action | Command |
|--------|---------|
| Start server | `npm run dev` |
| Stop server | `Ctrl + C` |
| Browser URL | `http://localhost:3000` |
| Navigate to project | `cd C:\Users\jdomi\Claude\CompetitionSite\competition-site` |
| Install dependencies | `npm install` |
| Build project | `npm run build` |

---

**Note:** Keep the command prompt window open while developing. The development server needs to run continuously for the application to work in your browser.