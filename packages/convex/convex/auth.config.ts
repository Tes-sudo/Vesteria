export default {
  providers: [
    {
      domain: process.env.SITE_URL || "http://localhost:8081",
      applicationID: "convex",
    },
  ],
};