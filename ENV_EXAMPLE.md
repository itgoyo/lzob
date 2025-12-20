# 环境变量配置说明

请在项目根目录创建 `.env` 文件，并按照以下模板配置：

```env
# ============================================
# 数据库配置
# ============================================
DATABASE_URL="mysql://username:password@localhost:3306/luzhi_admin"
# 说明：
# - username: 你的 MySQL 用户名
# - password: 你的 MySQL 密码
# - localhost: 数据库服务器地址（本地开发用 localhost）
# - 3306: MySQL 默认端口
# - luzhi_admin: 数据库名称

# ============================================
# 应用配置
# ============================================
NEXT_PUBLIC_APP_URL="http://localhost:3000"
# 说明：应用访问地址
# - 开发环境：http://localhost:3000
# - 生产环境：https://your-domain.com

# ============================================
# 身份认证配置（⚠️ 必须修改）
# ============================================
ADMIN_USERNAME="admin"
# 说明：管理员登录用户名
# ⚠️ 生产环境请务必修改默认值！

ADMIN_PASSWORD="admin123"
# 说明：管理员登录密码
# ⚠️ 生产环境请务必修改为强密码！
# 建议：至少12位，包含大小写字母、数字和特殊字符

JWT_SECRET="your-jwt-secret-change-this-in-production"
# 说明：JWT Token 加密密钥
# ⚠️ 生产环境请务必修改为复杂的随机字符串！
# 建议：使用至少32位的随机字符串
# 可以使用以下命令生成：
# node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# ============================================
# 定时任务配置
# ============================================
CRON_SECRET="your-cron-secret-change-this-in-production"
# 说明：定时任务 API 的访问密钥
# ⚠️ 生产环境请务必修改为复杂的随机字符串！
# 用于保护 /api/cron/* 接口，防止未授权访问
```

## 快速开始

### 1. 复制环境变量模板

```bash
# 如果存在 .env.example 文件
cp .env.example .env

# 或手动创建
touch .env
```

### 2. 编辑 .env 文件

```bash
# 使用你喜欢的编辑器
nano .env
# 或
vim .env
# 或
code .env
```

### 3. 必须修改的配置项

在正式使用前，**务必修改**以下配置：

- ✅ `DATABASE_URL` - 改为你的数据库信息
- ✅ `ADMIN_USERNAME` - 改为你的管理员用户名
- ✅ `ADMIN_PASSWORD` - 改为强密码
- ✅ `JWT_SECRET` - 改为复杂的随机字符串
- ✅ `CRON_SECRET` - 改为复杂的随机字符串

## 生成随机密钥

使用以下方法生成安全的随机密钥：

### 方法一：使用 Node.js

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 方法二：使用 OpenSSL

```bash
openssl rand -hex 32
```

### 方法三：在线生成

访问 [https://www.random.org/strings/](https://www.random.org/strings/) 生成随机字符串

## 常见配置示例

### 本地开发环境

```env
DATABASE_URL="mysql://root:123456@localhost:3306/luzhi_admin"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="admin123"
JWT_SECRET="dev-secret-key-not-for-production"
CRON_SECRET="dev-cron-secret-key"
```

### 生产环境（示例）

```env
DATABASE_URL="mysql://luzhi_user:strong_password_here@db.example.com:3306/luzhi_admin"
NEXT_PUBLIC_APP_URL="https://luzhi.example.com"
ADMIN_USERNAME="superadmin"
ADMIN_PASSWORD="Str0ng!P@ssw0rd#2025"
JWT_SECRET="a1b2c3d4e5f67890abcdef1234567890abcdef1234567890abcdef1234567890"
CRON_SECRET="9876543210fedcba0987654321fedcba0987654321fedcba0987654321fedcba"
```

## 安全最佳实践

1. **永远不要提交 .env 文件到版本控制**
   - 已在 `.gitignore` 中配置忽略
   - 定期检查确保没有误提交

2. **使用强密码**
   - 至少12位字符
   - 包含大小写字母、数字和特殊字符
   - 不使用常见单词或个人信息

3. **定期更换密钥**
   - 建议每3-6个月更换一次
   - 泄露后立即更换

4. **限制数据库用户权限**
   - 只授予必要的权限
   - 不使用 root 账户

5. **HTTPS**
   - 生产环境必须使用 HTTPS
   - 配置 SSL 证书

6. **备份环境变量**
   - 使用密码管理器保存
   - 加密存储在安全位置

## 故障排除

### .env 文件不生效

1. 确认文件名是 `.env` 而不是 `env.txt` 或其他
2. 确认文件在项目根目录
3. 重启开发服务器

### 无法连接数据库

1. 检查 `DATABASE_URL` 格式是否正确
2. 确认数据库服务正在运行
3. 验证用户名和密码是否正确
4. 检查数据库是否已创建

### 登录后立即退出

1. 检查 `JWT_SECRET` 是否已配置
2. 清除浏览器 Cookie
3. 重启服务器

