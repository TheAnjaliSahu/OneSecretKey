const mongoose = require('mongoose');

const secretSchema = new mongoose.Schema({
  id: { type: String, unique: true, required: true },
  content: { type: String, required: true },
  passphrase: { type: String, default: null },
  expiresAt: { type: Date, required: true },
  viewed: { type: Boolean, default: false }
},{timestamps : true });

secretSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Secret', secretSchema);









/*const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const oneTimeSecretSchema = new mongoose.Schema({
  /*uuid: { type: String, required: true, unique: true },
  secret: { type: String, required: true },
  used: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now, expires: 600 } // Expires after 10 minutes */
/*
  email:{type:String,required:true,trim:true,unique:true},
  password:{type:String,required:true}
});


//json web token
oneTimeSecretSchema.methods.generateToken = async function (){
  try{
    return jwt.sign({
      userId:this._id.toString(),
      email:this.email,
      isAdmin :this.isAdmin
    },
    'mysecretpassword',
    {expiresIn: '30d'}
  );
} catch(error){
  console.error("jwt generate error :",error);
  throw new Error("Token generate failed");
}
}
  

//const User = new mongoose.model("User",oneTimeSecretSchema);
module.exports = mongoose.model('OneTimeSecret', oneTimeSecretSchema);
*/