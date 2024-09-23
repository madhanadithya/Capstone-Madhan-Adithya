const { body, param, validationResult } = require("express-validator");
const Category = require("../models/category");
const ServiceType = require("../models/serviceType");
const User = require("../models/user");

const validateCategory = [
  body("name")
    .isString()
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Name must be a non-empty string"),
  body("image")
    .optional()
    .isString()
    .trim()
    .withMessage("Image must be a string if provided"),
];

const validateServiceType = [
  body("name")
    .isString()
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Name must be a non-empty string"),
  body("categoryId").isMongoId().withMessage("Invalid category ID"),
  body("image")
    .optional()
    .isString()
    .trim()
    .withMessage("Image must be a string if provided"),
];

const validateCategoryId = [
  param("id").isMongoId().withMessage("Invalid category ID"),
];

const validateServiceTypeId = [
  param("id").isMongoId().withMessage("Invalid service type ID"),
];

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

exports.createCategory = [
  ...validateCategory,
  handleValidationErrors,
  async (req, res) => {
    const { name, image } = req.body;
    try {
      const category = new Category({ name, image });
      await category.save();
      res.status(201).json(category);
    } catch (err) {
      res.status(400).json({ msg: err.message });
    }
  },
];

exports.updateCategory = [
  ...validateCategoryId,
  ...validateCategory,
  handleValidationErrors,
  async (req, res) => {
    const { id } = req.params;
    const { name, image } = req.body;
    try {
      const category = await Category.findByIdAndUpdate(
        id,
        { name, image },
        { new: true }
      );
      if (!category) return res.status(404).json({ msg: "Category not found" });
      res.json(category);
    } catch (err) {
      res.status(400).json({ msg: err.message });
    }
  },
];

exports.deleteCategory = [
  ...validateCategoryId,
  handleValidationErrors,
  async (req, res) => {
    const { id } = req.params;
    try {
      const category = await Category.findByIdAndDelete(id);
      if (!category) return res.status(404).json({ msg: "Category not found" });
      res.json({ msg: "Category deleted" });
    } catch (err) {
      res.status(400).json({ msg: err.message });
    }
  },
];

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find().select("name image");
    res.json(categories);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};

exports.createServiceType = [
  ...validateServiceType,
  handleValidationErrors,
  async (req, res) => {
    const { name, categoryId, image } = req.body;
    try {
      const category = await Category.findById(categoryId);
      if (!category)
        return res.status(400).json({ msg: "Invalid category ID" });

      const serviceType = new ServiceType({
        name,
        category: categoryId,
        image,
      });
      await serviceType.save();
      res.status(201).json(serviceType);
    } catch (err) {
      res.status(400).json({ msg: err.message });
    }
  },
];

exports.updateServiceType = [
  ...validateServiceTypeId,
  ...validateServiceType,
  handleValidationErrors,
  async (req, res) => {
    const { id } = req.params;
    const { name, categoryId, image } = req.body;
    try {
      if (categoryId) {
        const category = await Category.findById(categoryId);
        if (!category)
          return res.status(400).json({ msg: "Invalid category ID" });
      }

      const serviceType = await ServiceType.findByIdAndUpdate(
        id,
        { name, category: categoryId, image },
        { new: true }
      );

      if (!serviceType)
        return res.status(404).json({ msg: "Service type not found" });

      res.json(serviceType);
    } catch (err) {
      res.status(400).json({ msg: err.message });
    }
  },
];

exports.deleteServiceType = [
  ...validateServiceTypeId,
  handleValidationErrors,
  async (req, res) => {
    const { id } = req.params;
    try {
      const serviceType = await ServiceType.findByIdAndDelete(id);
      if (!serviceType)
        return res.status(404).json({ msg: "Service type not found" });
      res.json({ msg: "Service type deleted" });
    } catch (err) {
      res.status(400).json({ msg: err.message });
    }
  },
];

exports.getServiceTypes = async (req, res) => {
  try {
    const serviceTypes = await ServiceType.find().select("name category image");
    res.json(serviceTypes);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};

exports.getServiceTypesByCategory = [
  param("categoryId").isMongoId().withMessage("Invalid category ID"),
  handleValidationErrors,
  async (req, res) => {
    const { categoryId } = req.params;

    try {
      const category = await Category.findById(categoryId);
      if (!category)
        return res.status(400).json({ msg: "Invalid category ID" });

      const serviceTypes = await ServiceType.find({
        category: categoryId,
      }).select("name image");
      res.json(serviceTypes);
    } catch (err) {
      res.status(400).json({ msg: err.message });
    }
  },
];

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};

exports.deleteUser = [
  param("id").isMongoId().withMessage("Invalid user ID"),
  handleValidationErrors,
  async (req, res) => {
    const { id } = req.params;
    try {
      const user = await User.findByIdAndDelete(id);
      if (!user) return res.status(404).json({ msg: "User not found" });
      res.json({ msg: "User deleted" });
    } catch (err) {
      res.status(400).json({ msg: err.message });
    }
  },
];
