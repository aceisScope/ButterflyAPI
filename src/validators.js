'use strict';

const v = require('@mapbox/fusspot');

const validateButterfly = v.assert(
  v.strictShape({
    commonName: v.required(v.string),
    species: v.required(v.string),
    article: v.required(v.string)
  })
);

const validateUser = v.assert(
  v.strictShape({
    username: v.required(v.string)
  })
);

const validateRatings = v.assert(
  v.strictShape({
    userId: v.required(v.string),
    butterflyId: v.required(v.string),
    rating: v.required(v.range([0, 5]))
  })
);

const validateUserId = v.assert(
  v.strictShape({
    userId: v.required(v.string)
  })
);

module.exports = {
  validateButterfly,
  validateUser,
  validateRatings,
  validateUserId
};
