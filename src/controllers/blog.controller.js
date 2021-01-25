/* eslint-disable comma-dangle */
const BlogQuery = require('../query/blog.query');

const insert = async (req, res, next) => {
  try {
    const data = await BlogQuery.insert(req);
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

const findById = async (req, res, next) => {
  try {
    const product = await BlogQuery.findById(req.params.id);
    if (!product) {
      return next({ msg: 'Product not found', success: false, status: 500 });
    }
    res.status(200).json({ product, success: true, status: 200 });
  } catch (err) {
    return next(err);
  }
};

const remove = (req, res, next) => {
  BlogQuery.remove(req.params.id, res, next);
};

module.exports = {
  insert,
  findAll,
  remove,
  update,
  findById,
};
