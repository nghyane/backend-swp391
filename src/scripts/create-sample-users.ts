#!/usr/bin/env bun
/**
 * CLI để tạo nhiều sample user
 * 
 * Sử dụng: bun run src/scripts/create-sample-users.ts
 * Hoặc: chmod +x src/scripts/create-sample-users.ts && ./src/scripts/create-sample-users.ts
 */

import { db } from "../db";
import { internalUsers, INTERNAL_USER_ROLES, InternalUserRole } from "../db/schema";
import * as argon2 from "argon2";
import { eq } from "drizzle-orm";
import { closeDb, initDb } from "../db";
import logger from "../utils/pino-logger";

// Cấu hình argon2
const argon2Options = {
  type: argon2.argon2id,
  memoryCost: 2 ** 16, // 64 MiB
  timeCost: 3,
  parallelism: 1
};

/**
 * Tạo mật khẩu hash với argon2
 * @param password Mật khẩu gốc
 * @returns Mật khẩu đã hash
 */
async function hashPassword(password: string): Promise<string> {
  return await argon2.hash(password, argon2Options);
}

/**
 * Kiểm tra xem username hoặc email đã tồn tại chưa
 * @param username Username cần kiểm tra
 * @param email Email cần kiểm tra
 * @returns true nếu đã tồn tại, false nếu chưa
 */
async function checkUserExists(username: string, email: string): Promise<boolean> {
  const existingUser = await db.query.internalUsers.findFirst({
    where: (users) => {
      return eq(users.username, username) || eq(users.email, email);
    }
  });

  return !!existingUser;
}

/**
 * Tạo user mới
 * @param userData Thông tin user cần tạo
 * @returns User đã tạo
 */
async function createUser(userData: {
  username: string;
  password: string;
  email: string;
  role: InternalUserRole;
  is_active?: boolean;
}) {
  try {
    // Hash mật khẩu
    const password_hash = await hashPassword(userData.password);

    // Kiểm tra user đã tồn tại chưa
    const userExists = await checkUserExists(userData.username, userData.email);
    if (userExists) {
      logger.warn(`User ${userData.username} hoặc email ${userData.email} đã tồn tại, bỏ qua`);
      return null;
    }

    // Tạo user mới
    const [newUser] = await db.insert(internalUsers).values({
      username: userData.username,
      password_hash,
      email: userData.email,
      role: userData.role,
      is_active: userData.is_active ?? true
    }).returning();

    logger.info(`Đã tạo user mới: ${newUser.username} (${newUser.role})`);
    return newUser;
  } catch (error) {
    logger.error(`Lỗi khi tạo user ${userData.username}:`, error);
    return null;
  }
}

// Danh sách sample users
const sampleUsers = [
  {
    username: "admin",
    password: "admin123",
    email: "admin@example.com",
    role: "admin" as InternalUserRole
  },
  {
    username: "staff1",
    password: "staff123",
    email: "staff1@example.com",
    role: "staff" as InternalUserRole
  },
  {
    username: "staff2",
    password: "staff123",
    email: "staff2@example.com",
    role: "staff" as InternalUserRole
  },
  {
    username: "manager",
    password: "manager123",
    email: "manager@example.com",
    role: "admin" as InternalUserRole
  }
];

/**
 * Hàm chính để tạo sample users
 */
async function main() {
  try {
    // Kết nối database
    await initDb();
    logger.info("Đã kết nối với database");

    // Tạo các sample users
    logger.info("Bắt đầu tạo sample users...");
    
    const createdUsers = [];
    for (const userData of sampleUsers) {
      const user = await createUser(userData);
      if (user) {
        createdUsers.push(user);
      }
    }

    logger.info(`Đã tạo ${createdUsers.length}/${sampleUsers.length} sample users`);
    
    // Hiển thị thông tin các user đã tạo
    if (createdUsers.length > 0) {
      logger.info("Danh sách users đã tạo:");
      createdUsers.forEach(user => {
        logger.info(`- ${user.username} (${user.role}): ${user.email}`);
      });
    }

  } catch (error) {
    logger.error("Lỗi khi tạo sample users:", error);
    process.exit(1);
  } finally {
    // Đóng kết nối database
    await closeDb();
  }
}

// Chạy hàm chính
main();
