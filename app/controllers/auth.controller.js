const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;
const nodemailer = require("nodemailer"); // Add this line to import nodemailer
const { v4: uuidv4 } = require('uuid');
var jwt = require("jsonwebtoken");

var bcrypt = require("bcryptjs");
exports.signup = async (req, res) => {
  
  try {
    const confirmationCode = generateConfirmationCode(); //change1
    const token1 = Math.random().toString(36).substr(2) + Date.now().toString(36); //change1 
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
      confirmationCode,
      token1,
      isConfirmed: false,
    });
    
    const savedUser = await user.save();

    

    if (req.body.roles) {
      const roles = await Role.find({ name: { $in: req.body.roles } });
      savedUser.roles = roles.map((role) => role._id);
    } else {
      const role = await Role.findOne({ name: "user" });
      savedUser.roles = [role._id];
    }

    await savedUser.save();
    
    sendConfirmationEmail(req.body.email, confirmationCode); //change 1
    // res.send('good')
    // res.send({ message: "User was registered successfully!" });
    // res.render('register');
  } catch (err) {
    // res.status(500).send({ message: err });
    res.send('hello')
  }
};
// ---------
function generateConfirmationCode() {
  // return uuidv4().toString().replace(/-/g, ''); // Generate a random confirmation code using UUID
  const code = Math.floor(100000 + Math.random() * 900000); // Generates a 6-digit random number
  return code.toString();  
}

function sendConfirmationEmail(email, confirmationCode) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'gautamsingh893591@gmail.com',
      pass: 'tcdencsoubsnhymc'
    }
  });

  const mailOptions = {
    from: 'your-email@gmail.com',
    to: email,
    subject: 'Blockcept.ai Confirmation Email',
    text: ` Hii ,
    Thank you for joining us. We're glad to have you on board.
      
      You're receiving this e-mail because you have registered 
      in our Blockcept.ai.  
      
    Your confirmation code is: ${confirmationCode}`
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}
exports.confirmed = async (req, res) => {
  const { confirmationCode } = req.body; // Destructure 'confirmationCode' directly

  try {
    const user = await User.findOne({ confirmationCode });

    console.log("1");

    if (user) {
      console.log("2");
      user.isConfirmed = true;
      await user.save();
      // res.redirect('/'); // Redirect to login after successful confirmation
      res.render("register");
    } else {
      console.log("3");
      return res.status(404).send('User not found or invalid verification code.');
    }
  } catch (err) {
    console.error(err);
    return res.status(500).send('Internal Server Error');
  }
};




// ========

exports.signin = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username }).populate(
      "roles",
      "-__v"
    );

    if (!user) {
      return res.status(404).send({ message: "User Not found." });
    }

    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );

    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: "Invalid Password!",
      });
    }

    // const token = jwt.sign({ id: user.id }, config.secret, {
    //   algorithm: "HS256",
    //   allowInsecureKeySizes: true,
    //   expiresIn: 86400, // 24 hours
    // });

    // const authorities = user.roles.map(
    //   (role) => "ROLE_" + role.name.toUpperCase()
    // );

    // res.status(200).send({
    //   id: user._id,
    //   username: user.username,
    //   email: user.email,
    //   roles: authorities,
    //   accessToken: token,
    // });
    res.render('home');
  } catch (err) {
    res.status(500).send({ message: err });
  }
};
// ------------------------------------------
