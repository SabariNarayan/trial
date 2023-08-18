const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB Atlas
mongoose.connect('mongodb+srv://officialsabarinarayan:9447103050@cluster0.buyzcu4.mongodb.net/trial', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error(err));

// Define a User schema
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: 'user' }
});

const User = mongoose.model('User', userSchema);

// Register a new user
app.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred' });
  }
});

// User Login
app.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        res.status(401).json({ message: 'Login failed: User not found' });
        return;
      }
      
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (isPasswordValid) {
        // Generate a JWT token
        const token = jwt.sign({ userId: user._id, role: user.role}, '12345', { expiresIn: '1h' });
        res.status(200).json({ message: 'Login successful', token }); // Send token in the response
      } else {
        res.status(401).json({ message: 'Login failed: Incorrect password' });
      }
    } catch (error) {
      res.status(500).json({ error: 'An error occurred' });
    }
  });

  //Student model
const studentSchema = new mongoose.Schema({
    name: String,
    age: Number,
    score: Number
  });
  
  const Student = mongoose.model('Student', studentSchema);

  // Create a new student
app.post('/students', async (req, res) => {
    try {
      const { name, age, score } = req.body;
      const newStudent = new Student({ name, age, score });
      await newStudent.save();
      res.status(201).json({ message: 'Student added successfully' });
    } catch (error) {
      res.status(500).json({ error: 'An error occurred' });
    }
  });
  
  // Get all students
  app.get('/students', async (req, res) => {
    try {
      const students = await Student.find();
      res.status(200).json(students);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred' });
    }
  });



// Update an existing student by ID
app.put('/students/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { name, age, score } = req.body;
  
      const updatedStudent = await Student.findByIdAndUpdate(
        id,
        { name, age, score },
        { new: true }
      );
  
      if (!updatedStudent) {
        res.status(404).json({ message: 'Student not found' });
        return;
      }
  
      res.status(200).json({ message: 'Student updated successfully', student: updatedStudent });
    } catch (error) {
      res.status(500).json({ error: 'An error occurred' });
    }
  });
  
  // Get a student by ID
  app.get('/students/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const student = await Student.findById(id);
  
      if (!student) {
        res.status(404).json({ message: 'Student not found' });
        return;
      }
  
      res.status(200).json(student);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred' });
    }
  });
  
  app.delete('/students/:id', async (req, res) => {
    try {
      const { id } = req.params;
  
      // Delete the student by ID
      const deletedStudent = await Student.findByIdAndDelete(id);
  
      if (!deletedStudent) {
        res.status(404).json({ message: 'Student not found' });
        return;
      }
  
      res.status(200).json({ message: 'Student deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'An error occurred' });
    }
  });
  

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
