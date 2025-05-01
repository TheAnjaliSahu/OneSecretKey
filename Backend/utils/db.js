const mongoose = require('mongoose');

//const URI = "mongodb://127.0.0.1:27017/otp-viewer";

const connectdb = async () => {
  try {
    await mongoose.connect(URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(" Connected to MongoDB successfully");
  } catch (error) {
    console.error(" Database connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectdb;




// register logisc
/*const mongoose = require('mongoose');

const URI = "mongodb://127.0.0.1:27017/otp-viewer";

const connectdb = async() =>{
    try{
        await mongoose.connect(URI);
        console.log("connection successfull to database server");
    }catch(error){
        console.log("database connection failed");
        process.exit(1);
    }

};

module.exports = connectdb; */