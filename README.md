# Document Capture Prototype

This prototype extracts key information (Name, Document Number, Expiration Date) from documents like passports or driver’s licenses using Node.js for the backend and React.js for the frontend.

## Features
- **OCR Extraction**: Uses OCR to read document data.
- **Data Validation**: Ensures accuracy of extracted data.

## Tech Stack
- **Backend**: Node.js, Express.js, OCR (e.g., Tesseract.js)
- **Frontend**: React.js

## Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-username/document-capture-prototype.git
   cd document-capture-prototype
   ```

2. **Install Backend and Frontend Dependencies**
   ```bash
   # Backend setup
   cd backend
   npm install
   cp .env.example .env  # Configure your environment variables
   npm start

   # Frontend setup
   cd ../frontend
   npm install
   npm start
   ```

3. **Run the App**
   - Open [http://localhost:3000](http://localhost:3000) in your browser to use the app.

## Usage
Upload a document image (passport or driver’s license) via the UI. Extracted details will display on the page.

---

