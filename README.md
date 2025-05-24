# Share-EZ 📁🔗

A sleek, modern file sharing web application that allows users to upload files and generate short, shareable download links instantly.

## ✨ Features

- **Quick File Upload**: Drag & drop or click to upload any file type
- **Short Links**: Generate 3-digit numeric codes for easy sharing (e.g., `yoursite.com/123`)
- **Instant Sharing**: Copy shareable links with one click
- **Auto Cleanup**: Files are automatically deleted after 1 minute via Vercel Cron
- **Modern UI**: Beautiful dark theme with orange accents
- **Cloud Storage**: Files stored securely in MongoDB Atlas
- **Serverless Ready**: Optimized for Vercel deployment
- **Mobile Friendly**: Responsive design works on all devices

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas
- **File Upload**: Multer
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Backend**: MongoDB
- **Deployment**: Vercel (Serverless)
- **Automation**: Vercel Cron Jobs

## 📁 Project Structure

```
file-share-app/
├── api/                    # Vercel serverless functions
│   ├── index.js           # Main API entry point
│   └── cleanup.js         # Automated file cleanup
├── public/                # Static frontend files
│   ├── script.js          # Client-side JavaScript
│   ├── styles.css         # CSS styling
│   └── uploads/           # Local file storage (dev only)
├── src/
│   ├── app.js             # Express application
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Custom middleware
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── utils/             # Utility functions
│   └── views/             # HTML templates
├── vercel.json            # Vercel configuration
└── package.json           # Dependencies and scripts
```

## 🔧 Installation & Setup

### Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account
- Vercel account (for deployment)

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/Share-EZ.git
   cd Share-EZ
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   
   Create a `.env` file in the root directory:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
   NODE_ENV=development
   CRON_SECRET=your-random-secret-key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:3000`

## 🌐 Deployment to Vercel

### Prerequisites
1. **MongoDB Atlas Account**: Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. **Vercel Account**: Sign up at [Vercel](https://vercel.com)
3. **GitHub Account**: For code hosting

### Automatic Deployment

1. **Connect to GitHub**
   - Push your code to GitHub
   - Import project in Vercel dashboard
   - Vercel will auto-deploy on every push

### Manual Deployment

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel --prod
   ```

### Deployment Steps

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/file-share-app.git
   git push -u origin main
   ```

2. **Deploy to Vercel**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Import your GitHub repository
   - Add environment variables (see below)
   - Deploy!

### Environment Variables

Set these in your Vercel dashboard:

- `MONGODB_URI`: Your MongoDB Atlas connection string
- `CRON_SECRET`: Secret key for cron job authentication

## ⚙️ Configuration

### MongoDB Atlas Setup

1. Create a MongoDB Atlas cluster
2. Create a database user
3. Whitelist your IP (or use 0.0.0.0/0 for all IPs)
4. Get your connection string
5. Add it to your `.env` file

### Vercel Cron Jobs

The app includes automatic file cleanup every minute:

```json
{
  "crons": [{
    "path": "/api/cleanup",
    "schedule": "* * * * *"
  }]
}
```

## 🎨 Customization

### Styling

Modify `public/styles.css` to customize the appearance:
- Color scheme (currently black/orange theme)
- Layout and spacing
- Button styles
- Typography

### File Cleanup Timing

Adjust cleanup interval in `vercel.json`:
- `"* * * * *"` = Every minute
- `"*/5 * * * *"` = Every 5 minutes
- `"0 * * * *"` = Every hour

### Code Length

Change the short ID length in `src/utils/shortIdGenerator.js`:
```javascript
// Current: 3-digit codes (100-999)
return Math.floor(Math.random() * 900 + 100).toString();

// For 4-digit codes (1000-9999):
return Math.floor(Math.random() * 9000 + 1000).toString();
```

## 📊 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Main application page |
| `POST` | `/upload` | Upload a file |
| `GET` | `/:shortId` | Download file by short ID |
| `DELETE` | `/upload/cleanup/:shortId` | Delete specific file |
| `POST` | `/api/cleanup` | Automated cleanup (cron) |
| `GET` | `/health` | Health check endpoint |

## 🔒 Security Features

- **File Validation**: Server-side file type checking
- **Size Limits**: Configurable upload size restrictions
- **Cron Authentication**: Secret-based cron job protection
- **Input Sanitization**: Prevents malicious uploads
- **Auto Cleanup**: Prevents storage abuse

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**
   - Check your connection string
   - Verify network access in MongoDB Atlas
   - Ensure correct username/password

2. **File Upload Failed**
   - Check file size limits
   - Verify file permissions
   - Check network connectivity

3. **Vercel Deployment Issues**
   - Verify environment variables
   - Check build logs
   - Ensure all dependencies are listed

### Debug Mode

Enable debug logging by setting:
```env
NODE_ENV=development
```

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

If you encounter any issues or have questions:

- Open an issue on GitHub
- Check the troubleshooting section
- Review Vercel deployment logs

## ⭐ Acknowledgments

- Built with Express.js and MongoDB
- Deployed on Vercel
- UI inspired by modern dark themes
- Icons and fonts from Google Fonts

---

**Made with ❤️ for easy file sharing**
