# File Share App

This project is a web application that allows users to upload files and generates shareable short download links.

## Features

- User-friendly black/orange themed interface
- File upload with automatic short link generation (3-digit IDs)
- Automatic cleanup when users leave the page
- MongoDB Atlas for cloud storage
- Vercel-ready deployment

## 🚀 Deploy to Vercel

### Prerequisites
1. **MongoDB Atlas Account**: Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. **Vercel Account**: Sign up at [Vercel](https://vercel.com)
3. **GitHub Account**: For code hosting

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
   - Add environment variable: `MONGODB_URI` with your MongoDB Atlas connection string
   - Deploy!

### Environment Variables
Set this in Vercel Dashboard → Project → Settings → Environment Variables:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/file-share-app?retryWrites=true&w=majority
```

## Project Structure

```
file-share-app
├── src
│   ├── app.js                # Entry point of the application
│   ├── controllers
│   │   └── uploadController.js # Handles file upload logic
│   ├── routes
│   │   └── uploadRoutes.js    # Defines routes for file uploads
│   ├── middleware
│   │   └── fileUpload.js      # Middleware for handling file uploads
│   ├── views
│   │   └── index.html         # Main page for file uploads
│   └── utils
│       └── linkGenerator.js    # Generates shareable download links
├── public
│   └── uploads                # Directory for storing uploaded files
├── package.json               # NPM configuration file
└── README.md                  # Project documentation
```

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd file-share-app
   ```
3. Install the dependencies:
   ```
   npm install
   ```

## Usage

1. Start the server:
   ```
   npm start
   ```
2. Open your browser and go to `http://localhost:3000` to access the application.
3. Use the upload form to select and upload files.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License.