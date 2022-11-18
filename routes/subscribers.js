const express = require("express");
const Router = express.Router();
const Subscriber = require("../models/subscriber");

// Get all subscribers

Router.get("/", async (req, res) => {
  try {
    const subscribers = await Subscriber.find();
    res.send(subscribers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get one
Router.get("/:id", getSubscriber, (req, res) => {
  res.json(res.subscriber)
});

// Create one
Router.post("/", async (req, res) => {
    const subscriber = await new Subscriber({
        name: req.body.name,
        subscribedToChannel: req.body.subscribedToChannel
    })

    try {
        const newSubscriber = await subscriber.save()
        // if success
        res.status(201).json(newSubscriber)
    }
    catch(err) {
        res.status(400).json({error: err.message})
    }
});

// Update one
Router.patch("/:id", getSubscriber, async (req, res) => {
if (req.body.name != null) {
  res.subscriber.name = req.body.name
}
if (req.body.subscribedToChannel != null) {
  res.subscriber.subscribedToChannel = req.body.subscribedToChannel
}
try {
  const updatedSubscriber = await res.subscriber.save()
  res.json(updatedSubscriber)
} catch (err) {
  res.status(400).json({message: err.message})
}
});

// delete one
Router.delete("/:id", getSubscriber , async (req, res) => {
  try {
    await res.subscriber.remove()
    res.json({message: 'Subscriber has been deleted.'})
  } catch (error) {
    res.status(500).json({message: err.message})
  }
});

async function getSubscriber(req, res, next) {
  let subscriber = undefined
  try {

    subscriber = await Subscriber.findById(req.params.id)
    if (subscriber == null) {
      return res.status(404).json({message: 'Cannot find subscriber.'})
    }
    
  } catch (err) {
    return res.status(500).json({message: err.message})
  }

  res.subscriber = subscriber
  next()
}

module.exports = Router;
