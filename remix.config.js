/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  ignoredRouteFiles: ["**/.*"],
  future: {
    unstable_dev: true,
    v2_routeConvention: true,
    unstable_cssModules: true,
    unstable_tailwind: true,
  },
};
