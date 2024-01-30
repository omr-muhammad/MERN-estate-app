import mongoose from "mongoose";

const listingSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Listing must have a name"],
    },
    description: {
      type: String,
      required: [true, `Listing must have a description.`],
    },
    address: {
      type: String,
      required: [true, `Listing must have an address`],
    },
    reqularPrice: {
      type: Number,
      required: [true, `Listing must have a price`],
    },
    discountPrice: {
      type: Number,
      required: [true, `Listing must have a discountPrice.`],
    },
    bathrooms: {
      type: Number,
      required: [true, `Listing must have at least one bathroom.`],
    },
    bedrooms: {
      type: Number,
      required: [true, `Listing must have at least one bedroom.`],
    },
    furnished: {
      type: Boolean,
      required: [true, `Listing must be defined as furnished or not.`],
    },
    parking: {
      type: Boolean,
      required: [true, `You must define if the listing has a parking or not.`],
    },
    type: {
      type: String,
      enum: ["rent", "sale"],
      required: [true, `Listing type must be 'rent' or 'sale'.`],
    },
    offer: {
      type: Boolean,
      required: [true, `Listing must be defined as in offer or not.`],
    },
    imgUrls: {
      type: Array,
      required: [true, `Listing must have images.`],
    },
    userRef: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, `Listing must belong to a user.`],
    },
  },
  { timestamps: true }
);

const Listing = mongoose.model("Listing", listingSchema);

export default Listing;
