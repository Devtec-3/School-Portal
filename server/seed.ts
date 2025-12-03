import { db } from "./db";
import { users, siteSettings, feeStructures } from "@shared/schema";
import { eq } from "drizzle-orm";

async function seed() {
  console.log("Starting database seed...");

  const [existingAdmin] = await db.select().from(users).where(eq(users.uniqueId, "ADM24001"));
  
  if (!existingAdmin) {
    console.log("Creating default super admin user...");
    await db.insert(users).values({
      uniqueId: "ADM24001",
      surname: "Administrator",
      firstName: "Super",
      role: "super_admin",
      email: "admin@alfurqan.edu.ng",
      phone: "+2348012345678",
      isActive: true,
    });
    console.log("Super admin created: Username=ADM24001, Password=Administrator");
  } else {
    console.log("Super admin already exists");
  }

  const [existingStudent] = await db.select().from(users).where(eq(users.uniqueId, "STU24001"));
  
  if (!existingStudent) {
    console.log("Creating sample student user...");
    await db.insert(users).values({
      uniqueId: "STU24001",
      surname: "Student",
      firstName: "Test",
      role: "student",
      classLevel: "JSS1",
      isActive: true,
    });
    console.log("Sample student created: Username=STU24001, Password=Student");
  }

  const [existingStaff] = await db.select().from(users).where(eq(users.uniqueId, "STF24001"));
  
  if (!existingStaff) {
    console.log("Creating sample staff user...");
    await db.insert(users).values({
      uniqueId: "STF24001",
      surname: "Teacher",
      firstName: "Test",
      role: "staff",
      department: "Science",
      isActive: true,
    });
    console.log("Sample staff created: Username=STF24001, Password=Teacher");
  }

  const [existingManagement] = await db.select().from(users).where(eq(users.uniqueId, "MGT24001"));
  
  if (!existingManagement) {
    console.log("Creating sample management user...");
    await db.insert(users).values({
      uniqueId: "MGT24001",
      surname: "Manager",
      firstName: "Test",
      role: "management",
      isActive: true,
    });
    console.log("Sample management created: Username=MGT24001, Password=Manager");
  }

  const settings = [
    { key: "school_name", value: "Al-Furqan Group of Schools" },
    { key: "school_address", value: "Airforce Road, GbaGba, Ilorin, Kwara State, Nigeria" },
    { key: "school_phone", value: "+234 803 123 4567" },
    { key: "school_email", value: "info@alfurqan.edu.ng" },
    { key: "school_motto", value: "Knowledge, Virtue, Excellence" },
    { key: "results_released", value: "false" },
  ];

  for (const setting of settings) {
    const [existing] = await db.select().from(siteSettings).where(eq(siteSettings.key, setting.key));
    if (!existing) {
      await db.insert(siteSettings).values(setting);
      console.log(`Created setting: ${setting.key}`);
    }
  }

  console.log("\nSeed completed successfully!");
  console.log("\n--- Login Credentials ---");
  console.log("Super Admin: ADM24001 / Administrator");
  console.log("Management: MGT24001 / Manager");
  console.log("Staff: STF24001 / Teacher");
  console.log("Student: STU24001 / Student");
  console.log("-------------------------\n");
  
  process.exit(0);
}

seed().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
