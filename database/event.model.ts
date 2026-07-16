import mongoose, { Schema, InferSchemaType, Model } from "mongoose";

/**
 * Event schema definition for storing event details.
 *
 * Features:
 * - Auto-generates a URL-friendly slug from the title via a pre-save hook.
 * - Normalizes `date` to ISO format and `time` to a consistent HH:MM AM/PM format.
 * - Validates required fields are present and non-empty.
 * - Enables automatic timestamps for createdAt and updatedAt.
 */

// ---------------------------------------------------------------------------
// Raw document type — mirrors the shape of a document stored in MongoDB.
// ---------------------------------------------------------------------------
const EventSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true },
    description: { type: String, required: true, trim: true },
    overview: { type: String, required: true, trim: true },
    image: { type: String, required: true, trim: true },
    venue: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    date: { type: String, required: true, trim: true },
    time: { type: String, required: true, trim: true },
    mode: {
      type: String,
      required: true,
      enum: ["online", "offline", "hybrid"],
      lowercase: true,
      trim: true,
    },
    audience: { type: String, required: true, trim: true },
    agenda: {
      type: [String],
      required: true,
      validate: [
        (arr: string[]) => arr.length > 0,
        "Agenda must contain at least one item",
      ],
    },
    organizer: { type: String, required: true, trim: true },
    tags: {
      type: [String],
      required: true,
      validate: [
        (arr: string[]) => arr.length > 0,
        "Tags must contain at least one item",
      ],
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  },
);

// Infer the TypeScript type from the schema definition.
export type IEvent = InferSchemaType<typeof EventSchema>;

// ---------------------------------------------------------------------------
// Pre-save hook: slug generation & date/time normalization
// ---------------------------------------------------------------------------
EventSchema.pre("save", function () {
  // --- Slug generation ---
  // Only regenerate the slug if the title field has been modified.
  if (this.isModified("title") || !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/-+/g, "-") // Collapse consecutive hyphens
      .replace(/^-|-$/g, ""); // Strip leading / trailing hyphens
  }

  // --- Date normalization ---
  // Attempt to parse the date string into a valid Date object.
  // If parsing succeeds, store the ISO date string (YYYY-MM-DD).
  if (this.isModified("date")) {
    const parsedDate = new Date(this.date);
    if (!isNaN(parsedDate.getTime())) {
      this.date = parsedDate.toISOString().split("T")[0];
    }
    // If parsing fails, leave the original value so the user can correct it.
  }

  // --- Time consistency ---
  // Normalise time strings to a consistent HH:MM AM/PM format.
  if (this.isModified("time")) {
    const timeStr = this.time.trim();
    // Try to parse as a 12-hour or 24-hour time string.
    const timePattern12 = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i;
    const timePattern24 = /^(\d{1,2}):(\d{2})$/;

    let hours: number;
    let minutes: string;
    let period: string;

    const match12 = timeStr.match(timePattern12);
    const match24 = timeStr.match(timePattern24);

    if (match12) {
      hours = parseInt(match12[1], 10);
      minutes = match12[2];
      period = match12[3].toUpperCase();
    } else if (match24) {
      hours = parseInt(match24[1], 10);
      minutes = match24[2];
      period = hours >= 12 ? "PM" : "AM";
      // Convert 24-hour to 12-hour
      if (hours === 0) hours = 12;
      else if (hours > 12) hours -= 12;
    } else {
      throw new Error(
        `Invalid time format: "${this.time}". Expected HH:MM AM/PM or HH:MM.`,
      );
    }

    this.time = `${hours.toString().padStart(2, "0")}:${minutes} ${period}`;
  }
});

// --- Indexes ---
// Unique index on slug for efficient lookups.
EventSchema.index({ slug: 1 }, { unique: true });

// ---------------------------------------------------------------------------
// Export the model
// ---------------------------------------------------------------------------
export const Event: Model<IEvent> = mongoose.model<IEvent>(
  "Event",
  EventSchema,
);

export default Event;
