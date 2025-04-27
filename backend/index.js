require("dotenv").config();
const { connectDB, disconnectDB } = require("./config/db");
const { startServer, stopServer } = require("./server");
const Logger = require("./utils/logger")

async function initializeApp() {
  try {
    Logger("Initializing application...", null, "api-core", "info");
    await connectDB();

    const server = startServer();
    Logger("Server started successfully and DB connected", null, "api-core", "info");

    // gracefully shutdown and cleanup
    process.on("SIGINT", async () => {
      Logger("Received SIGINT. Shutting down server and disconnecting DB...", null, "api-core", "info");
      await disconnectDB();
      Logger("Server stopped and DB disconnected", null, "info");
      stopServer(server);

      console.log("Server stopped and DB disconnected");
      process.exit(0);
    });
  } catch (error) {
    Logger("Error initializing application",null, "api-core","error", error);
    console.error("Error starting server", error);
    process.exit(1);
  }
}

initializeApp();
