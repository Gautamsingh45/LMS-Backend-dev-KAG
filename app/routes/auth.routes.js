const { verifySignUp } = require("../middlewares");
const controller = require("../controllers/auth.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
// Render the sign-up page

app.get('/', (req, res) => {
  res.render('register');
});

  app.post(
    "/api/auth/signup",
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted
    ],
    controller.signup
  );
// Render the sign-in page
// app.get('/signin', (req, res) => {
//   res.render('signin');
// });

  app.post("/api/auth/signin", controller.signin);
  // ----------
  app.post('/confirmation',controller.confirmed);
  
  // start
  
// ----------
app.get('/home', (req, res) => {
    res.render('home');
});
app.get('/about', (req, res) => {
  res.render('about');
});
app.get('/admin', (req, res) => {
  res.render('admin');
});
app.get('/confirmation', (req, res) => {
  res.render('confirmation');
});
app.get('/contact', (req, res) => {
  res.render('contact');
});
app.get('/courses', (req, res) => {
  res.render('courses');
});
app.get('/login', (req, res) => {
  res.render('login');
});
app.get('/playlist', (req, res) => {
  res.render('playlist');
});
app.get('/profile', (req, res) => {
  res.render('profile');
});
app.get('/teacher_profile', (req, res) => {
  res.render('teacher_profile');
});
app.get('/teachers', (req, res) => {
  res.render('teachers');
});
app.get('/update', (req, res) => {
  res.render('update');
});
app.get('/what', (req, res) => {
  res.render('what');
});

app.get('/logout', (req, res) => {
  res.render('register');
});


};

