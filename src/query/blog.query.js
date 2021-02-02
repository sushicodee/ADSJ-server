// const CategoryModel = require('../models/category.model');
const mongoose = require('mongoose');

const BlogModel = require('./../models/blog.model');

const upload = require('../services/fileUpload');

const blogMapper = (blog, data) => {
  Object.keys(data).forEach((key) => {
    if (
      [
        'title',
        'description',
        'category',
        'startDate',
        'endDate',
        'rating',
        'address',
        'id',
        'isFeatured',
        'isMainFeatured',
        'user',
        'youtubeUri',
      ].includes(key)
    ) {
      blog[key] = data[key];
    }
  });
};
const singleUpload = upload.single('image');

const insert = async (req, res) => {
  const data = req.body;
  console.log({ data });
  //   const fileName = file.filename;
  //   const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
  const newBlog = new BlogModel({});
  //   newBlog.image = `${basePath}${fileName}`;

  blogMapper(newBlog, data);

  // if (req.file) {
  console.log(req.file);
  //   singleUpload(req, res, function (err) {
  //     if (req.fileError) {
  //       return next({ message: 'File should be an image' });
  //     }
  //     if (err) {
  //       res.status(422);
  //       return next({ message: 'File upload error', detail: err.message });
  //     }
  //     newBlog.image = req.file.location;
  //     return newBlog.save();
  //   });
  // } else {
  return newBlog.save();
  // }
};

const findAll = () => {
  const filter = {};
  return BlogModel.find(filter).sort({ _id: -1 }).exec();
};

const update = async (id, data, next) => {
  const updatedData = {};
  blogMapper(updatedData, data);
  return BlogModel.findByIdAndUpdate(id || data.id, updatedData, { new: true });
};

const findById = (id) => BlogModel.findById(id);

const remove = (id, res, next) => {
  BlogModel.findById(id, (err, blog) => {
    if (err) {
      return next(err);
    }
    if (!blog) {
      return next({ message: 'blog not found' });
    }

    blog.remove((error, data) => {
      if (error) {
        return next(error);
      }
      // try {
      //   // todo remove file from s3 bucket
      //   // fs.unlinkSync(path);
      // } catch (fileError) {
      //   // eslint-disable-next-line no-console
      //   console.error(fileError);
      // }
      res
        .status(200)
        .json({ data, message: 'the blog is removed', success: true });
    });
  });
};

const getCount = async (_, res, next) => {
  try {
    const blogsCount = await BlogModel.countDocuments((count) => count);
    res.status(200).json({ blogsCount });
  } catch (err) {
    next({ err, status: 500 });
  }
};

const findOne = (condition) => BlogModel.findOne(condition);

const like = ({ blogId, user }) =>
  new Promise((resolve, reject) => {
    BlogModel.findById(blogId, (err, blog) => {
      if (err) {
        return reject({ message: 'blog not found' });
      }
      if (!blog.likes.includes(user)) {
        blog.likes = [...blog.likes, user];
      } else {
        const ind = blog.likes.indexOf(user);
        if (ind !== -1 && blog.likes.length > 0) {
          blog.likes.splice(ind, 1);
        }
      }
      blog.save((err, updated) => {
        if (err) {
          return reject(err);
        }
        resolve({ message: 'action successfull', updated });
      });
    });
  });

const getFeatured = () =>
  new Promise(async (resolve, reject) => {
    const blogs = await BlogModel.find({ isFeatured: true })
      .sort({ id: -1 })
      .limit(2)
      .exec();
    if (blogs) {
      resolve({ blogs });
    }
    reject({ message: 'error fetching blogs' });
  });

const getMainFeatured = () =>
  new Promise(async (resolve, reject) => {
    const blogs = await BlogModel.find({ isMainFeatured: true })
      .sort({ id: -1 })
      .limit(3)
      .exec();
    if (blogs) {
      resolve({ blogs });
    }
    reject({ message: 'error fetching blogs' });
  });

module.exports = {
  insert,
  findById,
  update,
  remove,
  blogMapper,
  findAll,
  findOne,
  getCount,
  like,
  getFeatured,
  getMainFeatured,
};
