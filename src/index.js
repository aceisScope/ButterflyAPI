'use strict';

const express = require('express');
const lowdb = require('lowdb');
const FileAsync = require('lowdb/adapters/FileAsync');
const shortid = require('shortid');

const constants = require('./constants');
const { validateButterfly, validateUser, validateRatings, validateUserId } = require('./validators');

async function createApp(dbPath) {
  const app = express();
  app.use(express.json());

  const db = await lowdb(new FileAsync(dbPath));
  await db.read();

  app.get('/', (req, res) => {
    res.json({ message: 'Server is running!' });
  });

  /* ----- BUTTERFLIES ----- */

  /**
   * Get an existing butterfly
   * GET
   */
  app.get('/butterflies/:id', async (req, res) => {
    const butterfly = await db.get('butterflies')
      .find({ id: req.params.id })
      .value();

    if (!butterfly) {
      return res.status(404).json({ error: 'Not found' });
    }

    res.json(butterfly);
  });

  /**
   * Create a new butterfly
   * POST
   */
  app.post('/butterflies', async (req, res) => {
    try {
      validateButterfly(req.body);
    } catch (error) {
      return res.status(400).json({ error: 'Invalid request body' });
    }

    const newButterfly = {
      id: shortid.generate(),
      ...req.body
    };

    await db.get('butterflies')
      .push(newButterfly)
      .write();

    res.json(newButterfly);
  });


  /* ----- USERS ----- */

  /**
   * Get an existing user
   * GET
   */
  app.get('/users/:id', async (req, res) => {
    const user = await db.get('users')
      .find({ id: req.params.id })
      .value();

    if (!user) {
      return res.status(404).json({ error: 'Not found' });
    }

    res.json(user);
  });

  /**
   * Create a new user
   * POST
   */
  app.post('/users', async (req, res) => {
    try {
      validateUser(req.body);
    } catch (error) {
      return res.status(400).json({ error: 'Invalid request body' });
    }

    const newUser = {
      id: shortid.generate(),
      ...req.body
    };

    await db.get('users')
      .push(newUser)
      .write();

    res.json(newUser);
  });

  /* ----- RATINGS ----- */

  /**
   * Create a new rating
   * POST
   */
  app.post('/ratings', async (req, res) => {
    try {
      validateRatings(req.body);
    } catch (error) {
      return res.status(400).json({ error: 'Invalid request body' });
    }

    // check if user exists
    const user = await db.get('users')
      .find({ id: req.body.userId })
      .value();

    if (!user) {
      return res.status(404).json({ error: 'User Not found' });
    }

    // check if butterfly exists
    const butterfly = await db.get('butterflies')
      .find({ id: req.body.butterflyId })
      .value();

    if (!butterfly) {
      return res.status(404).json({ error: 'Butterfly Not found' });
    }

    // find, insert or update ratings
    const currentRating = await db.get('ratings')
      .find({ userId: req.body.userId, butterflyId: req.body.butterflyId })
      .value();

    if (!currentRating) {
      const newRating = {
        id: shortid.generate(),
        ...req.body
      };

      await db.get('ratings')
        .push(newRating)
        .write();

      res.json(newRating);
    } else {
      currentRating.rating = req.body.rating;

      console.log(currentRating);

      await db.get('ratings')
        .find({ id: currentRating.id })
        .assign({ rating: req.body.rating })
        .write();

      res.json(currentRating);
    }
  });


  /**
   * Retrieve of a list of a user's rated butterflies, sorted by rating
   * GET
   */
  app.get('/ratings', async (req, res) => {
    try {
      validateUserId(req.query);
    } catch (error) {
      return res.status(400).json({ error: 'Invalid query parameter' });
    }

    const user = await db.get('users')
      .find({ id: req.query.userId })
      .value();

    if (!user) {
      return res.status(404).json({ error: 'User Not found' });
    }

    const ratings = await db.get('ratings')
      .filter({ userId: req.query.userId })
      .sortBy('rating').reverse()
      .value();

    if (!ratings || ratings.length === 0) {
      return res.json([]);
    }

    res.json(ratings);
  });


  return app;
}

/* istanbul ignore if */
if (require.main === module) {
  (async () => {
    const app = await createApp(constants.DB_PATH);
    const port = process.env.PORT || 8000;

    app.listen(port, () => {
      console.log(`Butterfly API started at http://localhost:${port}`);
    });
  })();
}

module.exports = createApp;
