import mongoose from "mongoose";

const SongSchema = new mongoose.Schema({
  name: { type: String, required: true },
  size: { type: Number, required: true },
  url: { type: String, required: true },
  category: { type: String, required: false },
  artist: { type: String, required: false },
  releaseDate: { type: String, required: false },
});

export default mongoose.models.Song || mongoose.model("Song", SongSchema);
