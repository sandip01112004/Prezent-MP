# PreZent – Smart Bluetooth Presence Detection App

**Automated, reliable attendance logging using ESP32, Bluetooth Low Energy (BLE), and the MERN Stack.**

---

## 🚀 Project Overview & Demo

**Live Portfolio:** https://sandip01112004.github.io/Prezent-MP/

PreZent is a smart system that replaces manual roll calls with an automated, proximity-based solution. It leverages an ESP32 to detect nearby mobile devices and securely logs their presence for attendance.

### Problem Statement
Traditional attendance systems are inefficient and susceptible to proxy attendance. We addressed this by developing a robust, real-time, proximity-based alternative.

### Key Features
* **Automated Presence:** Eliminates manual roll call, saving significant time.
* **Secure Registration:** Students register a single, unique MAC (hashed using **bcrypt** for security).
* **Role-Based Access:** Separate login portals for Students (PRN/MAC) and Teachers (Email/Password).
* **Full-Stack Solution:** Integrates custom hardware (ESP32), API layer (Node/Express), and MongoDB database.

---

## 💻 System Architecture

| Component | Technology | Role |
| :--- | :--- | :--- |
| **Hardware** | ESP32 Microcontroller | Scans for all nearby Bluetooth Low Energy (BLE) MAC addresses and sends raw data to the backend via a dedicated `/api/scan` endpoint. |
| **Backend API** | Node.js (Express) | Handles user authentication, registration, MAC hashing, and lecture-start signaling. It verifies scanned MACs against the student database. |
| **Database** | MongoDB | Stores user data, including unique PRNs and hashed MAC addresses. |
| **Frontend** | HTML, CSS, JavaScript | Provides the Student Attendance Dashboard and the Teacher/Student login portal. |

### Workflow (The Smart Loop)
1.  **Lecture Start:** Faculty initiates a lecture on the web portal.
2.  **Scanning:** The **ESP32** begins scanning for all student device MAC addresses in proximity.
3.  **Data Transmission:** Scanned MACs and signal strength are sent to the Node.js Backend.
4.  **Verification:** The Backend authenticates the MACs against stored student records (using bcrypt comparison).
5.  **Attendance Log:** Presence is marked in the database for recognized students.

---

## 🛠️ Local Setup and Run Instructions

### Prerequisites
* Node.js (LTS recommended)
* MongoDB instance (local or Atlas)

### 1. Backend Setup (`backend/`)

1.  Navigate to the `backend` directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  **Create `.env` file:** Create a file named `.env` in the `backend/` directory with your MongoDB connection string:
    ```env
    # backend/.env
    MONGO_URI="mongodb+srv://<username>:<password>@<cluster-name>/<database-name>?retryWrites=true&w=majority"
    PORT=3000
    ```
4.  Run the backend server:
    ```bash
    npm start
    # Server running at http://localhost:3000
    ```

### 2. Frontend Running (`frontend/`)

The frontend must be served from a web server to make API calls to `localhost:3000`.

1.  **Install a static server** (e.g., `serve`):
    ```bash
    npm install -g serve
    ```
2.  Navigate back to the project root directory:
    ```bash
    cd ..
    ```
3.  Run the static server on the `frontend` folder:
    ```bash
    serve frontend
    ```
4.  **Access the application:** Open your browser to the address provided (e.g., `http://localhost:5000`).
