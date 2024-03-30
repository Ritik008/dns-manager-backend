const domainRoutes = require('./dns.routes')
const router = require('express').Router()

const defaultRoutes = [
    {
      path: "/dns",
      route: domainRoutes,
    }
  ];
  
  defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
  
  module.exports = router;