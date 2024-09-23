const express = require("express");
const router = express.Router();
const {
  getCategories,
  getServices,
  getServicesByCategory,
  getServicesByServiceType,
  getServiceTypes,
  getServiceTypesByCategory,
  getServiceById,
  getLoggedInUserDetails,
  getServicesByProvider,
} = require("../controllers/consumerController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/categories", getCategories);
router.get("/services", getServices);

router.get("/services/category/:categoryId", getServicesByCategory);
router.get("/services/service-type/:serviceTypeId", getServicesByServiceType);
router.get("/services/:serviceId", getServiceById);

router.get("/service-types", getServiceTypes);
router.get("/service-types/category/:categoryId", getServiceTypesByCategory);

router.get("/services/provider/:providerId", getServicesByProvider);

router.get("/me", authMiddleware, getLoggedInUserDetails);

module.exports = router;
