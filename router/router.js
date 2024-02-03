const express = require("express");
const router = express.Router();
const {createOrder,placeOrder,getAllOrder,getSingleOrder,updateOrder,createUser} = require("../controllers/controllers")
router.post("/creteuser",createUser)
router.post("/",createOrder)
router.post("/placeorder",placeOrder)
router.get('/',getAllOrder);
router.get("/:id",getSingleOrder)
router.patch("/",updateOrder)

module.exports = router;