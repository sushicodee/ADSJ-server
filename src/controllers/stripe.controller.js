const StripeQuery = require('../query/stripe.query');

const insert = async (req, res, next) => {
  try {
    const result = await StripeQuery.insert(req, res, next);
    res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
};

module.exports = { insert };
