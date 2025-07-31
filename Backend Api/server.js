const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');
const Joi = require('joi');

const app = express();
app.use(express.json());
app.use(cors());

const SECRET = 'your_jwt_secret';
const mongoUrl = 'mongodb+srv://divyakhandait3104:CK4g9qs2bQIlubFD@cluster0.eg0taxn.mongodb.net/';
const dbName = 'resource_management';
let db;

MongoClient.connect(mongoUrl)
  .then(client => {
    db = client.db(dbName);
    console.log('MongoDB connected');
  })
  .catch(err => console.error('MongoDB connection failed:', err));

// 🟡 Teacher uploads storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { type, year, semester } = req.body;
    const dir = `uploads/${type}/${year}/${semester}`;
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// ✅ Admin GQP uploads
const gqpStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { courseYear, semester } = req.body;
    const dir = `uploads/gqp/${courseYear}/${semester}`;
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const gqpUpload = multer({ storage: gqpStorage });

// Middleware
function verifyToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(403).send('Token missing');
  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) return res.status(403).send('Invalid token');
    req.user = decoded;
    next();
  });
}

function checkRole(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) return res.status(403).send('Access denied');
    next();
  };
}

function checkActive(req, res, next) {
  db.collection('users').findOne({ _id: new ObjectId(req.user.id) }).then(user => {
    if (!user || user.status !== 'active') return res.status(403).send('User not active');
    next();
  });
}

// Joi Schemas
const registerSchema = Joi.object({
  name: Joi.string().min(2).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(5).required(),
  role: Joi.string().valid('admin', 'teacher', 'student').required()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

// Routes
app.post('/register', async (req, res) => {
  const { error } = registerSchema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { name, email, password, role } = req.body;
  const existingUser = await db.collection('users').findOne({ email });
  if (existingUser) return res.status(409).send('Email already registered');

  const hashed = await bcrypt.hash(password, 10);
  await db.collection('users').insertOne({ name, email, password: hashed, role, status: 'active' });
  res.send('User registered');
});

app.post('/login', async (req, res) => {
  const { error } = loginSchema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { email, password } = req.body;
  const user = await db.collection('users').findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) return res.status(401).send('Invalid credentials');

  const token = jwt.sign({ id: user._id, role: user.role }, SECRET);
  res.json({ token });
});

// Admin routes
app.get('/admin/users', verifyToken, checkRole('admin'), async (req, res) => {
  const users = await db.collection('users').find().toArray();
  res.json(users);
});

app.patch('/admin/user/:id/status', verifyToken, checkRole('admin'), async (req, res) => {
  const { status } = req.body;
  await db.collection('users').updateOne({ _id: new ObjectId(req.params.id) }, { $set: { status } });
  res.send('Status updated');
});

// Teacher uploads resources
app.post('/resources/upload', verifyToken, checkActive, checkRole('teacher'), upload.single('file'), async (req, res) => {
  const { title, type, subject, year, semester } = req.body;
  const filePath = req.file.path;
  await db.collection('resources').insertOne({
    title,
    type,
    subject,
    year,
    semester,
    filePath,
    uploadedBy: new ObjectId(req.user.id),
    uploadDate: new Date()
  });
  res.send('File uploaded');
});

// Browse & download
app.get('/resources', verifyToken, checkActive, async (req, res) => {
  const query = req.query;
  const resources = await db.collection('resources').find(query).toArray();
  res.json(resources);
});

app.get('/resources/:id/download', verifyToken, checkActive, async (req, res) => {
  const resource = await db.collection('resources').findOne({ _id: new ObjectId(req.params.id) });
  if (!resource) return res.status(404).send('Not found');
  res.download(path.resolve(resource.filePath));
});

// Admin uploads GQPs
app.post('/gqp/upload', verifyToken, checkRole('admin'), gqpUpload.single('file'), async (req, res) => {
  const { title, subject, courseYear, semester } = req.body;
  const filePath = req.file.path;

  await db.collection('generated_papers').insertOne({
    title,
    subject,
    courseYear,
    semester,
    filePath,
    uploadedAt: new Date(),
    uploadedBy: new ObjectId(req.user.id)
  });

  res.send('GQP uploaded successfully');
});

// Teacher views GQPs
app.get('/gqp', verifyToken, checkActive, checkRole('teacher'), async (req, res) => {
  const { courseYear, semester } = req.query;
  if (!courseYear || !semester) return res.status(400).send('Missing course year or semester');

  const gqps = await db.collection('generated_papers')
    .find({ courseYear, semester })
    .sort({ uploadedAt: -1 })
    .toArray();

  res.json(gqps);
});

// Teacher downloads specific GQP
app.get('/gqp/:id/download', verifyToken, checkActive, checkRole('teacher'), async (req, res) => {
  const gqp = await db.collection('generated_papers').findOne({ _id: new ObjectId(req.params.id) });
  if (!gqp) return res.status(404).send('GQP not found');
  res.download(path.resolve(gqp.filePath));
});

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Start server
app.listen(5000, () => console.log('Server running on port 5000'));
