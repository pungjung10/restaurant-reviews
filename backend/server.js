//configure an express server
import express from "express";
import cors from "cors";
import restaurants from "./api/restaurants.route.js";

const app = express();

//apply our middleware
app.use(cors());
app.use(express.json()); //our server can accept json in the body of a request(get/post request to our server it will be able to read json)

//initial URL
app.use("/api/v1/restaurants", restaurants); // v1=version1
app.use("*", (req, res) => res.status(404).json({ error: "not found" })); // goes to a route that doesn't actually exist

// export app as a module
export default app;


//.env file - store all envi. variable