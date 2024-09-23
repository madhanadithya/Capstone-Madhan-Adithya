const { body, param, validationResult } = require("express-validator");
const Category = require("../models/category");
const Service = require("../models/service");
const ServiceType = require("../models/serviceType");
const User = require("../models/user");

// Validation and sanitization middleware
const validateCategoryId = [
  param("categoryId").isMongoId().withMessage("Invalid category ID").escape(),
];

const validateProviderId = [
  param("providerId").isMongoId().withMessage("Invalid provider ID").escape(),
];

const validateServiceTypeId = [
  param("serviceTypeId")
    .isMongoId()
    .withMessage("Invalid service type ID")
    .escape(),
];

const validateServiceId = [
  param("serviceId").isMongoId().withMessage("Invalid service ID").escape(),
];

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};

exports.getServices = async (req, res) => {
  try {
    const services = await Service.find().populate("serviceType");
    res.json(services);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};

exports.getServicesByCategory = [
  ...validateCategoryId,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { categoryId } = req.params;

    try {
      const category = await Category.findById(categoryId);
      if (!category)
        return res.status(400).json({ msg: "Invalid category ID" });

      const serviceTypes = await ServiceType.find({ category: categoryId });
      const serviceTypeIds = serviceTypes.map((serviceType) => serviceType._id);

      const services = await Service.find({
        serviceType: { $in: serviceTypeIds },
      }).populate("serviceType");

      res.json(services);
    } catch (err) {
      res.status(400).json({ msg: err.message });
    }
  },
];

exports.getServicesByServiceType = [
  ...validateServiceTypeId,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { serviceTypeId } = req.params;

    try {
      const serviceType = await ServiceType.findById(serviceTypeId);
      if (!serviceType)
        return res.status(400).json({ msg: "Invalid service type ID" });

      const services = await Service.find({
        serviceType: serviceTypeId,
      })
        .populate("serviceType")
        .populate({
          path: "provider",
          select: "_id username email phoneNumber",
        });

      res.json(services);
    } catch (err) {
      res.status(400).json({ msg: err.message });
    }
  },
];

exports.getServiceTypes = async (req, res) => {
  try {
    const serviceTypes = await ServiceType.find();
    res.json(serviceTypes);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};

exports.getServiceTypesByCategory = async (req, res) => {
  const { categoryId } = req.params;

  try {
    const category = await Category.findById(categoryId);
    if (!category) return res.status(400).json({ msg: "Invalid category ID" });

    const serviceTypes = await ServiceType.find({ category: categoryId });
    res.json(serviceTypes);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};

exports.getServiceById = [
  ...validateServiceId,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { serviceId } = req.params;

    try {
      const service = await Service.findById(serviceId).populate("serviceType");
      if (!service) {
        return res.status(404).json({ msg: "Service not found" });
      }
      res.json(service);
    } catch (err) {
      res.status(400).json({ msg: err.message });
    }
  },
];

exports.getLoggedInUserDetails = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};



exports.getServicesByProvider = [
  ...validateProviderId,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { providerId } = req.params;

    try {
      const services = await Service.find({ provider: providerId })
        .populate("serviceType")
        .populate({
          path: "provider",
          select: "_id username email phoneNumber",
        });

      if (!services.length) {
        return res.status(404).json({ msg: "No services found for this provider" });
      }

      res.json(services);
    } catch (err) {
      res.status(400).json({ msg: err.message });
    }
  },
];