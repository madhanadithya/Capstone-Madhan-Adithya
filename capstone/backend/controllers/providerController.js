const { check, validationResult } = require("express-validator");
const Service = require("../models/service");
const ServiceType = require("../models/serviceType");
const User = require("../models/user"); 

const serviceValidationRules = () => {
  return [
    check("name").notEmpty().withMessage("Name is required").escape(),
    check("description").optional().escape(),
    check("serviceTypeId").isMongoId().withMessage("Invalid service type ID"),
    check("price").isNumeric().withMessage("Price must be a number"),
    check("timeRequired")
      .matches(/^\d{1,2}:\d{2}$/)
      .withMessage("Time required must be in HH:MM format"),
    check("location")
      .optional()
      .isObject()
      .withMessage("Location must be an object")
      .custom((value) => {
        if (!value.city || !value.state) {
          throw new Error("Location must have city and state");
        }
        return true;
      }),
    check("image").optional().isURL().withMessage("Image must be a valid URL"),
  ];
};

exports.createService = [
  serviceValidationRules(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      name,
      description,
      serviceTypeId,
      price,
      timeRequired,
      location,
      image,
    } = req.body;

    try {
      const serviceType = await ServiceType.findById(serviceTypeId);
      if (!serviceType) {
        return res.status(400).json({ msg: "Invalid service type ID" });
      }

      const provider = await User.findById(req.user.userId);
      if (!provider) {
        return res.status(400).json({ msg: "Invalid provider ID" });
      }

      const service = new Service({
        name,
        description,
        serviceType: serviceTypeId,
        provider: req.user.userId,
        price,
        timeRequired,
        location,
        image,
      });

      await service.save();

      const response = {
        ...service.toObject(),
        provider: {
          _id: provider._id,
          name: provider.username,
          email: provider.email,
          phoneNumber: provider.phoneNumber,
        },
      };

      res.status(201).json(response);
    } catch (err) {
      res.status(400).json({ msg: err.message });
    }
  },
];

exports.updateService = [
  serviceValidationRules(),
  async (req, res) => {
    const { id } = req.params;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      name,
      description,
      serviceTypeId,
      price,
      timeRequired,
      location,
      image,
    } = req.body;

    try {
      const serviceType = await ServiceType.findById(serviceTypeId);
      if (!serviceType) {
        return res.status(400).json({ msg: "Invalid service type ID" });
      }

      const provider = await User.findById(req.user.userId);
      if (!provider) {
        return res.status(400).json({ msg: "Invalid provider ID" });
      }

      const service = await Service.findByIdAndUpdate(
        id,
        {
          name,
          description,
          serviceType: serviceTypeId,
          price,
          timeRequired,
          location,
          image,
        },
        { new: true }
      );

      if (!service) {
        return res.status(404).json({ msg: "Service not found" });
      }

      // Construct the response
      const response = {
        ...service.toObject(),
        provider: {
          _id: provider._id,
          name: provider.username,
          email: provider.email,
          phoneNumber: provider.phoneNumber,
        },
      };

      res.json(response);
    } catch (err) {
      res.status(400).json({ msg: err.message });
    }
  },
];

// Delete Service
exports.deleteService = async (req, res) => {
  const { id } = req.params;
  try {
    await Service.findByIdAndDelete(id);
    res.json({ msg: "Service deleted" });
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};

// Get Services by Provider
exports.getServicesByProvider = async (req, res) => {
  try {
    const providerId = req.user.userId; // Get provider ID from authenticated user

    // Find services that match the provider ID
    const services = await Service.find({ provider: providerId }).populate(
      "serviceType",
      "name"
    );

    if (!services.length) {
      return res
        .status(404)
        .json({ msg: "No services found for this provider" });
    }

    res.json(services);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};
