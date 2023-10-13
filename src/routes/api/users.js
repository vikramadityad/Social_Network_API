const express = require('express');
const router = express.Router();
const { User } = require('../../models/User');
const { Thought } = require('../../models/Thought'); // Import the User and Thought models

// GET all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find().populate('thoughts friends');
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// GET a single user by its _id and populate thought and friend data
router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate('thoughts friends');
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// POST a new user
router.post('/', async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    res.json(newUser);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// PUT to update a user by its _id
router.put('/:userId', async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.userId, req.body, { new: true });
    if (!updatedUser) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// DELETE to remove a user by its _id
router.delete('/:userId', async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.userId);

    // Bonus: Remove user's associated thoughts when deleted
    if (deletedUser) {
      await Thought.deleteMany({ username: deletedUser.username });
    }

    if (!deletedUser) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.json(deletedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// POST to add a new friend to a user's friend list
router.post('/:userId/friends/:friendId', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { $addToSet: { friends: req.params.friendId } },
      { new: true }
    );

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// DELETE to remove a friend from a user's friend list
router.delete('/:userId/friends/:friendId', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { $pull: { friends: req.params.friendId } },
      { new: true }
    );

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

module.exports = router;
