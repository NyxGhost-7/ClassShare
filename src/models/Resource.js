import mongoose from "mongoose";

const ResourceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    type: {
      type: String,
      enum: [
        "pdf",
        "doc",
        "docx",
        "ppt",
        "pptx",
        "image",
        "video",
        "link",
        "other",
      ],
      default: "other",
    },

    url: {
      type: String,
      required: true,
    },

    // Original filename
    // Example: "Operating Systems Notes.pdf"
    originalName: {
      type: String,
      default: null,
    },

    // Cloudinary resource type
    // image / video / raw
    resourceType: {
      type: String,
      default: "raw",
    },

    // Cloudinary public_id
    // Required for deleting uploaded files
    publicId: {
      type: String,
      default: null,
    },

    classroom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Classroom",
      required: true,
    },

 uploadedBy: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  default: null,
},
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Resource ||
  mongoose.model("Resource", ResourceSchema);