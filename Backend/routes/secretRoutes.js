const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const Secret = require('../models/Secret');  // Make sure this is the correct path
const { createSecret, getSecret } = require('../controllers/secretController');

// POST route to create a new secret
router.post('/', createSecret);

// GET route to get a secret with passphrase check
router.get('/:id', getSecret);  // Change POST to GET for retrieving secret
// router.get('/:id', getSecret);

// GET route to fetch the secret


// DELETE route to delete/view a secret by UUID
// const decrypt = (text) => {
//   const decipher = crypto.createDecipher('aes-256-ctr', process.env.SECRET_KEY);
//   let decrypted = decipher.update(text, 'hex', 'utf8');
//   decrypted += decipher.final('utf8');
//   return decrypted;
// };
router.delete('/:id', async (req, res) => {

  const  {id }  = req.params;
  const { passphrase } = req.query;
  console.log("id--", id);
  try {
    const secret = await Secret.findOne({ id });
    //  console.log("Secret--",secret);
    if (!secret) {
      console.log("Secret--", secret);
      return res.status(404).json({ message: 'Secret not found' });
    }
    console.log("PAssphrSE--", secret.passphrase);

    // console.log("match--",isMatch);
    if (secret.passphrase) { // Only check if passphrase exists
      if (!passphrase || typeof passphrase !== 'string' || passphrase.trim() === '') {
        return res.status(403).json({ message: 'Passphrase is required' });
      }
      // const decryptedPass = decrypt(secret.passphrase);

      const isMatch = await bcrypt.compare(passphrase, secret.passphrase);
      console.log("match--", isMatch);

      if (!isMatch) {
        return res.status(403).json({ message: 'Incorrect passphrase' });
      }
      //  console.log("match--",isMatch);
    }
    console.log("id--", id);
    await Secret.deleteOne({ id });
    // if (!secret) {
    //   console.log('No secret found for ID:', id);
    // }
    res.json({ message: 'Secret burned successfully!' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error burning secret' });
  }
});

module.exports = router;

