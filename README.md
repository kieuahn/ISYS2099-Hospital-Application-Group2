# Hospital Management System - Group 2

A hospital management system designed to manage the activities and interactions between admin, doctors, patients, and managers efficiently.

---

## Project Structure

<pre>
<span style="color: dodgerblue;"><b>./</b></span>
├── .vscode/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── database/
│   │   ├── business_rule.sql
│   │   └── table.sql
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   ├── utils/
│   ├── .env
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── styles/
│   │   ├── utils/
│   │   ├── App.js
│   │   ├── index.js
│   └── package.json
├── .gitignore
├── README.md
</pre>

### Key Directories and Files

- `backend/`: Contains the backend API logic, including configuration, controllers, models, and routes.
- `frontend/`: React-based frontend, styled using Material UI and TailwindCSS.
- `database/`: SQL scripts to initialize MySQL database schema and rules.
- `server.js`: The main entry point for the backend server.
- `App.js`: The main entry point for the React frontend.

---

## Technology Stack

- **Database**: MySQL, MongoDB
- **Back-end API**: NodeJS, Express, Mongoose
- **Front-end**: React, Material UI, TailwindCSS

---

## Installation

### Prerequisites

- Node.js
- MySQL Community Server
- MongoDB Community Server

### Steps

1. **MySQL Setup**:
   - Navigate to the `/backend/database` folder.
   - Execute the SQL scripts (`business_rule.sql` and `table.sql`) using MySQL Workbench to initialize the database schema and rules.

2. **Backend API**:
   - Navigate to the `backend/` folder.
   - Run the following commands to install dependencies and start the backend server:
     ```bash
     npm install
     node server.js
     ```

3. **Frontend**:
   - Navigate to the `frontend/` folder.
   - Run the following commands to install dependencies and start the frontend:
     ```bash
     npm install
     npm start
     ```

---

## Usage

1. Ensure your local instances of MySQL and MongoDB are running.
2. **Start API Server**:
   - The backend will run at `http://localhost:5000/`.
3. **Start Frontend**:
   - The frontend will run at `http://localhost:3000/`.

---

## Video Demonstration

Available at: [Link to Video]

---

## Contribution

| SID      | Name                     | Score |
|:---------|:-------------------------|:----- |
| s3818552 | Nguyen Ha Kieu Anh       | 5.75  |
| s3927427 | Phan Le Quynh Anh        | 5.75  |
| s3978175 | Nguyen Pham Tan Hau      | 2     |
| s3938231 | Ong Gia Man              | 5.75  |
| s3878520 | Vu Nguyet Minh           | 5.75  | 
---

## Developer Tools

![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white)
![VS Code](https://img.shields.io/badge/VS_Code-0078D4?style=for-the-badge&logo=visual%20studio%20code&logoColor=white)
![Postman](https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white)
![MySQL Workbench](https://img.shields.io/badge/MySQL_Workbench-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![MongoDB Compass](https://img.shields.io/badge/MongoDB_Compass-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
