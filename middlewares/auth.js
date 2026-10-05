exports.requireAuth = (req, res, next) => {
  if (!req.session.user) return res.redirect('/login');
  next();
};

exports.guestOnly = (req, res, next) => {
  if (req.session.user) return res.redirect('/agentes');
  next();
};
