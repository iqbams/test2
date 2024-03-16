const express = require('express');
const { google } = require('googleapis');
const fs = require('fs');

const app = express();
const port = 3000 || process.env.PORT;

// Load kredensial Service Account dari file JSON
const credentials = require('./credentials.json');
const spreadsheetId = '1zwKCPUA_79yunmhyoKbZ7KhUQvOJSlF5dahtOfJY5MA'; // Ganti dengan ID spreadsheet Google Sheets Anda

// Fungsi untuk mengautentikasi dengan kredensial Service Account
function authenticate() {
    const { client_email, private_key } = credentials;
    const auth = new google.auth.JWT({
        email: client_email,
        key: private_key,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    return auth;
}

// Fungsi untuk menambahkan data ke Google Sheets
async function addToSheet(auth, data) {
    const sheets = google.sheets({ version: 'v4', auth });
    const request = {
        spreadsheetId: spreadsheetId,
        range: 'Sheet1', // Nama sheet atau range yang ingin Anda gunakan
        valueInputOption: 'RAW',
        resource: {
            values: [data],
        },
    };
    try {
        const response = await sheets.spreadsheets.values.append(request);
        console.log('Data berhasil ditambahkan ke Google Sheets.');
    } catch (err) {
        console.error('Terjadi kesalahan:', err);
    }
}

// Middleware untuk membaca data JSON dari request
app.use(express.json());

// Endpoint untuk menerima data JSON dan menyimpan ke Google Sheets
app.post('/add-data-to-sheet', async (req, res) => {
    const auth = authenticate();
    const data = [req.body.data1, req.body.data2, req.body.data3]; // Sesuaikan dengan data yang ingin disimpan
    addToSheet(auth, data);
    res.send('Data berhasil disimpan ke Google Sheets.');
});

// Mulai server Express
app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});
