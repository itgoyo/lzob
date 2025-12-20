# 快速启动指南

## 1. 安装依赖

```bash
npm install
```

## 2. 配置环境变量

```bash
# 复制环境变量模板
cp .env.example .env
```

编辑 `.env` 文件，修改以下配置：

```env
# 修改为你的 MySQL 数据库连接信息
DATABASE_URL="mysql://用户名:密码@localhost:3306/luzhi_admin"

# 应用访问地址（开发环境通常不需要改）
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# 管理员登录账号（请务必修改）
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="admin123"

# JWT密钥（生产环境请修改为复杂的随机字符串）
JWT_SECRET="your-jwt-secret-change-this-in-production"

# 定时任务密钥（生产环境请修改为复杂的随机字符串）
CRON_SECRET="your-cron-secret-change-this-in-production"
```

**重要**：首次运行前请务必修改 `ADMIN_USERNAME` 和 `ADMIN_PASSWORD`，这是登录管理系统的账号密码。

## 3. 创建数据库

打开 MySQL 命令行或使用可视化工具创建数据库：

```sql
CREATE DATABASE luzhi_admin CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

## 4. 初始化数据库表

```bash
npm run db:push
```

## 5. 启动开发服务器

```bash
npm run dev
```

打开浏览器访问：[http://localhost:3000](http://localhost:3000)

## 6. 配置 Server酱（可选）

如需启用到期通知功能：

1. 访问 [Server酱官网](https://sct.ftqq.com/) 注册并获取 SendKey
2. 在系统的"设置"页面添加 Server酱 配置
3. 配置定时任务（见 README.md）

## 常见问题

### Q: 数据库连接失败？
A: 检查 MySQL 服务是否启动，以及 `.env` 中的数据库连接信息是否正确。

### Q: 端口 3000 被占用？
A: 使用 `PORT=3001 npm run dev` 指定其他端口。

### Q: Prisma 生成客户端失败？
A: 运行 `npx prisma generate` 手动生成。

## 下一步

- 查看 [README.md](./README.md) 了解完整功能和使用说明
- 添加第一个主播开始使用系统
- 配置收益统计查看月度报表
- 设置 Server酱 接收到期通知

祝使用愉快！

