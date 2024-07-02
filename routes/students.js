const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const mongoose = require('mongoose');

// Helper function to validate ObjectId
const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

// POST create a new student
router.post('/', async (req, res) => {
  const {
    studentName,
    dateOfBirth,
    gender,
    grade,
    school,
    parentName,
    parentContactNumber,
    address,
    state,
    district,
  } = req.body;

  if (!isValidObjectId(school)) {
    return res.status(400).json({ msg: 'Invalid school ID' });
  }

  try {
    const newStudent = new Student({
      studentName,
      dateOfBirth,
      gender,
      grade,
      school: new mongoose.Types.ObjectId(school), // Convert school to ObjectId using new
      parentName,
      parentContactNumber,
      address,
      state,
      district,
    });

    const student = await newStudent.save();
    res.status(201).json(student);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// GET all students
router.get('/', async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// PUT update a student by ID
router.put('/:id', async (req, res) => {
  const {
    studentName,
    dateOfBirth,
    gender,
    grade,
    school,
    parentName,
    parentContactNumber,
    address,
    state,
    district,
  } = req.body;

  const { id } = req.params;

  if (!isValidObjectId(school)) {
    return res.status(400).json({ msg: 'Invalid school ID' });
  }

  try {
    let student = await Student.findById(id);

    if (!student) {
      return res.status(404).json({ msg: 'Student not found' });
    }

    // Update student fields
    student.studentName = studentName;
    student.dateOfBirth = dateOfBirth;
    student.gender = gender;
    student.grade = grade;
    student.school = new mongoose.Types.ObjectId(school); // Convert school to ObjectId using new
    student.parentName = parentName;
    student.parentContactNumber = parentContactNumber;
    student.address = address;
    student.state = state;
    student.district = district;

    // Save updated student
    await student.save();

    res.json(student);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// DELETE a student by ID
router.delete('/:id', async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) {
      return res.status(404).json({ msg: 'Student not found' });
    }
    res.json({ msg: 'Student deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
