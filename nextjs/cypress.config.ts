import { defineConfig } from "cypress";

export default defineConfig({
  projectId: "dckow2",

  component: {
    devServer: {
      framework: "next",
      bundler: "webpack",
    },
  },

  e2e: {
    // Configuration specific to end-to-end tests
    video: true, // Enable video recording of test runs
    screenshotOnRunFailure: true, // Take a screenshot on test failure
    defaultCommandTimeout: 5000, // Set the default command timeout
    // ... add more configuration options as needed

  },
});
