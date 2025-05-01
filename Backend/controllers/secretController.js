const Secret = require('../models/Secret');
// const OneTimeSecret = require('../models/OneTimeSecret');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');
const bcrypt = require('bcrypt');

const ENCRYPTION_KEY = "12345678901234567890123456789012"; // 32 bytes

console.log("ENCRYPTION_KEY:", ENCRYPTION_KEY);

// Encrypt secret
function encrypt(text) {
  if (!ENCRYPTION_KEY) throw new Error("ENCRYPTION_KEY is missing.");
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY, 'utf-8'), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

// Decrypt secret
function decrypt(text) {
  const [ivHex, encryptedText] = text.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const encrypted = Buffer.from(encryptedText, 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY, 'utf-8'), iv);
  let decrypted = decipher.update(encrypted);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

// Create secret
exports.createSecret = async (req, res) => {
  try {
    const { content, passphrase, expiresInDays, expiresInHours, expiresInMinutes } = req.body;

    if (!content || (!expiresInDays && !expiresInHours && !expiresInMinutes)) {
      return res.status(400).json({ message: "Missing content or expiration." });
    }

    const id = uuidv4();
    const encryptedContent = encrypt(content);
    const hashedPass = passphrase ? await bcrypt.hash(passphrase, 10) : null;
    //Calculate the expiration 

    let expiresAt = new Date();
    if (expiresInDays) {
      expiresAt.setDate(expiresAt.getDate() + parseInt(expiresInDays));
    } else if (expiresInHours) {
      expiresAt.setHours(expiresAt.getHours() + parseInt(expiresInHours));
    } else if (expiresInMinutes) {
      expiresAt.setMinutes(expiresAt.getMinutes() + parseInt(expiresInMinutes)); // Add minuexpiresAt = new Date(Date.nw)
    }
    console.log('Expires At:', expiresAt);

    const secret = new Secret({ id,
       content: encryptedContent, 
       passphrase: hashedPass,
       expiresAt });
    // const response = await secret.save();

    try {
      const response = await secret.save();
      console.log('Saved successfully', response);
    } catch (error) {
      console.error('Error saving secret:', error);
    }
    res.json({
      link: `http://localhost:5173/secret/${id}`,
      id,
      createdAt: secret.createdAt,
      expiresAt: secret.expiresAt
    });

    console.log(`Saved secret with id: ${id}`);
  } catch (err) {
    console.error("Create secret error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get secret
exports.getSecret = async (req, res) => {
  try {
    const { id } = req.params;
    const { passphrase,reveal } = req.query;  // Use req.query to get passphrase from the URL
    
    const secret = await Secret.findOne({ id });
    // console.log(`Trying to fetch secret id: ${id}`);

    if (!secret) return res.status(404).json({ message: 'Secret not found' });

    if (secret.viewed) return res.status(410).json({ message: 'Already viewed' });

    if (new Date() > secret.expiresAt) {
      await Secret.deleteOne({ id });
      return res.status(410).json({ message: 'Secret expired' });
    }
     // ✅ STEP 1: If not revealing yet, just tell if passphrase is required
     if (!reveal) {
      return res.status(200).json({ passphraseRequired: !!secret.passphrase });
    }

    // If passphrase is required, check if it's correct
    if (secret.passphrase) {
      const isMatch = await bcrypt.compare(passphrase || "", secret.passphrase);
      if (!isMatch) return res.status(403).json({ message: 'Invalid passphrase' });
    }

    // Decrypt secret content
    const decryptedContent = decrypt(secret.content);

    secret.viewed = true;
    await secret.save();

    // await Secret.deleteOne({ uuid: id }); // Optional: one-time viewing
    // await Secret.deleteOne({ id }); // Optional: one-time viewing
    // console.log("Secret deleted with id:", id)

    res.json({ secret: decryptedContent });

  } catch (err) {
    console.error("Get secret error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Register user
exports.register = async (req, res) => {
  const { email, password } = req.body;
  try {
    const userExists = await OneTimeSecret.findOne({ email });
    if (userExists) return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await OneTimeSecret.create({ email, password: hashedPassword });
    const token = await user.generateToken();

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      userId: user._id.toString(),
      token,
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Login user
exports.signin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await OneTimeSecret.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid email or password" });

    const token = await user.generateToken();
    res.status(200).json({ message: "Signin successful", token, userId: user._id.toString() });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
