import mongoose from "mongoose"

const ItemSchema = new mongoose.Schema({
  name: String,
  createdAt: { type: Date, default: Date.now },
})

export default mongoose.models.Item || mongoose.model("Item", ItemSchema)

