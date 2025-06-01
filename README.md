# Pet Daily Reminders PWA

A beautiful, mobile-first Progressive Web App (PWA) built with Next.js, TypeScript, and Tailwind CSS for managing daily pet care reminders.

## Features

- 📱 **Mobile-First Design**: Responsive interface optimized for mobile devices
- 📅 **Calendar Integration**: Week view with current day highlighting
- ⏰ **Time-Based Organization**: Reminders grouped by Morning, Afternoon, Evening, Night
- 🐕 **Pet Management**: Support for multiple pets with filtering
- 📝 **Rich Reminders**: Title, notes, frequency, and category support
- ✅ **Completion Tracking**: Mark reminders as completed with visual feedback
- 🔄 **CRUD Operations**: Full Create, Read, Update, Delete functionality
- 📱 **PWA Support**: Installable with offline capabilities
- 🎨 **Modern UI**: Clean design matching Figma specifications

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: MongoDB
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **PWA**: Service Worker with caching

## Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB installed locally or MongoDB Atlas account

### Installation

1. **Clone the repository**:

   ```bash
   git clone <repository-url>
   cd nextjs-app
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env.local` file in the root directory:

   ```env
   # For local MongoDB
   MONGODB_URI=mongodb://localhost:27017/pet-reminders
   MONGODB_DB=pet-reminders

   # For MongoDB Atlas (replace with your connection string)
   # MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/pet-reminders?retryWrites=true&w=majority
   ```

### MongoDB Setup Options

#### Option 1: Local MongoDB

1. **Install MongoDB** (if not already installed):

   ```bash
   # macOS with Homebrew
   brew tap mongodb/brew
   brew install mongodb-community

   # Start MongoDB service
   brew services start mongodb/brew/mongodb-community
   ```

2. **Verify MongoDB is running**:
   ```bash
   mongosh
   # Should connect to mongodb://127.0.0.1:27017
   ```

#### Option 2: MongoDB Atlas (Cloud)

1. **Create a free account** at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. **Create a new cluster**
3. **Get your connection string**:
   - Go to Database → Connect → Connect your application
   - Choose Node.js driver
   - Copy the connection string
4. **Update `.env.local`** with your Atlas connection string

### Running the Application

1. **Start the development server**:

   ```bash
   npm run dev
   ```

2. **Open your browser** and navigate to [http://localhost:3000](http://localhost:3000)

3. **Test PWA functionality**:
   - Open browser dev tools
   - Go to Application tab
   - Check Service Workers and Manifest

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── pets/          # Pet CRUD operations
│   │   └── reminders/     # Reminder CRUD operations
│   ├── layout.tsx         # Root layout with PWA setup
│   └── page.tsx           # Main dashboard
├── components/
│   ├── Calendar.tsx       # Week calendar strip
│   ├── ReminderCard.tsx   # Individual reminder display
│   └── ReminderForm.tsx   # Add/edit reminder form
├── lib/
│   ├── types.ts           # TypeScript interfaces
│   ├── utils.ts           # Utility functions
│   └── mongodb.ts         # Database connection
public/
├── manifest.json          # PWA manifest
├── sw.js                  # Service worker
└── icons/                 # PWA icons (to be added)
```

## API Endpoints

### Pets

- `GET /api/pets` - Fetch all pets
- `POST /api/pets` - Create a new pet

### Reminders

- `GET /api/reminders` - Fetch reminders (with filtering)
- `POST /api/reminders` - Create a new reminder
- `GET /api/reminders/[id]` - Fetch specific reminder
- `PUT /api/reminders/[id]` - Update reminder
- `DELETE /api/reminders/[id]` - Delete reminder

## Key Features

### Calendar Component

- Week view with Monday start
- Current day highlighting
- Date selection functionality
- Responsive design

### Reminder Management

- Time-slot grouping (Morning, Afternoon, Evening, Night)
- Pet and category filtering
- Completion tracking
- In-line editing
- Form validation

### PWA Features

- Service worker for offline functionality
- Web app manifest for installation
- Mobile-optimized meta tags
- Touch-friendly interface

## Data Models

### Pet

```typescript
interface Pet {
  id: string;
  name: string;
  species?: string;
  breed?: string;
  avatar?: string;
}
```

### Reminder

```typescript
interface Reminder {
  id: string;
  title: string;
  petId: string;
  petName: string;
  category: "General" | "Lifestyle" | "Health";
  notes?: string;
  startDate: string;
  endDate?: string;
  time: string;
  frequency: "Once" | "Daily" | "Weekly" | "Monthly";
  isCompleted: boolean;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}
```

## Development

### Adding PWA Icons

Create icons in the following sizes and place them in `public/icons/`:

- 72x72, 96x96, 128x128, 144x144, 152x152, 192x192, 384x384, 512x512

You can use tools like [PWA Builder](https://www.pwabuilder.com/) or [Favicon Generator](https://realfavicongenerator.net/) to generate all required sizes.

### Building for Production

```bash
npm run build
npm start
```

### Testing PWA

1. Build and serve the production version
2. Open Chrome DevTools → Lighthouse
3. Run PWA audit to verify compliance

## Troubleshooting

### MongoDB Connection Issues

- Ensure MongoDB is running locally or Atlas connection string is correct
- Check firewall settings for Atlas connections
- Verify network access in Atlas dashboard

### PWA Not Working

- Check service worker registration in browser dev tools
- Verify manifest.json is accessible
- Ensure HTTPS for production (required for PWA)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details
# pet-reminder
