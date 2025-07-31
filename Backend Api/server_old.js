const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const SECRET = 'your_jwt_secret';
const mongoUrl = 'mongodb+srv://divyakhandait3104:CK4g9qs2bQIlubFD@cluster0.eg0taxn.mongodb.net/';
const dbName = 'resource_management';
let db;

MongoClient.connect(mongoUrl).then(client => {
  db = client.db(dbName);
  console.log('MongoDB connected');
});

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
    if (user.status !== 'active') return res.status(403).send('User not active');
    next();
  });
}

// Auth
app.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  await db.collection('users').insertOne({ name, email, password: hashed, role, status: 'active' });
  res.send('User registered');
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await db.collection('users').findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) return res.status(401).send('Invalid credentials');
  const token = jwt.sign({ id: user._id, role: user.role }, SECRET);
  res.json({ token });
});

// Admin
app.get('/admin/users', verifyToken, checkRole('admin'), async (req, res) => {
  const users = await db.collection('users').find().toArray();
  res.json(users);
});

app.patch('/admin/user/:id/status', verifyToken, checkRole('admin'), async (req, res) => {
  const { status } = req.body;
  await db.collection('users').updateOne({ _id: new ObjectId(req.params.id) }, { $set: { status } });
  res.send('Status updated');
});

// Upload
app.post('/resources/upload', verifyToken, checkActive, checkRole('teacher'), upload.single('file'), async (req, res) => {
  const { title, type, subject, year, semester } = req.body;
  const filePath = req.file.path;
  await db.collection('resources').insertOne({ title, type, subject, year, semester, filePath, uploadedBy: new ObjectId(req.user.id), uploadDate: new Date() });
  res.send('File uploaded');
});

// Browse & Download
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

// Start server
app.listen(5000, () => console.log('Server running on port 5000'));