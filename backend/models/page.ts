import mongoose, { Schema, Document } from "mongoose";

interface Block {
  tag: string;
  html?: string;
  imageUrl?: string;
}

interface Page extends Document {
  blocks: Block[];
  creator: Schema.Types.ObjectId;
}

const pageSchema: Schema<Page> = new Schema(
  {
    blocks: [
      {
        tag: {
          type: String,
          required: true,
        },
        html: {
          type: String,
          required: false,
        },
        imageUrl: {
          type: String,
          required: false,
        },
      },
    ],
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.model<Page>("Page", pageSchema);
