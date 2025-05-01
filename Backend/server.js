const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const secretRoutes = require('./routes/secretRoutes');
const otpRoutes = require('./routes/authRoutes');

dotenv.config();
const app = express();

app.use(cors({
  // origin: 'http://localhost:5173'
  origin: process.env.NODE_ENV === 'production' ? 'https://yourfrontenddomain.com' : 'http://localhost:5173',

}));



//app.use(cors());
app.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

app.use('/api/secret', secretRoutes);
app.use('/api/auth',otpRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
/*const express = require('express');
const cors = require('cors');
const connectdb = require('./utils/db');
const secretRoutes = require('./router/secretRoutes');

const app = express();
app.use(cors());
app.use(express.json()); 
app.use('/api', secretRoutes);



const PORT =5000;
// Start server
connectdb().then(()=>{

app.listen(PORT, () => {
  console.log(`Server is running at Port: ${PORT}`);
});
});
*/
