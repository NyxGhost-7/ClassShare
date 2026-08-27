import mongoose from "mongoose";

const ResourceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      default: "",
    },

    type: {
      type: String,
      enum: [
        "pdf",
        "doc",
        "ppt",
        "image",
        "link",
        "video",
        "other",
      ],
      required: true,
    },

    url: {
      type: String,
      required: true,
    },

    classroomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Classroom",
      required: true,
    },expiresAt: {
        type: Date,
        required: true,
        index: true,
      }
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Resource ||
  mongoose.model("Resource", ResourceSchema);