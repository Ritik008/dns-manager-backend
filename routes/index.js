const domainRoutes = require('./dns.routes')
const authRoutes = require('./auth.routes')
const router = require('express').Router()
const defaultRoutes = [
    {
      path: "/dns",
      route: domainRoutes,
    }, {
      path: "/auth",
      route: authRoutes,
    }

  ];
  
  defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
  
  module.exports = router;