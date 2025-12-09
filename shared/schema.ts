import { sql } from "drizzle-orm";
import {
  pgTable,
  text,
  varchar,
  integer,
  boolean,
  timestamp,
  pgEnum,
  jsonb,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const userRoleEnum = pgEnum("user_role", [
  "super_admin",
  "management",
  "staff",
  "student",
]);
export const registrationStatusEnum = pgEnum("registration_status", [
  "pending",
  "approved",
  "rejected",
]);
export const termEnum = pgEnum("term", ["first", "second", "third", "all"]);

export const users = pgTable("users", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  uniqueId: text("unique_id").notNull().unique(),
  surname: text("surname").notNull(),
  firstName: text("first_name").notNull(),
  middleName: text("middle_name"),
  role: userRoleEnum("role").notNull().default("student"),
  email: text("email"),
  phone: text("phone"),
  address: text("address"),
  profileImage: text("profile_image"),
  classLevel: text("class_level"),
  department: text("department"),
  bankAccountNumber: text("bank_account_number"),
  bankName: text("bank_name"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const registrationForms = pgTable("registration_forms", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  fileUrl: text("file_url").notNull(),
  formType: text("form_type").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  uploadedBy: varchar("uploaded_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const registrationApplications = pgTable("registration_applications", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  applicantName: text("applicant_name").notNull(),
  applicantEmail: text("applicant_email"),
  applicantPhone: text("applicant_phone").notNull(),
  applicationType: text("application_type").notNull(),
  uploadedDocumentUrl: text("uploaded_document_url").notNull(),
  status: registrationStatusEnum("status").notNull().default("pending"),
  reviewedBy: varchar("reviewed_by").references(() => users.id),
  reviewNotes: text("review_notes"),
  generatedUserId: varchar("generated_user_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  reviewedAt: timestamp("reviewed_at"),
});

export const classes = pgTable("classes", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  level: text("level").notNull(),
  department: text("department"),
  academicYear: text("academic_year").notNull(),
});

export const subjects = pgTable("subjects", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  code: text("code"),
  classId: varchar("class_id").references(() => classes.id),
  teacherId: varchar("teacher_id").references(() => users.id),
});

export const timetables = pgTable("timetables", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  subjectId: varchar("subject_id").references(() => subjects.id),
  teacherId: varchar("teacher_id").references(() => users.id),
  classId: varchar("class_id").references(() => classes.id),
  dayOfWeek: text("day_of_week").notNull(),
  startTime: text("start_time").notNull(),
  endTime: text("end_time").notNull(),
});

export const results = pgTable("results", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  studentId: varchar("student_id").references(() => users.id),
  subjectId: varchar("subject_id").references(() => subjects.id),
  classId: varchar("class_id").references(() => classes.id),
  academicYear: text("academic_year").notNull(),
  term: termEnum("term").notNull(),
  testScore: integer("test_score"),
  examScore: integer("exam_score"),
  totalScore: integer("total_score"),
  grade: text("grade"),
  remarks: text("remarks"),
  enteredBy: varchar("entered_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const notices = pgTable("notices", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  content: text("content").notNull(),
  targetAudience: text("target_audience").notNull(),
  priority: text("priority").default("normal"),
  isPublished: boolean("is_published").notNull().default(true),
  publishedBy: varchar("published_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  expiresAt: timestamp("expires_at"),
});

export const payrollRecords = pgTable("payroll_records", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  staffId: varchar("staff_id").references(() => users.id),
  amount: integer("amount").notNull(),
  month: text("month").notNull(),
  year: text("year").notNull(),
  status: text("status").notNull().default("pending"),
  processedBy: varchar("processed_by").references(() => users.id),
  processedAt: timestamp("processed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const feeStructures = pgTable("fee_structures", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  classLevel: text("class_level").notNull(),
  department: text("department"),
  amount: integer("amount").notNull(),
  description: text("description"),
  bankAccountNumber: text("bank_account_number").notNull(),
  bankName: text("bank_name").notNull(),
  academicYear: text("academic_year").notNull(),
  term: termEnum("term").notNull(),
});

export const alumni = pgTable("alumni", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  graduationYear: text("graduation_year").notNull(),
  profileImage: text("profile_image"),
  description: text("description"),
  achievement: text("achievement"),
  
  // ✅ CHANGE THIS LINE: used to be 'currentPosition'
  profession: text("profession"), 
  
  isVisible: boolean("is_visible").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
});


export const featuredTeachers = pgTable("featured_teachers", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  name: text("name").notNull(),

  // ✅ Added all missing columns here:
  position: text("position"),
  department: text("department"),
  specialization: text("specialization"), // This fixes the error you are seeing now

  subject: text("subject"),
  qualification: text("qualification"),
  profileImage: text("profile_image"),
  description: text("description"),
  yearsOfExperience: integer("years_of_experience"),
  isVisible: boolean("is_visible").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const siteSettings = pgTable("site_settings", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  key: text("key").notNull().unique(),
  value: text("value").notNull(),
  description: text("description"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  results: many(results),
  subjects: many(subjects),
  timetables: many(timetables),
  payrollRecords: many(payrollRecords),
  notices: many(notices),
}));

export const subjectsRelations = relations(subjects, ({ one, many }) => ({
  class: one(classes, { fields: [subjects.classId], references: [classes.id] }),
  teacher: one(users, { fields: [subjects.teacherId], references: [users.id] }),
  results: many(results),
  timetables: many(timetables),
}));

export const resultsRelations = relations(results, ({ one }) => ({
  student: one(users, { fields: [results.studentId], references: [users.id] }),
  subject: one(subjects, {
    fields: [results.subjectId],
    references: [subjects.id],
  }),
  class: one(classes, { fields: [results.classId], references: [classes.id] }),
}));

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});
export const insertRegistrationFormSchema = createInsertSchema(
  registrationForms
).omit({ id: true, createdAt: true });
export const insertRegistrationApplicationSchema = createInsertSchema(
  registrationApplications
).omit({ id: true, createdAt: true, reviewedAt: true });
export const insertClassSchema = createInsertSchema(classes).omit({ id: true });
export const insertSubjectSchema = createInsertSchema(subjects).omit({
  id: true,
});
export const insertTimetableSchema = createInsertSchema(timetables).omit({
  id: true,
});
export const insertResultSchema = createInsertSchema(results).omit({
  id: true,
  createdAt: true,
});
export const insertNoticeSchema = createInsertSchema(notices).omit({
  id: true,
  createdAt: true,
});
export const insertPayrollRecordSchema = createInsertSchema(
  payrollRecords
).omit({ id: true, createdAt: true, processedAt: true });
export const insertFeeStructureSchema = createInsertSchema(feeStructures).omit({
  id: true,
});
export const insertAlumniSchema = createInsertSchema(alumni).omit({
  id: true,
  createdAt: true,
});
export const insertFeaturedTeacherSchema = createInsertSchema(
  featuredTeachers
).omit({ id: true, createdAt: true });
export const insertSiteSettingSchema = createInsertSchema(siteSettings).omit({
  id: true,
  updatedAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertRegistrationForm = z.infer<
  typeof insertRegistrationFormSchema
>;
export type RegistrationForm = typeof registrationForms.$inferSelect;
export type InsertRegistrationApplication = z.infer<
  typeof insertRegistrationApplicationSchema
>;
export type RegistrationApplication =
  typeof registrationApplications.$inferSelect;
export type InsertClass = z.infer<typeof insertClassSchema>;
export type Class = typeof classes.$inferSelect;
export type InsertSubject = z.infer<typeof insertSubjectSchema>;
export type Subject = typeof subjects.$inferSelect;
export type InsertTimetable = z.infer<typeof insertTimetableSchema>;
export type Timetable = typeof timetables.$inferSelect;
export type InsertResult = z.infer<typeof insertResultSchema>;
export type Result = typeof results.$inferSelect;
export type InsertNotice = z.infer<typeof insertNoticeSchema>;
export type Notice = typeof notices.$inferSelect;
export type InsertPayrollRecord = z.infer<typeof insertPayrollRecordSchema>;
export type PayrollRecord = typeof payrollRecords.$inferSelect;
export type InsertFeeStructure = z.infer<typeof insertFeeStructureSchema>;
export type FeeStructure = typeof feeStructures.$inferSelect;
export type InsertAlumni = z.infer<typeof insertAlumniSchema>;
export type Alumni = typeof alumni.$inferSelect;
export type InsertFeaturedTeacher = z.infer<typeof insertFeaturedTeacherSchema>;
export type FeaturedTeacher = typeof featuredTeachers.$inferSelect;
export type InsertSiteSetting = z.infer<typeof insertSiteSettingSchema>;
export type SiteSetting = typeof siteSettings.$inferSelect;

export const loginSchema = z.object({
  uniqueId: z.string().min(1, "User ID is required"),
  password: z.string().min(1, "Password is required"),
});

export type LoginInput = z.infer<typeof loginSchema>;
