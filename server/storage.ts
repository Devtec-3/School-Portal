import { db } from "./db";
import { eq, and, desc, or } from "drizzle-orm";
import { 
  users, 
  registrationForms, 
  registrationApplications, 
  classes, 
  subjects, 
  timetables, 
  results, 
  notices, 
  payrollRecords, 
  feeStructures, 
  alumni, 
  featuredTeachers, 
  siteSettings,
  type User,
  type InsertUser,
  type RegistrationForm,
  type InsertRegistrationForm,
  type RegistrationApplication,
  type InsertRegistrationApplication,
  type Class,
  type InsertClass,
  type Subject,
  type InsertSubject,
  type Timetable,
  type InsertTimetable,
  type Result,
  type InsertResult,
  type Notice,
  type InsertNotice,
  type PayrollRecord,
  type InsertPayrollRecord,
  type FeeStructure,
  type InsertFeeStructure,
  type Alumni,
  type InsertAlumni,
  type FeaturedTeacher,
  type InsertFeaturedTeacher,
  type SiteSetting,
  type InsertSiteSetting
} from "@shared/schema";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUniqueId(uniqueId: string): Promise<User | undefined>;
  getUsers(): Promise<User[]>;
  getUsersByRole(role: string): Promise<User[]>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, data: Partial<InsertUser>): Promise<User | undefined>;
  
  getRegistrationForms(): Promise<RegistrationForm[]>;
  getRegistrationForm(id: string): Promise<RegistrationForm | undefined>;
  createRegistrationForm(form: InsertRegistrationForm): Promise<RegistrationForm>;
  updateRegistrationForm(id: string, data: Partial<InsertRegistrationForm>): Promise<RegistrationForm | undefined>;
  deleteRegistrationForm(id: string): Promise<void>;
  
  getRegistrationApplications(): Promise<RegistrationApplication[]>;
  getRegistrationApplication(id: string): Promise<RegistrationApplication | undefined>;
  createRegistrationApplication(app: InsertRegistrationApplication): Promise<RegistrationApplication>;
  updateRegistrationApplication(id: string, data: Partial<RegistrationApplication>): Promise<RegistrationApplication | undefined>;
  
  getClasses(): Promise<Class[]>;
  createClass(cls: InsertClass): Promise<Class>;
  
  getSubjects(teacherId?: string): Promise<Subject[]>;
  createSubject(subject: InsertSubject): Promise<Subject>;
  
  getTimetables(teacherId?: string): Promise<Timetable[]>;
  createTimetable(timetable: InsertTimetable): Promise<Timetable>;
  deleteTimetable(id: string): Promise<void>;
  
  getResults(studentId?: string): Promise<Result[]>;
  createResult(result: InsertResult): Promise<Result>;
  
  getNotices(): Promise<Notice[]>;
  createNotice(notice: InsertNotice): Promise<Notice>;
  deleteNotice(id: string): Promise<void>;
  
  getPayrollRecords(): Promise<PayrollRecord[]>;
  createPayrollRecord(record: InsertPayrollRecord): Promise<PayrollRecord>;
  
  getFeeStructures(classLevel?: string): Promise<FeeStructure[]>;
  createFeeStructure(fee: InsertFeeStructure): Promise<FeeStructure>;
  deleteFeeStructure(id: string): Promise<void>;
  
  getAlumni(): Promise<Alumni[]>;
  createAlumni(alum: InsertAlumni): Promise<Alumni>;
  updateAlumni(id: string, data: Partial<InsertAlumni>): Promise<Alumni | undefined>;
  deleteAlumni(id: string): Promise<void>;
  
  getFeaturedTeachers(): Promise<FeaturedTeacher[]>;
  createFeaturedTeacher(teacher: InsertFeaturedTeacher): Promise<FeaturedTeacher>;
  updateFeaturedTeacher(id: string, data: Partial<InsertFeaturedTeacher>): Promise<FeaturedTeacher | undefined>;
  deleteFeaturedTeacher(id: string): Promise<void>;
  
  getSiteSettings(): Promise<SiteSetting[]>;
  getSiteSetting(key: string): Promise<SiteSetting | undefined>;
  upsertSiteSetting(key: string, value: string): Promise<SiteSetting>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUniqueId(uniqueId: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.uniqueId, uniqueId));
    return user;
  }

  async getUsers(): Promise<User[]> {
    return db.select().from(users).orderBy(desc(users.createdAt));
  }

  async getUsersByRole(role: string): Promise<User[]> {
    return db.select().from(users).where(eq(users.role, role as any)).orderBy(desc(users.createdAt));
  }

  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }

  async updateUser(id: string, data: Partial<InsertUser>): Promise<User | undefined> {
    const [updatedUser] = await db.update(users).set(data).where(eq(users.id, id)).returning();
    return updatedUser;
  }

  async getRegistrationForms(): Promise<RegistrationForm[]> {
    return db.select().from(registrationForms).orderBy(desc(registrationForms.createdAt));
  }

  async getRegistrationForm(id: string): Promise<RegistrationForm | undefined> {
    const [form] = await db.select().from(registrationForms).where(eq(registrationForms.id, id));
    return form;
  }

  async createRegistrationForm(form: InsertRegistrationForm): Promise<RegistrationForm> {
    const [newForm] = await db.insert(registrationForms).values(form).returning();
    return newForm;
  }

  async updateRegistrationForm(id: string, data: Partial<InsertRegistrationForm>): Promise<RegistrationForm | undefined> {
    const [updatedForm] = await db.update(registrationForms).set(data).where(eq(registrationForms.id, id)).returning();
    return updatedForm;
  }

  async deleteRegistrationForm(id: string): Promise<void> {
    await db.delete(registrationForms).where(eq(registrationForms.id, id));
  }

  async getRegistrationApplications(): Promise<RegistrationApplication[]> {
    return db.select().from(registrationApplications).orderBy(desc(registrationApplications.createdAt));
  }

  async getRegistrationApplication(id: string): Promise<RegistrationApplication | undefined> {
    const [app] = await db.select().from(registrationApplications).where(eq(registrationApplications.id, id));
    return app;
  }

  async createRegistrationApplication(app: InsertRegistrationApplication): Promise<RegistrationApplication> {
    const [newApp] = await db.insert(registrationApplications).values(app).returning();
    return newApp;
  }

  async updateRegistrationApplication(id: string, data: Partial<RegistrationApplication>): Promise<RegistrationApplication | undefined> {
    const [updatedApp] = await db.update(registrationApplications).set(data).where(eq(registrationApplications.id, id)).returning();
    return updatedApp;
  }

  async getClasses(): Promise<Class[]> {
    return db.select().from(classes);
  }

  async createClass(cls: InsertClass): Promise<Class> {
    const [newClass] = await db.insert(classes).values(cls).returning();
    return newClass;
  }

  async getSubjects(teacherId?: string): Promise<Subject[]> {
    if (teacherId) {
      return db.select().from(subjects).where(eq(subjects.teacherId, teacherId));
    }
    return db.select().from(subjects);
  }

  async createSubject(subject: InsertSubject): Promise<Subject> {
    const [newSubject] = await db.insert(subjects).values(subject).returning();
    return newSubject;
  }

  async getTimetables(teacherId?: string): Promise<Timetable[]> {
    if (teacherId) {
      return db.select().from(timetables).where(eq(timetables.teacherId, teacherId));
    }
    return db.select().from(timetables);
  }

  async createTimetable(timetable: InsertTimetable): Promise<Timetable> {
    const [newTimetable] = await db.insert(timetables).values(timetable).returning();
    return newTimetable;
  }

  async deleteTimetable(id: string): Promise<void> {
    await db.delete(timetables).where(eq(timetables.id, id));
  }

  async getResults(studentId?: string): Promise<Result[]> {
    if (studentId) {
      return db.select().from(results).where(eq(results.studentId, studentId)).orderBy(desc(results.createdAt));
    }
    return db.select().from(results).orderBy(desc(results.createdAt));
  }

  async createResult(result: InsertResult): Promise<Result> {
    const [newResult] = await db.insert(results).values(result).returning();
    return newResult;
  }

  async getNotices(): Promise<Notice[]> {
    return db.select().from(notices).where(eq(notices.isPublished, true)).orderBy(desc(notices.createdAt));
  }

  async createNotice(notice: InsertNotice): Promise<Notice> {
    const [newNotice] = await db.insert(notices).values(notice).returning();
    return newNotice;
  }

  async deleteNotice(id: string): Promise<void> {
    await db.delete(notices).where(eq(notices.id, id));
  }

  async getPayrollRecords(): Promise<PayrollRecord[]> {
    return db.select().from(payrollRecords).orderBy(desc(payrollRecords.createdAt));
  }

  async createPayrollRecord(record: InsertPayrollRecord): Promise<PayrollRecord> {
    const [newRecord] = await db.insert(payrollRecords).values(record).returning();
    return newRecord;
  }

  async getFeeStructures(classLevel?: string): Promise<FeeStructure[]> {
    if (classLevel) {
      return db.select().from(feeStructures).where(eq(feeStructures.classLevel, classLevel));
    }
    return db.select().from(feeStructures);
  }

  async createFeeStructure(fee: InsertFeeStructure): Promise<FeeStructure> {
    const [newFee] = await db.insert(feeStructures).values(fee).returning();
    return newFee;
  }

  async deleteFeeStructure(id: string): Promise<void> {
    await db.delete(feeStructures).where(eq(feeStructures.id, id));
  }

  async getAlumni(): Promise<Alumni[]> {
    return db.select().from(alumni).where(eq(alumni.isVisible, true)).orderBy(desc(alumni.createdAt));
  }

  async createAlumni(alum: InsertAlumni): Promise<Alumni> {
    const [newAlum] = await db.insert(alumni).values(alum).returning();
    return newAlum;
  }

  async updateAlumni(id: string, data: Partial<InsertAlumni>): Promise<Alumni | undefined> {
    const [updatedAlum] = await db.update(alumni).set(data).where(eq(alumni.id, id)).returning();
    return updatedAlum;
  }

  async deleteAlumni(id: string): Promise<void> {
    await db.delete(alumni).where(eq(alumni.id, id));
  }

  async getFeaturedTeachers(): Promise<FeaturedTeacher[]> {
    return db.select().from(featuredTeachers).where(eq(featuredTeachers.isVisible, true)).orderBy(desc(featuredTeachers.createdAt));
  }

  async createFeaturedTeacher(teacher: InsertFeaturedTeacher): Promise<FeaturedTeacher> {
    const [newTeacher] = await db.insert(featuredTeachers).values(teacher).returning();
    return newTeacher;
  }

  async updateFeaturedTeacher(id: string, data: Partial<InsertFeaturedTeacher>): Promise<FeaturedTeacher | undefined> {
    const [updatedTeacher] = await db.update(featuredTeachers).set(data).where(eq(featuredTeachers.id, id)).returning();
    return updatedTeacher;
  }

  async deleteFeaturedTeacher(id: string): Promise<void> {
    await db.delete(featuredTeachers).where(eq(featuredTeachers.id, id));
  }

  async getSiteSettings(): Promise<SiteSetting[]> {
    return db.select().from(siteSettings);
  }

  async getSiteSetting(key: string): Promise<SiteSetting | undefined> {
    const [setting] = await db.select().from(siteSettings).where(eq(siteSettings.key, key));
    return setting;
  }

  async upsertSiteSetting(key: string, value: string): Promise<SiteSetting> {
    const existing = await this.getSiteSetting(key);
    if (existing) {
      const [updated] = await db.update(siteSettings)
        .set({ value, updatedAt: new Date() })
        .where(eq(siteSettings.key, key))
        .returning();
      return updated;
    }
    const [newSetting] = await db.insert(siteSettings).values({ key, value }).returning();
    return newSetting;
  }
}

export const storage = new DatabaseStorage();
