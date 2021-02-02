const router = require('express').Router();
const BlogController = require('../../controllers/blog.controller');

router.route('/').get(BlogController.findAll);
router.route('/featured').get(BlogController.getFeatured);
router.route('/mainfeatured').get(BlogController.getMainFeatured);
router.route('/like').post(BlogController.like);
router.route('/admin').post(BlogController.insert);
router
  .route('/admin/:id')
  .put(BlogController.update)
  .delete(BlogController.remove);
module.exports = router;
