# ISYS2099-Hospital-Application-Group2


1. **Clone the Repository:**

   ```bash
   git clone https://github.com/yourusername/hospital_management.git
   ```
   ```bash
   cd hospital_management/backend
   npm install
   ```


2. **Change the Enviroment Variables**
    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=yourpassword
    DB_NAME=hospital_management
    JWT_SECRET=your_jwt_secret_key

3. **Seeding the Databas**
    To insert mock data into your database, run:

   ```bash
   cd hospital_management/backend/ultis
   node mockData.js
   ```

4. **Run backend**
   ```bash
   cd hospital_management/backend/
   node server.js
   ```

5. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

6. **Run frontend**
   ```bash
   cd hospital_management/frontend/
   npm start
   ```