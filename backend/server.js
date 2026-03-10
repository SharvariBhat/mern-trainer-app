import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const DB = process.env.MONGO_URL;

/* -------------------- Schema -------------------- */

const TrainerSchema = new mongoose.Schema({
  name: String,
  skills: String
});

const Trainer = mongoose.model("Trainer", TrainerSchema);

/* -------------------- Seed Data -------------------- */

async function seedData() {
  const count = await Trainer.countDocuments();

  if (count === 0) {
    await Trainer.insertMany([
      { name: "Mahesh", skills: "React" },
      { name: "Arun", skills: "Node" },
      { name: "Divya", skills: "MongoDB" }
    ]);

    console.log("Demo trainers inserted");
  }
}

/* -------------------- Routes -------------------- */

// Get trainers
app.get("/trainers", async (req, res) => {
  try {
    const data = await Trainer.find();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch trainers" });
  }
});

// Add trainer
app.post("/trainers", async (req, res) => {
  try {
    const trainer = new Trainer(req.body);
    await trainer.save();
    res.json({ message: "Trainer Added" });
  } catch (error) {
    res.status(500).json({ error: "Failed to add trainer" });
  }
});

/* -------------------- DB Connection -------------------- */

mongoose.connect(DB)
  .then(async () => {
    console.log("MongoDB Connected");

    await seedData();

    app.listen(PORT, () => {
      console.log(`Server running on ${PORT}`);
    });
  })
  .catch(err => {
    console.log("MongoDB connection error:", err);
  });