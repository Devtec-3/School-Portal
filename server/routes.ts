import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import session from "express-session";
import { storage } from "./storage";
import { loginSchema } from "@shared/schema";
import { z } from "zod";
import multer from "multer";
import path from "path";
import fs from "fs";
import { sendLoginDetails } from "./email";

declare module "express-session" {
  interface SessionData {
    userId: string;
  }
}

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = path.join(process.cwd(), "uploads");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + "-" + file.originalname);
    },
  }),
  limits: { fileSize: 10 * 1024 * 1024 },
});

function generateUniqueId(role: string): string {
  const prefix =
    role === "staff"
      ? "STF"
      : role === "student"
      ? "STU"
      : role === "management"
      ? "MGT"
      : "ADM";
  const year = new Date().getFullYear().toString().slice(-2);
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  return `${prefix}${year}${random}`;
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "al-furqan-secret-key-2024",
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
      },
    })
  );

  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const { uniqueId, password } = loginSchema.parse(req.body);

      const user = await storage.getUserByUniqueId(uniqueId);

      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      if (password.toLowerCase() !== user.surname.toLowerCase()) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      if (!user.isActive) {
        return res.status(403).json({ message: "Account is inactive" });
      }

      req.session.userId = user.id;
      res.json({ user, message: "Login successful" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res
          .status(400)
          .json({ message: "Invalid input", errors: error.errors });
      }
      console.error("Login error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.get("/api/auth/me", async (req: Request, res: Response) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const user = await storage.getUser(req.session.userId);
    if (!user) {
      req.session.destroy(() => {});
      return res.status(401).json({ message: "User not found" });
    }

    res.json({ user });
  });

  app.post("/api/auth/logout", (req: Request, res: Response) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/users", async (req: Request, res: Response) => {
    try {
      const users = await storage.getUsers();
      res.json(users);
    } catch (error) {
      console.error("Get users error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.get("/api/users/staff", async (req: Request, res: Response) => {
    try {
      const staff = await storage.getUsersByRole("staff");
      res.json(staff);
    } catch (error) {
      console.error("Get staff error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.get("/api/users/students", async (req: Request, res: Response) => {
    try {
      const students = await storage.getUsersByRole("student");
      res.json(students);
    } catch (error) {
      console.error("Get students error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.patch(
    "/api/users/:id/bank-details",
    async (req: Request, res: Response) => {
      try {
        const { id } = req.params;
        const { bankAccountNumber, bankName } = req.body;

        const user = await storage.updateUser(id, {
          bankAccountNumber,
          bankName,
        });
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        res.json(user);
      } catch (error) {
        console.error("Update bank details error:", error);
        res.status(500).json({ message: "Server error" });
      }
    }
  );

  app.get("/api/registration-forms", async (req: Request, res: Response) => {
    try {
      const forms = await storage.getRegistrationForms();
      res.json(forms);
    } catch (error) {
      console.error("Get forms error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.post(
    "/api/registration-forms",
    upload.single("file"),
    async (req: Request, res: Response) => {
      try {
        const { title, description, formType } = req.body;
        const file = req.file;

        if (!file) {
          return res.status(400).json({ message: "File is required" });
        }

        const form = await storage.createRegistrationForm({
          title,
          description,
          formType,
          fileUrl: `/uploads/${file.filename}`,
          uploadedBy: req.session.userId || null,
        });

        res.json(form);
      } catch (error) {
        console.error("Create form error:", error);
        res.status(500).json({ message: "Server error" });
      }
    }
  );

  app.patch(
    "/api/registration-forms/:id",
    async (req: Request, res: Response) => {
      try {
        const { id } = req.params;
        const form = await storage.updateRegistrationForm(id, req.body);
        if (!form) {
          return res.status(404).json({ message: "Form not found" });
        }
        res.json(form);
      } catch (error) {
        console.error("Update form error:", error);
        res.status(500).json({ message: "Server error" });
      }
    }
  );

  app.delete(
    "/api/registration-forms/:id",
    async (req: Request, res: Response) => {
      try {
        await storage.deleteRegistrationForm(req.params.id);
        res.json({ message: "Form deleted" });
      } catch (error) {
        console.error("Delete form error:", error);
        res.status(500).json({ message: "Server error" });
      }
    }
  );

  app.get(
    "/api/registration-applications",
    async (req: Request, res: Response) => {
      try {
        const applications = await storage.getRegistrationApplications();
        res.json(applications);
      } catch (error) {
        console.error("Get applications error:", error);
        res.status(500).json({ message: "Server error" });
      }
    }
  );

  app.post(
    "/api/registration-applications",
    upload.single("document"),
    async (req: Request, res: Response) => {
      try {
        const {
          applicantName,
          applicantEmail,
          applicantPhone,
          applicationType,
        } = req.body;
        const file = req.file;

        if (!file) {
          return res.status(400).json({ message: "Document is required" });
        }

        const application = await storage.createRegistrationApplication({
          applicantName,
          applicantEmail,
          applicantPhone,
          applicationType,
          uploadedDocumentUrl: `/uploads/${file.filename}`,
        });

        res.json(application);
      } catch (error) {
        console.error("Create application error:", error);
        res.status(500).json({ message: "Server error" });
      }
    }
  );

  app.post(
    "/api/registration-applications/:id/approve",
    async (req: Request, res: Response) => {
      try {
        const { id } = req.params;
        const { reviewNotes } = req.body;

        const application = await storage.getRegistrationApplication(id);
        if (!application) {
          return res.status(404).json({ message: "Application not found" });
        }

        const nameParts = application.applicantName.split(" ");
        const role =
          application.applicationType === "staff_application"
            ? "staff"
            : "student";
        const uniqueId = generateUniqueId(role);

        const newUser = await storage.createUser({
          uniqueId,
          surname: nameParts[nameParts.length - 1],
          firstName: nameParts[0],
          middleName:
            nameParts.length > 2 ? nameParts.slice(1, -1).join(" ") : null,
          role,
          email: application.applicantEmail,
          phone: application.applicantPhone,
        });

        // ==========================================
        // ✅ NEW CODE: SEND LOGIN DETAILS VIA EMAIL
        // ==========================================
        if (application.applicantEmail) {
          console.log(
            `Sending login details to ${application.applicantEmail}...`
          );
          await sendLoginDetails(
            application.applicantEmail, // To
            application.applicantName, // Name
            uniqueId, // User ID
            newUser.surname // Password (Surname)
          );
        }
        // ==========================================

        await storage.updateRegistrationApplication(id, {
          status: "approved",
          reviewedBy: req.session.userId,
          reviewNotes,
          generatedUserId: newUser.id,
          reviewedAt: new Date(),
        });

        res.json({
          message: "Application approved",
          user: newUser,
          credentials: {
            username: uniqueId,
            password: newUser.surname,
          },
        });
      } catch (error) {
        console.error("Approve application error:", error);
        res.status(500).json({ message: "Server error" });
      }
    }
  );
  app.get("/api/notices", async (req: Request, res: Response) => {
    try {
      const notices = await storage.getNotices();
      res.json(notices);
    } catch (error) {
      console.error("Get notices error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.post("/api/notices", async (req: Request, res: Response) => {
    try {
      const notice = await storage.createNotice({
        ...req.body,
        publishedBy: req.session.userId || null,
      });
      res.json(notice);
    } catch (error) {
      console.error("Create notice error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.delete("/api/notices/:id", async (req: Request, res: Response) => {
    try {
      await storage.deleteNotice(req.params.id);
      res.json({ message: "Notice deleted" });
    } catch (error) {
      console.error("Delete notice error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.get("/api/results", async (req: Request, res: Response) => {
    try {
      const { studentId } = req.query;
      const results = await storage.getResults(studentId as string | undefined);
      res.json(results);
    } catch (error) {
      console.error("Get results error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.post("/api/results", async (req: Request, res: Response) => {
    try {
      const result = await storage.createResult(req.body);
      res.json(result);
    } catch (error) {
      console.error("Create result error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.get("/api/timetable", async (req: Request, res: Response) => {
    try {
      const { teacherId } = req.query;
      const timetables = await storage.getTimetables(
        teacherId as string | undefined
      );
      res.json(timetables);
    } catch (error) {
      console.error("Get timetable error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.post("/api/timetable", async (req: Request, res: Response) => {
    try {
      const timetable = await storage.createTimetable(req.body);
      res.json(timetable);
    } catch (error) {
      console.error("Create timetable error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.delete("/api/timetable/:id", async (req: Request, res: Response) => {
    try {
      await storage.deleteTimetable(req.params.id);
      res.json({ message: "Timetable entry deleted" });
    } catch (error) {
      console.error("Delete timetable error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.get("/api/subjects", async (req: Request, res: Response) => {
    try {
      const { teacherId } = req.query;
      const subjects = await storage.getSubjects(
        teacherId as string | undefined
      );
      res.json(subjects);
    } catch (error) {
      console.error("Get subjects error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.post("/api/subjects", async (req: Request, res: Response) => {
    try {
      const subject = await storage.createSubject(req.body);
      res.json(subject);
    } catch (error) {
      console.error("Create subject error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.get("/api/payroll", async (req: Request, res: Response) => {
    try {
      const records = await storage.getPayrollRecords();
      res.json(records);
    } catch (error) {
      console.error("Get payroll error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.post("/api/payroll/process", async (req: Request, res: Response) => {
    try {
      const { staffId, amount = 0 } = req.body;
      const now = new Date();

      const record = await storage.createPayrollRecord({
        staffId,
        amount,
        month: now.toLocaleString("default", { month: "long" }),
        year: now.getFullYear().toString(),
        status: "completed",
        processedBy: req.session.userId || null,
      });

      res.json(record);
    } catch (error) {
      console.error("Process payroll error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.get("/api/fee-structures", async (req: Request, res: Response) => {
    try {
      const { classLevel } = req.query;
      const fees = await storage.getFeeStructures(
        classLevel as string | undefined
      );
      res.json(fees);
    } catch (error) {
      console.error("Get fee structures error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.post("/api/fee-structures", async (req: Request, res: Response) => {
    try {
      const fee = await storage.createFeeStructure(req.body);
      res.json(fee);
    } catch (error) {
      console.error("Create fee structure error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.delete("/api/fee-structures/:id", async (req: Request, res: Response) => {
    try {
      await storage.deleteFeeStructure(req.params.id);
      res.json({ message: "Fee structure deleted" });
    } catch (error) {
      console.error("Delete fee structure error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.get("/api/alumni", async (req: Request, res: Response) => {
    try {
      const alumni = await storage.getAlumni();
      res.json(alumni);
    } catch (error) {
      console.error("Get alumni error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.post("/api/alumni", async (req: Request, res: Response) => {
    try {
      const alum = await storage.createAlumni(req.body);
      res.json(alum);
    } catch (error) {
      console.error("Create alumni error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.delete("/api/alumni/:id", async (req: Request, res: Response) => {
    try {
      await storage.deleteAlumni(req.params.id);
      res.json({ message: "Alumni deleted" });
    } catch (error) {
      console.error("Delete alumni error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.get("/api/featured-teachers", async (req: Request, res: Response) => {
    try {
      const teachers = await storage.getFeaturedTeachers();
      res.json(teachers);
    } catch (error) {
      console.error("Get featured teachers error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.post("/api/featured-teachers", async (req: Request, res: Response) => {
    try {
      const teacher = await storage.createFeaturedTeacher(req.body);
      res.json(teacher);
    } catch (error) {
      console.error("Create featured teacher error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.delete(
    "/api/featured-teachers/:id",
    async (req: Request, res: Response) => {
      try {
        await storage.deleteFeaturedTeacher(req.params.id);
        res.json({ message: "Featured teacher deleted" });
      } catch (error) {
        console.error("Delete featured teacher error:", error);
        res.status(500).json({ message: "Server error" });
      }
    }
  );

  app.get("/api/settings", async (req: Request, res: Response) => {
    try {
      const settings = await storage.getSiteSettings();
      res.json(settings);
    } catch (error) {
      console.error("Get settings error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.post("/api/settings", async (req: Request, res: Response) => {
    try {
      const { settings } = req.body;
      const updated = [];

      for (const { key, value } of settings) {
        const setting = await storage.upsertSiteSetting(key, value);
        updated.push(setting);
      }

      res.json(updated);
    } catch (error) {
      console.error("Update settings error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.use("/uploads", (req, res, next) => {
    const filePath = path.join(process.cwd(), "uploads", req.path);
    if (fs.existsSync(filePath)) {
      res.sendFile(filePath);
    } else {
      res.status(404).json({ message: "File not found" });
    }
  });

  return httpServer;
}
