module.exports = app => {
  const inventory = require("../controllers/inventory.controller.js");

  var router = require("express").Router();

  // Retrieve all inventory
  router.get("/getrack", inventory.findAll);
  router.get("/geallbilling", inventory.findAllBilling);

  // Retrieve a single inventory with id
  router.get("/:id", inventory.findOne);

  // Update a inventory with id
  router.put("/:id", inventory.update);
  router.post("/updaterack", inventory.updateorder);
  router.post("/addproduct", inventory.addproduct);


  app.use('/api/inventory', router);
};
