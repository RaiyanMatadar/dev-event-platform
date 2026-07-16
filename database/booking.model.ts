import mongoose, { Schema, InferSchemaType, Model } from "mongoose";
import { Event } from "./event.model";

/**
 * Booking schema definition for storing event registration details.
 *
 * Features:
 * - Validates that the referenced `eventId` corresponds to an existing Event document.
 * - Validates email format before saving.
 * - Indexes `eventId` for efficient lookups.
 * - Enables automatic timestamps for createdAt and updatedAt.
 */

// ---------------------------------------------------------------------------
// Schema definition
// ---------------------------------------------------------------------------
const BookingSchema = new Schema(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
      index: true, // Index on eventId for faster queries
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      // Validate email format using a regex pattern.
      validate: {
        validator: function (v: string) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: (props: { value: string }) =>
          `${props.value} is not a valid email address!`,
      },
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Infer the TypeScript type from the schema definition.
export type IBooking = InferSchemaType<typeof BookingSchema>;

// ---------------------------------------------------------------------------
// Pre-save hook: verify that the referenced Event document exists
// ---------------------------------------------------------------------------
BookingSchema.pre("save", async function () {
  const eventExists = await Event.exists({ _id: this.eventId });
  if (!eventExists) {
    throw new Error(
      `Cannot create booking: Event with ID "${this.eventId}" does not exist.`
    );
  }
});

// ---------------------------------------------------------------------------
// Export the model
// ---------------------------------------------------------------------------
export const Booking: Model<IBooking> = mongoose.model<IBooking>("Booking", BookingSchema);

export default Booking;