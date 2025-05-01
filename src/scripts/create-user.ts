#!/usr/bin/env bun
/**
 * CLI để tạo sample user
 * 
 * Sử dụng: bun run src/scripts/create-user.ts
 * Hoặc: chmod +x src/scripts/create-user.ts && ./src/scripts/create-user.ts
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
  // Hash mật khẩu
  const password_hash = await hashPassword(userData.password);

  // Tạo user mới
  const [newUser] = await db.insert(internalUsers).values({
    username: userData.username,
    password_hash,
    email: userData.email,
    role: userData.role,
    is_active: userData.is_active ?? true
  }).returning();

  return newUser;
}

/**
 * Hàm chính để tạo user
 */
async function main() {
  try {
    // Kết nối database
    await initDb();
    logger.info("Đã kết nối với database");

    // Lấy thông tin từ command line arguments
    const args = process.argv.slice(2);
    
    // Nếu không có đủ tham số, hiển thị hướng dẫn sử dụng
    if (args.length < 4) {
      console.log("Sử dụng: bun run src/scripts/create-user.ts <username> <email> <password> <role>");
      console.log("Trong đó:");
      console.log("  - username: Tên đăng nhập (ví dụ: admin)");
      console.log("  - email: Địa chỉ email (ví dụ: admin@example.com)");
      console.log("  - password: Mật khẩu (ví dụ: password123)");
      console.log(`  - role: Vai trò (${INTERNAL_USER_ROLES.join(" hoặc ")})`);
      console.log("\nVí dụ: bun run src/scripts/create-user.ts admin admin@example.com password123 admin");
      process.exit(1);
    }

    const [username, email, password, role] = args;

    // Kiểm tra role có hợp lệ không
    if (!INTERNAL_USER_ROLES.includes(role as InternalUserRole)) {
      logger.error(`Role không hợp lệ. Phải là một trong: ${INTERNAL_USER_ROLES.join(", ")}`);
      process.exit(1);
    }

    // Kiểm tra user đã tồn tại chưa
    const userExists = await checkUserExists(username, email);
    if (userExists) {
      logger.error("Username hoặc email đã tồn tại");
      process.exit(1);
    }

    // Tạo user mới
    const newUser = await createUser({
      username,
      email,
      password,
      role: role as InternalUserRole
    });

    logger.info(`Đã tạo user mới: ${newUser.username} (${newUser.role})`);
    logger.info(`ID: ${newUser.id}`);
    logger.info(`Email: ${newUser.email}`);
    logger.info(`Trạng thái: ${newUser.is_active ? "Đang hoạt động" : "Bị vô hiệu hóa"}`);
    logger.info(`Thời gian tạo: ${newUser.created_at}`);

  } catch (error) {
    logger.error("Lỗi khi tạo user:", error);
    process.exit(1);
  } finally {
    // Đóng kết nối database
    await closeDb();
  }
}

// Chạy hàm chính
main();
