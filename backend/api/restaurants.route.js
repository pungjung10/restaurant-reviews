import express from "express";
import RestaurantsCtrl from "./restaurants.controller.js";
import ReviewsCtrl from "./reviews.controller.js";

const router = express.Router();

// gets a list of all restaurants
router.route("/").get(RestaurantsCtrl.apiGetRestaurants);
// get a list of specific restaurant&id -> get res. and all reviews that are associated with that res.
router.route("/id/:id").get(RestaurantsCtrl.apiGetRestaurantById);
// return list of cuisines bc. want to select cuisines from a drop down menu
router.route("/cuisines").get(RestaurantsCtrl.apiGetRestaurantCuisines);

router
  .route("/review")
  .post(ReviewsCtrl.apiPostReview)
  .put(ReviewsCtrl.apiUpdateReview)
  .delete(ReviewsCtrl.apiDeleteReview);

export default router;
