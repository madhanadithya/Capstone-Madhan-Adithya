const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");
const {
  createService,
  updateService,
  deleteService,
  getServicesByProvider,
} = require("../controllers/providerController");

router.post("/services", auth, role(["provider"]), createService);
router.put("/services/:id", auth, role(["provider"]), updateService);
router.delete("/services/:id", auth, role(["provider"]), deleteService);
router.get("/services", auth, role(["provider"]), getServicesByProvider);


module.exports = router;
