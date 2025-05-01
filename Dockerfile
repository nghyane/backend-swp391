# Sử dụng hình ảnh Bun chính thức
# Xem tất cả các phiên bản tại https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:1 AS base
WORKDIR /usr/src/app

# Cài đặt các công cụ build cần thiết cho argon2
FROM base AS build-tools
RUN apt-get update && apt-get install -y python3 make g++

# Cài đặt dependencies vào thư mục tạm thời
# Điều này sẽ cache chúng và tăng tốc các bản build trong tương lai
FROM build-tools AS install
RUN mkdir -p /temp/dev
COPY package.json bun.lock /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

# Cài đặt với --production (loại trừ devDependencies)
RUN mkdir -p /temp/prod
COPY package.json bun.lock /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production

# Sao chép node_modules từ thư mục tạm thời
# sau đó sao chép tất cả các file dự án (không bị ignore) vào image
FROM base AS prerelease
COPY --from=install /temp/dev/node_modules node_modules
COPY . .

# [tùy chọn] test & build
ENV NODE_ENV=production
# RUN bun test
RUN bun run build

# Sao chép production dependencies và source code vào image cuối cùng
FROM base AS release
COPY --from=install /temp/prod/node_modules node_modules
COPY --from=prerelease /usr/src/app/dist ./dist
COPY --from=prerelease /usr/src/app/package.json ./

# Chạy ứng dụng
USER bun
ENV NODE_ENV=production
# Railway sẽ tự động cung cấp biến PORT
EXPOSE 8080/tcp
CMD ["bun", "--smol", "dist/server.js"]
