/* eslint-disable comma-dangle */
const BlogQuery = require('../query/blog.query');

const insert = async (req, res, next) => {
  try {
    const data = await BlogQuery.insert(req, res);
    res.status(200).json({ data, success: true, status: 200 });
  } catch (err) {
    next(err);
  }
};

const findAll = async (req, res, next) => {
  try {
    const dataList = await BlogQuery.findAll(req);
    return res.status(200).json({ dataList, status: true, statusCode: 200 });
  } catch (err) {
    return next({ ...err, status: false });
  }
};

const findById = (req, res, next) => {
  const condition = { id: req.params.id };
  BlogQuery.findOne(condition)
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      next(err);
    });
};

const update = async (req, res, next) => {
  try {
    const updatedProduct = await BlogQuery.update(
      req.params.id,
      req.body,
      next
    );
    if (!updatedProduct) {
      return next({ msg: 'Product not updated', success: false, status: 500 });
    }
    res.status(200).json({ updatedProduct, success: true, status: 200 });
  } catch (err) {
    return next({ err, success: false, status: 500 });
  }
};

const remove = (req, res, next) => {
  BlogQuery.remove(req.params.id, res, next);
};

const getFeatured = async (req, res, next) => {
  try {
    const blogs = await BlogQuery.getFeatured();
    res.status(200).json(blogs);
  } catch (err) {
    return next(err);
  }
};

const getMainFeatured = async (req, res, next) => {
  try {
    const blogs = await BlogQuery.getMainFeatured();
    res.status(200).json(blogs);
  } catch (err) {
    return next(err);
  }
};

const like = async (req, res, next) => {
  console.log(req.user);
  const user = req.loggedInUser.id;
  const { id } = req.params.id || req.body.id;
  const likes = await BlogQuery.like(id, user);
};
module.exports = {
  insert,
  findAll,
  remove,
  update,
  findById,
  getFeatured,
  getMainFeatured,
  like,
};
