const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const db = require('./db');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files from public folder
app.use('/uploads', express.static('uploads')); // Serve uploaded images

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Multer Storage Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to filename
    }
});
const upload = multer({ storage: storage });

// API Endpoints

// GET all items (with optional filters)
app.get('/api/items', (req, res) => {
    let items = db.getAllItems();
    const { type, category, search } = req.query;

    if (type) {
        items = items.filter(item => item.type === type);
    }
    if (category) {
        items = items.filter(item => item.category === category);
    }
    if (search) {
        const searchLower = search.toLowerCase();
        items = items.filter(item =>
            item.title.toLowerCase().includes(searchLower) ||
            item.description.toLowerCase().includes(searchLower) ||
            item.location.toLowerCase().includes(searchLower)
        );
    }
    // Sort by newest first
    items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json(items);
});

// GET single item
app.get('/api/items/:id', (req, res) => {
    const item = db.getItemById(req.params.id);
    if (item) {
        res.json(item);
    } else {
        res.status(404).json({ message: 'Item not found' });
    }
});

// POST new item
app.post('/api/items', upload.single('image'), (req, res) => {
    const { title, description, category, type, location, date, contactName, contactPhone, contactEmail } = req.body;

    if (!title || !type || !location) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    const newItem = {
        title,
        description,
        category,
        type, // 'lost' or 'found'
        location,
        dateLostFound: date,
        contactName,
        contactPhone,
        contactEmail,
        imageUrl: req.file ? `/uploads/${req.file.filename}` : null
    };

    const createdItem = db.addItem(newItem);
    res.status(201).json(createdItem);
});

// Export the app for Vercel
module.exports = app;

// Start Server only if not running in Vercel (or if run directly)
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}
