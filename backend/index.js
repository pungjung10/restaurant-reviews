//connect to the database and start the server
import app from "./server.js";
import mongodb from "mongodb";
import dotenv from "dotenv";  //allow us to access our envi. variablr
import RestaurantsDAO from "./dao/restaurantsDAO.js"; 
import ReviewsDAO from "./dao/reviewsDAO.js";

dotenv.config();    //have to configure env (load in the envi. variable)
const MongoClient = mongodb.MongoClient;    //have to get access to our client from mongoDB

const port = process.env.PORT || 8000;

//connect to the database
MongoClient.connect(process.env.RESTREVIEWS_DB_URI, {
    maxPoolSize: 50,    // 50 people connect at a time
    wtimeoutMS: 2500 ,
    useUnifiedTopology: true,
  })
  .catch((err) => {
    console.error(err.stack);
    process.exit(1);
  })
  .then(async (client) => {
    await RestaurantsDAO.injectDB(client); //get init. ref. to the res. collection in database
    await ReviewsDAO.injectDB(client);
    // how we start our web server
    app.listen(port, () => {
      console.log(`listening on port ${port}`);
    });
  });