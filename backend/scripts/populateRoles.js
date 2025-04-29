const mongoose = require("mongoose");
const Role = require("../models/Role");
const { CONFIG } = require("../config/core");
mongoose
  .connect(CONFIG.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

const roles = [
  {
    name: "superadmin",
    description: "Has all permissions and full system access.",
    permissions: ["*"], // can be adjusted
  },
  {
    name: "admin",
    description: "Can manage users and settings.",
    permissions: ["manage-users", "view-settings"],
  },
  {
    name: "staff",
    description: "Can access limited system features.",
    permissions: ["view-dashboard"],
  },
];

async function populateRoles() {
  try {
    // Optional: Clear existing roles if you want a full reset
    // await Role.deleteMany({});

    let inserted = 0;
    for (const role of roles) {
      const exists = await Role.findOne({ name: role.name.toLowerCase() });
      if (!exists) {
        await Role.create(role);
        inserted++;
        console.log(`➕ Added role: ${role.name}`);
      } else {
        console.log(`✔ Role already exists: ${role.name}`);
      }
    }

    console.log(`🎉 ${inserted} new role(s) added to the database.`);
  } catch (error) {
    console.error("❌ Error populating roles:", error);
  } finally {
    mongoose.connection.close();
    console.log("🔌 MongoDB connection closed.");
  }
}

populateRoles();
