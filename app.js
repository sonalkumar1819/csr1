const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 
const url = 'mongodb://localhost:27017'; 
const dbName = 'contactme'; 
const client = new MongoClient(url);
let db;
let contactCollection; 
client.connect()
    .then(() => {
        console.log('Connected to MongoDB server');
        db = client.db(dbName);
        contactCollection = db.collection('contact');
    })
    .catch((err) => {
        console.error('Failed to connect to MongoDB server:', err);
    });

const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
        user: 'sonajha1819@gmail.com', 
        pass: 'clwt edyj ywha iapc' 
    }
});
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'contac.html')); 
});
app.post('/contact', async (req, res) => {
    try {
        const { FirstName, gmail, PhoneNumber, Message } = req.body;
        console.log(`Email: ${gmail}`); 
        if (!gmail) {
            return res.json({ success: false, error: "Email is required." });
        }
        const mailOptions = {
            from: 'sonajha1819@gmail.com',
            to: gmail, 
            subject: 'Contact Form Submission',
            text: `Hello ${FirstName},\n\nThank you for reaching out! Your message: "${Message}" has been received. We will get back to you shortly.\n\nBest regards,\nYour Name`,
        };
        await transporter.sendMail(mailOptions);
        await contactCollection.insertOne({ FirstName, gmail, PhoneNumber, Message });

        res.json({ success: true });
    } catch (error) {
        console.error('Error handling contact form:', error);
        res.json({ success: false, error: error.message });
    }
});
port=1989;
// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
