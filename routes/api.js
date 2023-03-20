// const express = require('express');
// const router = express.Router();

// router.post('/echo', (req, res) => {
//   const text = req.body.text;
//   console.log(text);
//   res.send(`You sent: ${text}`);
// });

// module.exports = router;


const express = require('express');
const router = express.Router();

router.post('/echo', (req, res) => {
  const { text } = req.body;
  res.json({ echo: text });
});

module.exports = router;
