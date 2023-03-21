// const express = require('express');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const { createProxyMiddleware } = require('http-proxy-middleware');
// const apiRoutes = require('./routes/Api');
// const app = express();

// // const port = 5001;

// // app.get('/', (req, res) => {
// //   res.send('Hello World!');
// // });

// // app.listen(port, () => {
// //   console.log(`Server listening on port ${port}`);
// // });

// // Proxy requests to the server
// app.use('/api', createProxyMiddleware({ target: 'http://localhost:5001', changeOrigin: true }));

// // Serve static files from the client build folder
// app.use(express.static('client/build'));

// // Use middleware for parsing JSON and handling CORS
// app.use(cors());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// // Use API routes
// app.use('/api', apiRoutes);

// const port = process.env.PORT || 5001;
// app.listen(port, () => {
//   console.log(`Client server running on port ${port}`);
// });


// const express = require('express');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const app = express();

// const port = process.env.PORT || 5001;

// app.use(cors());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// app.post('/api/echo', (req, res) => {
//   const text = req.body.text;
//   console.log(text);
//   res.send(`You sent: ${text}`);
// });

// app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });


// const express = require('express');
// const bodyParser = require('body-parser');
// const cors = require('cors');

// const app = express();
// const port = process.env.PORT || 5001;

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(cors());

// const apiRoutes = require('./Api');

// app.use('/api', apiRoutes);

// app.listen(port, () => {
//   console.log(`Server listening on port ${port}`);
// });


// WORKS WITH INDIVIDUAL SEPARATE CLIENTS

// const express = require('express');
// const bodyParser = require('body-parser');
// const cors = require('cors');

// const app = express();
// const port = process.env.PORT || 5001;

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(cors());

// app.post('/api/echo', (req, res) => {
//   const { text } = req.body;
//   res.json({ echo: text });
// });

// app.listen(port, () => {
//   console.log(`Server listening on port ${port}`);
// });

// const express = require('express');
// const http = require('http');
// const WebSocket = require('ws');
// const bodyParser = require('body-parser');
// const cors = require('cors');

// const app = express();
// app.use(cors());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// const server = http.createServer(app);
// const wss = new WebSocket.Server({ server });

// const clients = new Set();

// wss.on('connection', (ws, req) => {
//   clients.add(ws);
//   console.log(`New client connected. Total clients: ${clients.size}`);

//   ws.on('close', () => {
//     clients.delete(ws);
//     console.log(`Client disconnected. Total clients: ${clients.size}`);
//   });
// });

// app.get('/', (req, res) => {
//   res.send('Welcome to my server!');
// });

// app.post('/api/messages', (req, res) => {
//   console.log(req.body);
//   const { message, name } = req.body;
// console.log(message, name);
//   let imageUrl = null;
//   if (req.file) {
//     imageUrl = `${req.protocol}://${req.get('host')}/${req.file.path}`;
//   }

//   const messageData = {
//     message,
//     name,
//     imageUrl,
//     timestamp: Date.now()
//   };

//   clients.forEach((client) => {
//     client.send(JSON.stringify(messageData));
//   });

//   res.status(200).send();
// });

// server.listen(5001, () => {
//   console.log(`Server started on port ${server.address().port}`);
// });


const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const clients = new Set();

wss.on('connection', (ws, req) => {
  clients.add(ws);
  console.log(`New client connected. Total clients: ${clients.size}`);

  ws.on('close', () => {
    clients.delete(ws);
    console.log(`Client disconnected. Total clients: ${clients.size}`);
  });
});

app.get('/', (req, res) => {
  res.send('Welcome to my server!');
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${file.fieldname}-${uniqueSuffix}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedFileTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and PDF files are allowed.'));
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5, // 5MB
  },
  fileFilter: fileFilter,
});


app.post('/api/messages', upload.single('file'), (req, res) => {
  console.log(req.body);
  const { message, name } = req.body;
  console.log(message, name);
  let imageUrl = null;
  // handle file uploads here if needed
  if (req.file && req.file.path) {
    imageUrl = `${req.protocol}://${req.get('host')}/${req.file.path}`;
  }
  
  // app.post('/upload', upload.single('recfile'), (req, res) => {
  //   const file = req.file;
  //   console.log(file);
  //   res.send('File uploaded successfully');
  // });

  const messageData = {
    message,
    name,
    imageUrl,
    timestamp: Date.now()
  };

  clients.forEach((client) => {
    client.send(JSON.stringify(messageData));
  });

  res.status(200).send();
});

const port = process.env.PORT || 5001
server.listen(port, () => {
  console.log(`Server started on port ${server.address().port}`);
});
