// const CategoryModel = require('../models/category.model');
const mongoose = require('mongoose');

const BlogModel = require('./../models/blog.model');

const fs = require('fs');

const blogMapper = (blog, data) => {
  for (let key in data) {
    switch (key) {
      default:
        if (
          [
            'title',
            'description',
            'category',
            'startDate',
            'endDate',
            'rating',
            'address',
            '_id',
          ].includes(key)
        ) {
          blog[key] = data[key];
        }
        break;
    }
  }
};

const insert = async (req) => {
  // if (req.fileError) return next({ msg: 'Only images can be uploaded' });
  //   const category = await CategoryModel.findById(req.body.category);
  //   if (!category) {
  //     return next({ msg: 'Category is invalid' });
  //   }
  //   const file = req.file;
  //   if (!file) {
  //     return next({ msg: 'Please upload an image' });
  //   }
  const data = req.body;
  //   const fileName = file.filename;
  //   const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
  const newBlog = new BlogModel({});
  //   newBlog.image = `${basePath}${fileName}`;
  blogMapper(newBlog, data);
  return newBlog.save();
};

const findAll = (req) => {
  const filter = {};
  // let condition = '';
  //   if (req.query.categories) {
  //     filter = { category: req.query.categories.split(',') };
  //   }
  return (
    BlogModel.find(filter)
      // .select(condition)
      .sort({ _id: -1 })
      .exec()
  );
};

const update = async (id, data, next) => {
  //   const category = await CategoryModel.findById(data.category);
  //   if (!category) {
  //     return next({ msg: 'Category is invalid' });
  //   }
  const updatedData = {};
  blogMapper(updatedData, data);
  return BlogModel.findByIdAndUpdate(id, updatedData, { new: true });
};

const findById = (id) => BlogModel.findById(id);

const remove = (id, res, next) => {
  BlogModel.findById(id, (err, product) => {
    if (err) {
      return next(err);
    }
    if (!product) {
      return next({ message: 'product not found' });
    }

    product.remove((error, data) => {
      if (error) {
        return next(error);
      }
      const path = `./public/uploads/${data.image}`;

      try {
        fs.unlinkSync(path);
      } catch (fileError) {
        // eslint-disable-next-line no-console
        console.error(fileError);
      }
      res
        .status(200)
        .json({ data, message: 'the product is removed', success: true });
    });
  });
};

const getCount = async (_, res, next) => {
  try {
    const productCount = await BlogModel.countDocuments((count) => count);
    res.status(200).json({ productCount });
  } catch (err) {
    next({ err, status: 500 });
  }
};

module.exports = {
  insert,
  findById,
  update,
  remove,
  blogMapper,
  findAll,
  getCount,
};
