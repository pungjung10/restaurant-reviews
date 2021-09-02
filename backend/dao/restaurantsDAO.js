import mongodb from "mongodb";
const ObjectId = mongodb.ObjectId;
let restaurants;        //store a reference to our database

export default class RestaurantsDAO {
    //initially connect to our database call as soon as server start
    static async injectDB(conn) {
      //have ref
      if (restaurants) {
        return;
      }
      try {
        restaurants = await conn
          .db(process.env.RESTREVIEWS_NS)
          .collection("restaurants");
      } catch (e) {
        console.error(
          `Unable to establish a collection handle in restaurantsDAO: ${e}`
        );
      }
    }
  
    static async getRestaurants({
      filters = null,
      page = 0,
      restaurantsPerPage = 20,
    } = {}) {
      let query;
      if (filters) {
        if ("name" in filters) {
          query = { $text: { $search: filters["name"] } }; // text search from which field from the database? >> require setup
        } else if ("cuisine" in filters) {
          query = { cuisine: { $eq: filters["cuisine"] } };
        } else if ("zipcode" in filters) {
          query = { "address.zipcode": { $eq: filters["zipcode"] } };
        }
      }
  
      let cursor;
      //find all restaureant from the database
      try {
        cursor = await restaurants.find(query);
      } catch (e) {
        console.error(`Unable to issue find command, ${e}`);
        return { restaurantsList: [], totalNumRestaurants: 0 };
      }
  
      //limit the results
      //skip used for get actual page number
      const displayCursor = cursor
        .limit(restaurantsPerPage)
        .skip(restaurantsPerPage * page);
  
      try {
        //set restuarant to an array
        const restaurantsList = await displayCursor.toArray();
        const totalNumRestaurants = await restaurants.countDocuments(query); //get total number of res.
  
        return { restaurantsList, totalNumRestaurants };
      } catch (e) {
        console.error(
          `Unable to convert cursor to array or problem counting documents, ${e}`
        );
        return { restaurantsList: [], totalNumRestaurants: 0 };
      }
    }
    static async getRestaurantByID(id) {
      try {
        // create pipeline that  match collections together
        const pipeline = [
          {
            $match: {
              _id: new ObjectId(id),
            },
          },
          {
            $lookup: {
              from: "reviews",
              let: {
                id: "$_id",
              },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $eq: ["$restaurant_id", "$$id"],
                    },
                  },
                },
                {
                  $sort: {
                    date: -1,
                  },
                },
              ],
              as: "reviews",
            },
          },
          {
            $addFields: {
              reviews: "$reviews",
            },
          },
        ];
        return await restaurants.aggregate(pipeline).next();
      } catch (e) {
        console.error(`Something went wrong in getRestaurantByID: ${e}`);
        throw e;
      }
    }
  
    static async getCuisines() {
      let cuisines = [];
      try {
        cuisines = await restaurants.distinct("cuisine");
        return cuisines;
      } catch (e) {
        console.error(`Unable to get cuisines, ${e}`);
        return cuisines;
      }
    }
  }
  