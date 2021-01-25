const router = require('express').Router();

const BlogController = require('../../controllers/blog.controller');

router.route('/').get(BlogController.findAll).post(BlogController.insert);
//   .delete(UserController.remove)
//   .put(UserController.update);
module.exports = router;
