const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");
const {
  createCategory,
  updateCategory,
  deleteCategory,
  createServiceType,
  updateServiceType,
  deleteServiceType,
  getCategories,
  getServiceTypes,
  getServiceTypesByCategory,
  getAllUsers,
  deleteUser,
} = require("../controllers/adminController");

router.post("/categories", auth, role(["admin"]), createCategory);
router.get("/categories", auth, role(["admin"]), getCategories);
router.put("/categories/:id", auth, role(["admin"]), updateCategory);
router.delete("/categories/:id", auth, role(["admin"]), deleteCategory);

router.post("/service-types", auth, role(["admin"]), createServiceType);
router.get("/service-types", auth, role(["admin"]), getServiceTypes);
router.get(
  "/service-types/:categoryId",
  auth,
  role(["admin"]),
  getServiceTypesByCategory
);
router.put("/service-types/:id", auth, role(["admin"]), updateServiceType);
router.delete("/service-types/:id", auth, role(["admin"]), deleteServiceType);

router.get("/users", auth, role(["admin"]), getAllUsers);
router.delete("/users/:id", auth, role(["admin"]), deleteUser);

module.exports = router;
