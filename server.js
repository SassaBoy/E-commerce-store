
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const multer = require('multer');
const Men = require('./models/Men');
const dotenv = require('dotenv');
require('dotenv').config();
 


mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;

db.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

db.once('open', () => {
  console.log('Database Connected');
});

const app = express();
app.use(bodyParser.json());
app.use(morgan('dev'));
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.use(express.static('uploads')); // Replace 'uploads' with the directory containing your images


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = file.originalname.split('.').pop(); // Get the file extension
    cb(null, uniqueSuffix + '.' + extension);
  }
});

const upload = multer({ storage: storage });

app.post('/admin1/upload', upload.single('image'), async (req, res) => {
    if (!req.file || !req.body.title || !req.body.category || !req.body.price) {
      return res.status(400).send('Incomplete data provided.');
    }
  
    const { title, category, price } = req.body;
    const image = req.file.filename;
  
    try {
      const newItem = new Men({
        title,
        category,
        price: parseFloat(price), // Convert price to a number if needed
        image,
      });
  
      await newItem.save();
      res.redirect('/'); // Redirect to admin page after successful insert
    } catch (error) {
      console.error('Error:', error);
      res.status(500).send(error);
    }
  });

  // Create a GET route for the root path to display items from MongoDB
app.get('/', async (req, res) => {
    try {
      const items = await Men.find(); // Retrieve all items from the Men collection
  
      // Render the 'index.ejs' template and pass the items as a variable
      res.render('index', { items });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).send(error);
    }
  });

  app.get('/admin1', (req, res)=>{
    res.render('admin1');

  });

   app.get('/checkout', (req, res)=>{
    res.render('checkout');

  });
  
  app.get('/fashion', async (req, res) => {
    try {
      const items = await Men.find(); // Retrieve all items from the Men collection
  
      // Render the 'index.ejs' template and pass the items as a variable
      res.render('fashion', { items });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).send(error);
    }
  });

  app.get('/jewellery', async (req, res) => {
    try {
      const items = await Men.find(); // Retrieve all items from the Men collection
  
      // Render the 'index.ejs' template and pass the items as a variable
      res.render('jewellery', { items });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).send(error);
    }
  });

  app.get('/electronic', async (req, res) => {
    try {
      const items = await Men.find(); // Retrieve all items from the Men collection
  
      // Render the 'index.ejs' template and pass the items as a variable
      res.render('electronic', { items });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).send(error);
    }
  });

  
app.get("/search", async (req, res) => {
    const query = req.query.query;
    try {
        // Replace this with your actual database query to search for items
        const results = await Men.find({ title: { $regex: query, $options: "i" } });
        res.json(results);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

const PORT = process.env.PORT || 3005;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});