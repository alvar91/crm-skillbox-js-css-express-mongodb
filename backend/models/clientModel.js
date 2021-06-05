import mongoose from "mongoose";

const clientSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      lowercase: true,
      maxlength: 100,
      required: [true, "Please tell us your name!"],
    },
    surname: {
      type: String,
      trim: true,
      lowercase: true,
      maxlength: 100,
      required: [true, "Please tell us your surname!"],
    },
    lastname: {
      type: String,
      trim: true,
      lowercase: true,
      maxlength: 100,
    },
    contacts: {
      type: [{ type: { type: String }, value: String }],
      trim: true,
    },
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
    versionKey: false,
  }
);

const Client = mongoose.model("Client", clientSchema);

export default Client;
