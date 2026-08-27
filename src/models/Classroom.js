import mongoose from "mongoose";

const ClassroomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    /* HOST */

    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    /* PUBLIC OR PRIVATE */

    privacy: {
      type: String,
      enum: ["public", "private"],
      default: "private",
    },

    /* ONLY REQUIRED FOR PRIVATE */

    code: {
      type: String,
      unique: true,
      sparse: true,
      uppercase: true,
      trim: true,
    },

    /* MEMBERS */

    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Classroom ||
  mongoose.model(
    "Classroom",
    ClassroomSchema
  );