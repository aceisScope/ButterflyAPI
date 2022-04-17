'use strict';

const { validateButterfly, validateUser, validateRatings } = require('../src/validators');

describe('validateButterfly', () => {
  const validButterfly = {
    commonName: 'Butterfly Name',
    species: 'Species name',
    article: 'http://example.com/article'
  };

  it('is ok for a valid butterfly', () => {
    const result = validateButterfly(validButterfly);
    expect(result).toBe(undefined);
  });

  it('throws an error when invalid', () => {
    expect(() => {
      validateButterfly({});
    }).toThrow('The following properties have invalid values:');

    expect(() => {
      validateButterfly({
        ...validButterfly,
        commonName: 123
      });
    }).toThrow('commonName must be a string.');

    expect(() => {
      validateButterfly({
        extra: 'field',
        ...validButterfly
      });
    }).toThrow('The following keys are invalid: extra');
  });
});

describe('validateUser', () => {
  const validUser = {
    username: 'test-user'
  };

  it('is ok for a valid user', () => {
    const result = validateUser(validUser);
    expect(result).toBe(undefined);
  });

  it('throws an error when invalid', () => {
    expect(() => {
      validateUser({});
    }).toThrow('username is required');

    expect(() => {
      validateUser({
        extra: 'field',
        ...validUser
      });
    }).toThrow('The following keys are invalid: extra');

    expect(() => {
      validateUser({
        username: [555]
      });
    }).toThrow('username must be a string');
  });
});

describe('validate rating', () => {
  const validRating = {
    userId: 'OOWzUaHLsK',
    butterflyId: 'DCenP4kQNQ',
    rating: 2.3
  };

  it('is ok for a valid rating', () => {
    const result = validateRatings(validRating);
    expect(result).toBe(undefined);
  });

  it('throws an error when invalid', () => {
    expect(() => {
      validateRatings({});
    }).toThrow('userId is required');

    expect(() => {
      validateRatings({ userId: 'OOWzUaHLsK', rating: 2.3 });
    }).toThrow('butterflyId is required');

    expect(() => {
      validateRatings({
        extra: 'field',
        ...validRating
      });
    }).toThrow('The following keys are invalid: extra');

    expect(() => {
      validateRatings({
        userId: [555]
      });
    }).toThrow('userId must be a string');

    expect(() => {
      validateRatings({
        userId: 'OOWzUaHLsK',
        butterflyId: 'DCenP4kQNQ',
        rating: 55
      });
    }).toThrow('rating must be a number between 0 & 5 (inclusive).');
  });
});
