import { relations } from "drizzle-orm";
import { dormitories, campuses } from "./schema";

// Định nghĩa relations cho dormitories
export const dormitoriesRelations = relations(dormitories, ({ one }) => ({
  campus: one(campuses, {
    fields: [dormitories.campus_id],
    references: [campuses.id],
  }),
}));

// Định nghĩa relations cho campuses
export const campusesRelations = relations(campuses, ({ many }) => ({
  dormitories: many(dormitories),
}));
