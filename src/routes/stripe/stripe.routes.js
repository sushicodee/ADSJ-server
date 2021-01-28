const router = require('express').Router();

const StripeController = require('../../controllers/stripe.controller');

router.route('/').post(StripeController.insert);
//   .delete(UserController.remove)
//   .put(UserController.update);
module.exports = router;
