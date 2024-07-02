const express = require('express');
const router = express.Router();
const School = require('../models/School');

// POST create a new school
router.post('/', async (req, res) => {
  const {
    schoolName,
    principalName,
    address,
    contactNumber,
    email,
    coordinator,
    state,
    district,
  } = req.body;

  try {
    const newSchool = new School({
      schoolName,
      principalName,
      address,
      contactNumber,
      email,
      coordinator,
      state,
      district,
    });

    const school = await newSchool.save();
    res.status(201).json(school);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// GET all schools
router.get('/', async (req, res) => {
  try {
    const schools = await School.find();
    res.json(schools);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// PUT update a school by ID
router.put('/:id', async (req, res) => {
  const {
    schoolName,
    principalName,
    address,
    contactNumber,
    email,
    coordinator,
    state,
    district,
  } = req.body;
  
  const { id } = req.params;

  try {
    let school = await School.findById(id);

    if (!school) {
      return res.status(404).json({ msg: 'School not found' });
    }

    // Update school fields
    school.schoolName = schoolName;
    school.principalName = principalName;
    school.address = address;
    school.contactNumber = contactNumber;
    school.email = email;
    school.coordinator = coordinator;
    school.state = state;
    school.district = district;

    // Save updated school
    await school.save();

    res.json(school);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// DELETE a school by ID
router.delete('/:id', async (req, res) => {
  try {
    const school = await School.findByIdAndDelete(req.params.id);
    if (!school) {
      return res.status(404).json({ msg: 'School not found' });
    }
    res.json({ msg: 'School deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
