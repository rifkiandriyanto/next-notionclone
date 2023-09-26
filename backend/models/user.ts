import mongoose, { Schema, Document } from "mongoose";

interface User extends Document {
  email: string;
  password: string;
  name: string;
  active: boolean;
  activationToken?: string;
  resetToken?: string;
  resetTokenExpiry?: number;
  pages?: Schema.Types.ObjectId[];
}

const userSchema: Schema<User> = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    active: {
      type: Boolean,
      required: true,
      default: false,
    },
    activationToken: {
      type: String,
    },
    resetToken: {
      type: String,
    },
    resetTokenExpiry: {
      type: Number,
    },
    pages: [
      {
        type: Schema.Types.ObjectId,
        ref: "Page",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model<User>("User", userSchema);
