const express = require('express');
const router = express.Router();
const Coordinator = require('../models/Coordinator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');

// GET all coordinators
router.get('/', async (req, res) => {
  try {
    const coordinators = await Coordinator.find();
    res.json(coordinators);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// POST create a new coordinator
router.post('/', async (req, res) => {
  const {
    coordinatorName,
    email,
    contactNumber,
    school,
    password,
    address,
    state,
    district,
    isAdmin,
  } = req.body;

  try {
    let coordinator = await Coordinator.findOne({ email });

    if (coordinator) {
      return res.status(400).json({ msg: 'Coordinator already exists' });
    }

    coordinator = new Coordinator({
      coordinatorName,
      email,
      contactNumber,
      school,
      password,
      address,
      state,
      district,
      isAdmin,
    });

    const salt = await bcrypt.genSalt(10);
    coordinator.password = await bcrypt.hash(password, salt);

    await coordinator.save();

    const payload = {
      coordinator: {
        id: coordinator.id,
        email: coordinator.email,
        isAdmin: coordinator.isAdmin,
      },
    };

    jwt.sign(
      payload,
      config.get('jwtSecret'),
      { expiresIn: 3600 },
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

// PUT update a coordinator by ID
router.put('/:id', [
  check('id', 'Invalid ID').isMongoId(),
  check('email', 'Please include a valid email').isEmail().optional(),
  check('password', 'Password should be at least 6 characters').isLength({ min: 6 }).optional()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    coordinatorName,
    email,
    contactNumber,
    school,
    password,
    address,
    state,
    district,
    isAdmin,
  } = req.body;
  const { id } = req.params;
  const coordinatorFields = {
    coordinatorName,
    email,
    contactNumber,
    school,
    address,
    state,
    district,
    isAdmin,
  };

  try {
    let coordinator = await Coordinator.findById(id);

    if (!coordinator) {
      return res.status(404).json({ msg: 'Coordinator not found' });
    }

    // Check if the new email already exists in the database
    if (email && email !== coordinator.email) {
      const coordinatorWithEmail = await Coordinator.findOne({ email });
      if (coordinatorWithEmail) {
        return res.status(400).json({ msg: 'Email already in use' });
      }
    }

    if (password) {
      const salt = await bcrypt.genSalt(10);
      coordinatorFields.password = await bcrypt.hash(password, salt);
    }

    coordinator = await Coordinator.findByIdAndUpdate(
      id,
      { $set: coordinatorFields },
      { new: true }
    );

    res.json(coordinator);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// DELETE a coordinator by ID
router.delete('/:id', async (req, res) => {
  try {
    const coordinator = await Coordinator.findByIdAndDelete(req.params.id);
    if (!coordinator) {
      return res.status(404).json({ msg: 'Coordinator not found' });
    }
    res.json({ msg: 'Coordinator deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
