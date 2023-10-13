const express = require('express');
const router = express.Router();
const { User } = require('../../models/User');
const { Thought } = require('../../models/Thought'); // Import the Thought and User models

// GET all thoughts
router.get('/', async (req, res) => {
  try {
    const thoughts = await Thought.find();
    res.json(thoughts);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// GET a single thought by its _id
router.get('/:thoughtId', async (req, res) => {
  try {
    const thought = await Thought.findById(req.params.thoughtId);
    if (!thought) {
      res.status(404).json({ message: 'Thought not found' });
      return;
    }
    res.json(thought);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// POST to create a new thought
router.post('/', async (req, res) => {
  try {
    const newThought = await Thought.create(req.body);

    // Push the created thought's _id to the associated user's thoughts array field
    const user = await User.findByIdAndUpdate(
      req.body.userId,
      { $push: { thoughts: newThought._id } },
      { new: true }
    );

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json(newThought);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// PUT to update a thought by its _id
router.put('/:thoughtId', async (req, res) => {
  try {
    const updatedThought = await Thought.findByIdAndUpdate(req.params.thoughtId, req.body, { new: true });
    if (!updatedThought) {
      res.status(404).json({ message: 'Thought not found' });
      return;
    }
    res.json(updatedThought);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// DELETE to remove a thought by its _id
router.delete('/:thoughtId', async (req, res) => {
  try {
    const deletedThought = await Thought.findByIdAndDelete(req.params.thoughtId);

    if (!deletedThought) {
      res.status(404).json({ message: 'Thought not found' });
      return;
    }
    res.json(deletedThought);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// POST to create a reaction stored in a single thought's reactions array field
router.post('/:thoughtId/reactions', async (req, res) => {
  try {
    const thought = await Thought.findByIdAndUpdate(
      req.params.thoughtId,
      { $push: { reactions: req.body } },
      { new: true }
    );

    if (!thought) {
      res.status(404).json({ message: 'Thought not found' });
      return;
    }

    res.json(thought);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// DELETE to pull and remove a reaction by the reaction's reactionId value
router.delete('/:thoughtId/reactions/:reactionId', async (req, res) => {
  try {
    const thought = await Thought.findByIdAndUpdate(
      req.params.thoughtId,
      { $pull: { reactions: { reactionId: req.params.reactionId } } },
    );

    if (!thought) {
      res.status(404).json({ message: 'Thought not found' });
      return;
    }

    res.json(thought);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

module.exports = router;
