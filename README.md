# Web Tools by Rudeboy™

![Rudeboy Logo](https://raw.githubusercontent.com/1gby/seamless-checker/main/assets/icons/icon.png)

A collection of powerful, browser-based web tools designed for creators, designers, and media enthusiasts. Built with modern web technologies and deployed on Vercel.

[![Live Demo](https://img.shields.io/badge/Live-Demo-764ba2?style=for-the-badge)](https://rud3boy.vercel.app)
[![Ko-fi](https://img.shields.io/badge/Support-Ko--fi-FF5E5B?style=for-the-badge&logo=ko-fi&logoColor=white)](https://ko-fi.com/rud3boy)
[![Instagram](https://img.shields.io/badge/Instagram-E4405F?style=for-the-badge&logo=instagram&logoColor=white)](https://www.instagram.com/createdbyrudeboy)

## 🚀 Live Applications

- **[Main Hub](https://rud3boy.vercel.app)** - Central dashboard for all tools
- **[Pattern Checker](https://rud3boy.vercel.app/seamless)** - Seamless pattern checker
- **[File Converter](https://rud3boy.vercel.app/converter)** - Universal media file conversion
- **[Watcher](https://rud3boy.vercel.app/watcher)** - Entertainment streaming platform

-----

## 📋 Table of Contents

- [Applications](#-applications)
  - [Seamless Pattern Checker](#-seamless-pattern-checker-pimp)
  - [Universal File Converter](#-universal-file-converter)
  - [Watcher](#-watcher)
- [Features](#-features)
- [Technologies](#-technologies)
- [Installation](#-installation)
- [Usage](#-usage)
- [API Keys](#-api-keys)
- [Contributing](#-contributing)
- [License](#-license)
- [Support](#-support)

-----

## 🎨 Applications

### 🔲 Seamless Pattern Checker (P.I.M.P)

**Pattern Image Management Platform** - A comprehensive toolkit for creating, testing, and exporting seamless patterns for print-on-demand and digital products.

#### Key Features:

- **Pattern Testing**
  - Full Drop, Half Drop, and Brick repeat patterns
  - Seamless edge detection with red overlay
  - Real-time preview with zoom (1%-800%) and pan
  - Grid overlay for scale visualization (1”, 2”, 6”, 12”)
- **Canvas Quality Options**
  - Standard (1200px), High (1600px), Ultra (2400px), Max (3200px)
  - Custom canvas sizes up to 4800px for print
  - Transparent grid, black, white, or gray backgrounds
- **Design Tools**
  - Color palette extraction (top 9 dominant colors)
  - Hex color checker with live preview
  - Dimension calculator with preset recommendations
  - Pattern transform controls (offset, scale, positioning)
- **Export Options**
  - Multiple resolutions: 1200px - 4800px
  - PNG (lossless) or JPG (compressed) formats
  - Print-on-demand optimized sizes:
    - Redbubble (1600px)
    - Society6 (2400px)
    - Spoonflower (2000px)
    - Zazzle (3200px)
- **Product Mockups**
  - Preview patterns on phone cases, tote bags, mugs, bedding, etc.
  - Adjustable zoom (100%-150%) and rotation (0-360°)
  - Infinite tile and grid view modes
- **Pattern Management**
  - Save patterns to local storage with all settings
  - Quick load from saved library
  - Sample patterns included (Mushrooms, Jolt Cola, Beaver, etc.)
- **Quality Analytics**
  - Quality score (Excellent/Good/Low)
  - Contrast level (High/Medium/Low)
  - Unique color count
  - Canvas size indicator
- **Mobile Features**
  - Progressive Web App support
  - Haptic feedback on mobile devices
  - Pinch-to-zoom gestures
  - Install as home screen app

#### Use Cases:

- Print-on-demand product design
- Textile and fabric pattern creation
- Digital wallpaper and background design
- Graphic design portfolio development

-----

### 🔄 Universal File Converter

Browser-based file conversion tool supporting images, audio, and documents with quality controls and real-time preview.

#### Supported Formats:

**Images** 🖼️

- Input/Output: PNG, JPG, WebP, GIF, BMP, TIFF, ICO, AVIF
- Color Effects: Grayscale, Sepia, Invert
- Custom dimensions with aspect ratio preservation

**Audio** 🎵

- Lossless: FLAC, WAV
- Lossy: MP3, AAC/M4A, OGG
- Quality control slider (60%-100%)

**Documents** 📄

- PDF, TXT
- Basic text extraction and formatting

#### Key Features:

- Drag-and-drop file upload
- Real-time file preview (before and after)
- Quality slider (1%-100%)
- Custom dimension controls for images
- Format-specific recommendations
- File size optimization
- Client-side processing (no uploads to servers)

#### Recommended Settings:

- **Website images:** WebP @ 85% or JPG @ 80-85%
- **Logos/graphics:** PNG @ 100%
- **Social media:** JPG @ 80-85%
- **Music archiving:** FLAC (lossless)
- **General listening:** MP3 @ 80-90%
- **Podcasts:** MP3 @ 60-70%

-----

### 🎬 Watcher

A modern entertainment streaming platform featuring TMDB integration, favorites management, and comprehensive content discovery.

#### Key Features:

**Content Discovery**

- Airing Today
- New Releases
- Trending Movies & TV Shows
- Weekly Highlights
- Most Anticipated Content
- Genre-based browsing

**Favorites System**

- Real-time synchronization
- Separate categories: All, Movies, TV Shows, Actors
- Local storage persistence
- Quick add/remove functionality

**Content Details**

- Full cast and crew information
- Trailers and video content
- Episode guides for TV shows
- Season selectors
- High-quality artwork from Fanart.tv
- User ratings and reviews

**Actor Profiles**

- Comprehensive filmography
- Biography and personal details
- Random movie backdrop rotation
- Known-for highlights

**User Experience**

- Infinite scroll pagination
- Search functionality
- Genre filters
- Responsive mobile design
- iOS home screen support (PWA)
- Loading states with progress indicators

**Technical Features**

- TMDB API integration via Vercel serverless functions
- Fanart.tv API for enhanced artwork
- Secure API key management
- localStorage favorites sync
- Responsive grid layouts
- Mobile-optimized UI

-----

## ✨ Features

### Common Features Across All Apps:

- **🌤️ Live Weather Widget**
  - Real-time temperature and conditions
  - Auto-location detection
  - Automatic unit conversion (°F for US, °C elsewhere)
  - Current time display
- **📱 Progressive Web App (PWA)**
  - Install on home screen (iOS & Android)
  - Offline functionality
  - Native app-like experience
- **🎨 Modern UI/UX**
  - Clean, intuitive interface
  - Responsive design (mobile, tablet, desktop)
  - Smooth animations and transitions
  - Haptic feedback on mobile
- **📊 Analytics**
  - Visitor tracking with badge display
  - Real-time usage statistics
- **💾 Local Storage**
  - No account required
  - Client-side data persistence
  - Privacy-focused (no data uploads)

-----

## 🛠️ Technologies

### Frontend

- **HTML5/CSS3** - Modern web standards
- **JavaScript (ES6+)** - Vanilla JS for performance
- **Canvas API** - Pattern rendering and image processing
- **Web Workers** - Background processing for file conversions
- **Service Workers** - PWA offline functionality
- **LocalStorage API** - Client-side data persistence

### Backend & Deployment

- **Vercel** - Serverless deployment and hosting
- **Vercel Serverless Functions** - API proxying for security
- **Node.js** - Server-side runtime

### APIs & Services

- **The Movie Database (TMDB) API** - Movie and TV data
- **Fanart.tv API** - High-quality artwork
- **OpenWeatherMap API** - Weather data
- **Geolocation API** - Location services

### Design & Assets

- **Custom Icons** - Rudeboy™ branding
- **Responsive Grid System** - Mobile-first design
- **CSS Variables** - Theme customization

-----

## 💻 Installation

### Prerequisites

- Node.js 16.x or higher
- npm or yarn
- Vercel CLI (optional, for local development)

### Local Development

1. **Clone the repository**
   
   ```bash
   git clone https://github.com/yourusername/web-tools-rudeboy.git
   cd web-tools-rudeboy
   ```
1. **Install dependencies**
   
   ```bash
   npm install
   ```
1. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   
   ```env
   TMDB_API_KEY=your_tmdb_api_key
   FANART_API_KEY=your_fanart_api_key
   WEATHER_API_KEY=your_openweathermap_api_key
   ```
1. **Run development server**
   
   ```bash
   npm run dev
   # or
   vercel dev
   ```
1. **Open in browser**
   Navigate to `http://localhost:3000`

### Deployment to Vercel

1. **Install Vercel CLI**
   
   ```bash
   npm install -g vercel
   ```
1. **Deploy**
   
   ```bash
   vercel
   ```
1. **Set environment variables**
- Go to your Vercel dashboard
- Navigate to project settings
- Add environment variables under “Environment Variables”
1. **Production deployment**
   
   ```bash
   vercel --prod
   ```

-----

## 📖 Usage

### Seamless Pattern Checker

1. Upload a square tile image or try a sample pattern
1. Adjust canvas quality and preview settings
1. Test seamless edges with the red overlay tool
1. Extract color palette and calculate dimensions
1. Preview on product mockups
1. Export in your desired resolution and format

### Universal File Converter

1. Drag and drop your file or click to upload
1. Select your desired output format
1. Adjust quality slider (if applicable)
1. Set custom dimensions for images (optional)
1. Click “Convert” and wait for processing
1. Download your converted file

### Watcher

1. Browse content by category or genre
1. Click on any movie/show for detailed information
1. Add items to favorites with the star icon
1. View actor profiles and filmographies
1. Watch trailers and explore recommendations
1. Use search to find specific content

-----

## 🔑 API Keys

This project requires API keys for full functionality:

### Required APIs:

1. **TMDB (The Movie Database)**
- Get your key: https://www.themoviedb.org/settings/api
- Used in: Watcher application
- Free tier available
1. **Fanart.tv**
- Get your key: https://fanart.tv/get-an-api-key/
- Used in: Watcher application
- Free tier available
1. **OpenWeatherMap**
- Get your key: https://openweathermap.org/api
- Used in: Weather widget (all apps)
- Free tier available

### Securing API Keys:

API keys are protected using Vercel serverless functions to prevent exposure in client-side code. Never commit API keys to your repository.

**Example serverless function** (`/api/tmdb.js`):

```javascript
export default async function handler(req, res) {
  const { endpoint } = req.query;
  const response = await fetch(
    `https://api.themoviedb.org/3/${endpoint}?api_key=${process.env.TMDB_API_KEY}`
  );
  const data = await response.json();
  res.status(200).json(data);
}
```

-----

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
1. Create a feature branch (`git checkout -b feature/AmazingFeature`)
1. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
1. Push to the branch (`git push origin feature/AmazingFeature`)
1. Open a Pull Request

### Code Style

- Use ES6+ syntax
- Follow existing naming conventions
- Comment complex logic
- Test on multiple browsers and devices

-----

## 📄 License

This project is licensed under the MIT License - see the <LICENSE> file for details.

-----

## 💖 Support

If you find these tools useful, consider supporting the project:

[![Ko-fi](https://storage.ko-fi.com/cdn/kofi_stroke_cup.svg)](https://ko-fi.com/rud3boy)

### Connect

- **Instagram:** [@createdbyrudeboy](https://www.instagram.com/createdbyrudeboy)
- **Website:** [rud3boy.vercel.app](https://rud3boy.vercel.app)

-----

## 🙏 Acknowledgments

- [The Movie Database (TMDB)](https://www.themoviedb.org/) - Movie and TV data
- [Fanart.tv](https://fanart.tv/) - High-quality artwork
- [OpenWeatherMap](https://openweathermap.org/) - Weather data
- [Vercel](https://vercel.com/) - Hosting and serverless functions
- All contributors and users of these tools

-----

## 📊 Stats

![Visitors](https://hits.sh/rud3boy.vercel.app.svg?style=flat&label=Visitors&color=10b981&labelColor=764ba2)

-----

**Created by Rudeboy™** | © 2025 All Rights Reserved