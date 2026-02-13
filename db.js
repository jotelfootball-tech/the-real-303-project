const fs = require('fs');
const path = require('path');

const os = require('os');

// Use /tmp for Vercel, otherwise use local data folder
const isVercel = process.env.VERCEL === '1';
const DB_FILE = isVercel
    ? path.join(os.tmpdir(), 'db.json')
    : path.join(__dirname, 'data', 'db.json');

// Ensure DB file exists
if (!fs.existsSync(DB_FILE)) {
    // If we can't write to the directory (e.g. read-only fs), this might fail if not handled
    try {
        fs.writeFileSync(DB_FILE, JSON.stringify([], null, 2));
    } catch (error) {
        console.error("Could not create DB file:", error);
    }
}

const readData = () => {
    try {
        const data = fs.readFileSync(DB_FILE, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error("Error reading DB:", err);
        return [];
    }
};

const writeData = (data) => {
    try {
        fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
        return true;
    } catch (err) {
        console.error("Error writing to DB:", err);
        return false;
    }
};

module.exports = {
    getAllItems: () => readData(),

    getItemById: (id) => {
        const items = readData();
        return items.find(item => item.id === id);
    },

    addItem: (item) => {
        const items = readData();
        const newItem = {
            id: Date.now().toString(), // Simple ID generation
            createdAt: new Date().toISOString(),
            ...item
        };
        items.push(newItem);
        writeData(items);
        return newItem;
    },

    deleteItem: (id) => {
        let items = readData();
        const initialLength = items.length;
        items = items.filter(item => item.id !== id);
        if (items.length !== initialLength) {
            writeData(items);
            return true;
        }
        return false;
    }
};
