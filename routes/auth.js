const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const Coordinator = require('../models/Coordinator');


router.post('/', async (req, res) => {
  const { email, password } = req.body;

  try {
   
    let coordinator = await Coordinator.findOne({ email });

    if (!coordinator) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

   
    const isMatch = await bcrypt.compare(password, coordinator.password);

    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

   
    const payload = {
      coordinator: {
        id: coordinator.id,
        email: coordinator.email,
        isAdmin: coordinator.isAdmin,
      },
    };

    jwt.sign(
      payload,
      config.jwtSecret,
      { expiresIn: '1h' }, 
      (err, token) => {
        if (err) throw err;
        res.json({ token, isAdmin: coordinator.isAdmin });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
