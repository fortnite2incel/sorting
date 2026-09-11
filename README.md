# sorting algorithms as a coursework 

# This app was made as my college project, it contains only four basic sorting algorithm: bubble, selection, insertion and quick sort. 
A full-stack Sorting Visualizer web application split into a frontend client (**"der Kundenteil"**) and a backend server (**"der Serverteil"**). The application enables users to visualize sorting algorithms interactively on the web interface while recording and storing sorting session histories in an SQLite database backend.

---

## 🛠 Technology Stack

### Frontend Client (`der Kundenteil`)
* **Structure:** HTML5 (`index.html`)
* **Styling:** CSS3 (`style.css`)
* **Logic & Animations:** JavaScript (`script.js`)

### Backend Server (`der Serverteil`)
* **Programming Language:** Python 3.x (`main.py`)
* **Database:** SQLite3 (`sorting_history.db`)

---

## ✨ Key Features

* **Interactive Frontend Visualization (`der Kundenteil/`):** Real-time web UI for rendering array elements and visualizing sorting steps interactively.
* **Server-Side History Tracking (`der Serverteil/`):** Python backend integration that saves sorting operation logs and historical sessions.
* **Persistent Storage:** SQLite database (`sorting_history.db`) recording previous sorting executions.

---

## 📁 Project Structure

```text
sorting-main/
└── /root/
    ├── der Kundenteil/             # Frontend Web Client
    │   ├── index.html              # Main HTML markup and UI structure
    │   ├── script.js               # Frontend visualizer algorithms & state management
    │   └── style.css               # Visual styles and animations
    └── derServerteil/              # Backend Server & Database
        ├── main.py                 # Core server entry point and API routes
        └── sorting_history.db      # SQLite database storing sorting logs
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have a web browser and **Python 3.10+** installed.

### 1. Launching the Backend Server (`der Serverteil`)

Navigate to the server directory and run the Python backend:

```bash
cd "sorting-main/ /root/derServerteil"
python main.py
```

### 2. Opening the Frontend Client (`der Kundenteil`)

Open `index.html` located in `sorting-main/ /root/der Kundenteil/` directly in your browser, or serve it using a local development server:

```bash
cd "sorting-main/ /root/der Kundenteil"

# Using Python's simple HTTP server
python -m http.server 8000
```

Access the client UI at `http://localhost:8000`.
