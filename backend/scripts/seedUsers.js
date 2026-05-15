/**
 * Seed script — creates 25 test users in MongoDB.
 * Run once:  node backend/scripts/seedUsers.js
 * Safe to re-run: skips emails that already exist.
 */

import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../.env") });

// ── Inline schema (avoids importing the model which triggers hooks twice) ────
const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, select: false },
    otp: { type: String, default: null, select: false },
    otpExpiry: { type: Date, default: null, select: false },
    isVerified: { type: Boolean, default: true },
    isEmailVerified: { type: Boolean, default: true },
    resetPasswordOtp: { type: String, default: null, select: false },
    resetPasswordOtpExpiry: { type: Date, default: null, select: false },
    lastLogin: { type: Date, default: null },
    avatar: { type: Number, default: 1, min: 1, max: 10 },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);

// ── Test users ─────────────────────────────────────────────────────────────
const TEST_USERS = [
  {
    fullName: "Alice Johnson",
    email: "alice.johnson@testmail.com",
    password: "Alice@123",
    avatar: 1,
  },
  {
    fullName: "Bob Martinez",
    email: "bob.martinez@testmail.com",
    password: "Bob@1234",
    avatar: 2,
  },
  {
    fullName: "Carol Williams",
    email: "carol.williams@testmail.com",
    password: "Carol@123",
    avatar: 3,
  },
  {
    fullName: "David Lee",
    email: "david.lee@testmail.com",
    password: "David@123",
    avatar: 4,
  },
  {
    fullName: "Eva Chen",
    email: "eva.chen@testmail.com",
    password: "Eva@12345",
    avatar: 5,
  },
  {
    fullName: "Frank Brown",
    email: "frank.brown@testmail.com",
    password: "Frank@123",
    avatar: 6,
  },
  {
    fullName: "Grace Kim",
    email: "grace.kim@testmail.com",
    password: "Grace@123",
    avatar: 7,
  },
  {
    fullName: "Henry Patel",
    email: "henry.patel@testmail.com",
    password: "Henry@123",
    avatar: 8,
  },
  {
    fullName: "Isabella Scott",
    email: "isabella.scott@testmail.com",
    password: "Bella@123",
    avatar: 9,
  },
  {
    fullName: "James Wilson",
    email: "james.wilson@testmail.com",
    password: "James@123",
    avatar: 10,
  },
  {
    fullName: "Karen Davis",
    email: "karen.davis@testmail.com",
    password: "Karen@123",
    avatar: 1,
  },
  {
    fullName: "Liam Taylor",
    email: "liam.taylor@testmail.com",
    password: "Liam@1234",
    avatar: 2,
  },
  {
    fullName: "Mia Anderson",
    email: "mia.anderson@testmail.com",
    password: "Mia@12345",
    avatar: 3,
  },
  {
    fullName: "Noah Thomas",
    email: "noah.thomas@testmail.com",
    password: "Noah@1234",
    avatar: 4,
  },
  {
    fullName: "Olivia Jackson",
    email: "olivia.jackson@testmail.com",
    password: "Olivia@123",
    avatar: 5,
  },
  {
    fullName: "Peter Harris",
    email: "peter.harris@testmail.com",
    password: "Peter@123",
    avatar: 6,
  },
  {
    fullName: "Quinn Robinson",
    email: "quinn.robinson@testmail.com",
    password: "Quinn@123",
    avatar: 7,
  },
  {
    fullName: "Rachel Lewis",
    email: "rachel.lewis@testmail.com",
    password: "Rachel@123",
    avatar: 8,
  },
  {
    fullName: "Samuel Walker",
    email: "samuel.walker@testmail.com",
    password: "Sam@12345",
    avatar: 9,
  },
  {
    fullName: "Tina Hall",
    email: "tina.hall@testmail.com",
    password: "Tina@1234",
    avatar: 10,
  },
  {
    fullName: "Uma Young",
    email: "uma.young@testmail.com",
    password: "Uma@12345",
    avatar: 1,
  },
  {
    fullName: "Victor Allen",
    email: "victor.allen@testmail.com",
    password: "Victor@123",
    avatar: 2,
  },
  {
    fullName: "Wendy King",
    email: "wendy.king@testmail.com",
    password: "Wendy@123",
    avatar: 3,
  },
  {
    fullName: "Xander Wright",
    email: "xander.wright@testmail.com",
    password: "Xander@123",
    avatar: 4,
  },
  {
    fullName: "Yara Lopez",
    email: "yara.lopez@testmail.com",
    password: "Yara@1234",
    avatar: 5,
  },
];

// ── Main ───────────────────────────────────────────────────────────────────
async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("❌  MONGODB_URI not found in .env");
    process.exit(1);
  }

  await mongoose.connect(uri);
  console.log("✅  Connected to MongoDB\n");

  let created = 0;
  let skipped = 0;

  for (const u of TEST_USERS) {
    const exists = await User.findOne({ email: u.email }).lean();
    if (exists) {
      console.log(`⏭   Skipped (already exists): ${u.email}`);
      skipped++;
      continue;
    }

    const salt = await bcryptjs.genSalt(10);
    const hashed = await bcryptjs.hash(u.password, salt);

    await User.create({
      fullName: u.fullName,
      email: u.email,
      password: hashed,
      avatar: u.avatar,
      isVerified: true,
      isEmailVerified: true,
    });

    console.log(`✅  Created: ${u.fullName.padEnd(20)} ${u.email}`);
    created++;
  }

  console.log(`\n─────────────────────────────────────────`);
  console.log(`Created : ${created}`);
  console.log(`Skipped : ${skipped}`);
  console.log(`Total   : ${TEST_USERS.length}`);
  console.log(`─────────────────────────────────────────\n`);

  await mongoose.disconnect();
  console.log("🔌  Disconnected. Done.");
}

seed().catch((err) => {
  console.error("❌  Seed failed:", err.message);
  process.exit(1);
});
