const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const cors = require('cors'); // Import the cors middleware
const app = express();
const port = 3000;

mongoose.connect('mongodb+srv://<username>:<password>@cluster0.eiumezr.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const Pdf = mongoose.model('Pdf', {
    name: String,
    data: Buffer,
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

app.use(express.json());

// Use the cors middleware with specific origin
app.use(
    cors({
        origin: 'http://127.0.0.1:5173', // Replace with the correct frontend URL
    })
);

app.post('/upload', upload.single('pdf'), async (req, res) => {
    try {
        const { originalname, buffer } = req.file;
        const pdf = new Pdf({ name: originalname, data: buffer });
        await pdf.save();
        res.status(201).send('PDF uploaded successfully');
    } catch (error) {
        res.status(500).send('Error uploading PDF');
    }
});

app.get('/pdfs', async (req, res) => {
    try {
      const pdfs = await Pdf.find({}, 'name');
      res.json(pdfs);
    } catch (error) {
      res.status(500).send('Error fetching PDFs');
    }
  });
  

app.get('/pdfs/:id', async (req, res) => {
    try {
        const pdf = await Pdf.findById(req.params.id);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${pdf.name}"`);
        res.send(pdf.data);
    } catch (error) {
        res.status(500).send('Error fetching PDF');
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
