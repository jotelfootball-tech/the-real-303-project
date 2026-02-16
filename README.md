# NaijaFinder - Lost & Found Notice Board 🇳🇬

**NaijaFinder** is a digital community platform designed to bridge the gap between lost items and their owners in Nigeria. It serves as a modern, accessible notice board where users can report lost belongings or post items they have found, facilitating quick recovery through a centralized and searchable database.

> **Connecting People & Items across Nigeria.**

---

## 🌟 Key Features

### 🔍 Real-Time Search & Filtering
*   **Instant Search**: Type keywords like "iPhone", "Red Wallet", or "Lekki" and see results update instantly without reloading the page.
*   **Smart Categorization**: Filter items by specific categories such as **Electronics**, **Documents** (Passports/IDs), **Pets**, **Clothing**, and **Others**.
*   **Location-Based**: Quickly identify items lost or found in specific states (e.g., Lagos, Abuja, Rivers).

### 📸 Image Uploads & Previews
*   **Visual Identification**: Upload clear images of items to increase the chances of recognition.
*   **Instant Preview**: See a thumbnail of your image immediately after selecting it, ensuring you've picked the right file.
*   **Robust Handling**: The backend automatically validates image types (JPG, PNG, WEBP) to ensure data integrity.

### 📱 Responsive & Modern UI
*   **Mobile-First Design**: Optimized for smartphones, ensuring users can post or search for items on the go.
*   **Clean Interface**: A distraction-free layout that focuses on the content—helping you find what matters fast.

### 🔒 Privacy & Contact
*   **Contact Details**: Securely view contact names, phone numbers, and emails of the poster to arrange recovery.

---

## 🛠️ Technology Stack

NaijaFinder is built with a focused, efficient stack designed for speed and simplicity:

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | **HTML5, CSS3** | Semantic markup and custom styling for a polished look. |
| **Logic** | **Vanilla JavaScript (ES6+)** | Lightweight client-side logic for real-time filtering and API interaction. |
| **Backend** | **Node.js & Express** | Fast, scalable server handling API requests and static asset delivery. |
| **Database** | **JSON (LowDB style)** | A lightweight, file-based data storage system (`/data/db.json`) for zero-configuration persistence. |
| **File Handling** | **Multer** | Middleware for handling `multipart/form-data` for secure image uploads. |
| **Build Tool** | **Vite** | Next-generation frontend tooling for lightning-fast development servers. |

---

## 📂 Project Structure

Here is a quick overview of the file organization:

```
the-real-303-project/
├── api/                # Helper API testing scripts
├── data/               # Database files
│   └── db.json         # The heart of the app - stores all item records
├── public/             # Static assets (favicons, etc.)
├── src/                # Frontend source code
│   ├── css/            # Stylesheets
│   └── js/             # Application Logic (app.js)
├── uploads/            # User-uploaded images directory
├── *.html              # Main pages (index, lost, found, post, details)
├── server.js           # Main Express server entry point
├── package.json        # Project dependencies and scripts
└── README.md           # This documentation
```

---

## 🚀 Getting Started

To get a local copy up and running follow these simple steps.

### Prerequisites
*   Node.js (v14+)
*   npm

### Installation

1.  **Clone the repo**
    ```sh
    git clone https://github.com/yourusername/naijafinder.git
    ```
2.  **Install NPM packages**
    ```sh
    npm install
    ```
3.  **Start the Server**
    ```sh
    npm run dev
    ```
    This command runs both the backend and frontend concurrently.

4.  **Open in Browser**
    Navigate to `http://localhost:5173` to view the app.

---

## 🤝 Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

## 📝 License

Distributed under the ISC License. See `package.json` for more information.

---

