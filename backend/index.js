const { connectDB, disconnectDB } = require("./config/db");
const { startServer, stopServer } = require("./server");

async function initializeApp() {
  try {
    await connectDB();

    const server = startServer();

    // gracefully shutdown and cleanup
    process.on("SIGINT", async () => {
      await disconnectDB();
      stopServer(server);

      console.log("Server stopped and DB disconnected");
      process.exit(0);
    });
  } catch (error) {
    console.error("Error starting server", error);
    process.exit(1);
  }
}

initializeApp();
