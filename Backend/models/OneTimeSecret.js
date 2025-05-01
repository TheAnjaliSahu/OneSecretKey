const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const secretSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
});

// JWT token generation method
secretSchema.methods.generateToken = async function () {
  try {
    return jwt.sign(
      {
        userId: this._id.toString(),
        email: this.email
      },
      process.env.JWT_SECRET,
    //   'mysecretpassword',  // 🔥 Replace this with process.env.JWT_SECRET in production!
      { expiresIn: '30d' }
    );
  } catch (error) {
    console.error("JWT Generate Error:", error);
    throw new Error("Token generation failed");
  }
};

const OneTimeSecret = mongoose.model('OneTimeSecret', secretSchema);
module.exports = OneTimeSecret;