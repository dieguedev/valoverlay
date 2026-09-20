process.env.DATABASE_URL =
  process.env.TEST_DATABASE_URL ??
  process.env.DATABASE_URL ??
  "postgres://valoverlay:valoverlay@localhost:5432/valoverlay_test";
