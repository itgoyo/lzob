# 直播录制管理系统

一个基于 Next.js + Prisma + MySQL 的直播录制管理系统，用于管理主播信息、跟踪到期时间、统计收益，并通过 Server酱 发送到期通知。

## 功能特性

- **🔐 登录认证系统**
  - JWT 身份验证保护系统安全
  - 环境变量配置管理员账号
  - 7天自动登录有效期
  - 所有API和页面统一鉴权

- **主播信息管理**
  - 完整的 CRUD 操作（创建、读取、更新、删除）
  - 支持多个直播平台（抖音、斗鱼、虎牙、B站、其他）
  - 平台图标展示
  - 自定义开始时间和到期时间
  - 响应式网格布局（3列/2列/1列）

- **可视化进度跟踪**
  - 直观的进度条显示到期进度（0-100%）
  - 颜色编码：绿色（<70%）、黄色（70-90%）、红色（>90%）
  - 显示剩余天数
  - 实时到期状态检测

- **状态分类**
  - 未到期主播列表
  - 已到期主播列表
  - 支持按到期时间排序（正序/倒序）
  - 前端自动判断实际到期状态

- **⚠️ 站内提醒系统**
  - 到期主播醒目提醒横幅
  - 支持单独/批量关闭提醒
  - 提醒状态智能持久化
  - 快速跳转到期主播详情

- **收益统计**
  - 当月收益总览
  - 历史月份收益查询
  - 与上月数据对比
  - 百分比增长分析

- **自动通知系统**
  - 📱 Server酱微信推送（支持多个配置）
  - 📧 邮箱通知（支持多个邮箱）
  - 主播到期后每2小时自动推送
  - 精美的HTML邮件模板
  - 通知包含完整主播信息

## 技术栈

- **前端**：Next.js 14 (App Router), React 18, TypeScript
- **样式**：Tailwind CSS
- **数据库**：MySQL 8.0+
- **ORM**：Prisma
- **图标**：Lucide React
- **图表**：Recharts
- **日期处理**：date-fns

## 安装步骤

### 1. 克隆项目并安装依赖

```bash
cd luzhi
npm install
```

### 2. 配置环境变量

创建 `.env` 文件：

```bash
cp .env.example .env
```

编辑 `.env` 文件，填入你的配置：

```env
# 数据库连接
DATABASE_URL="mysql://username:password@localhost:3306/luzhi_admin"

# 应用地址
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# 管理员账号（请务必修改！）
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="your-secure-password"

# JWT 密钥（生产环境请使用复杂随机字符串）
JWT_SECRET="your-jwt-secret-change-this-in-production"

# Cron 密钥（用于保护定时任务 API）
CRON_SECRET="your-cron-secret-change-this-in-production"
```

**⚠️ 重要**：首次使用前请务必修改 `ADMIN_USERNAME` 和 `ADMIN_PASSWORD`！

### 3. 创建数据库

```bash
# 创建 MySQL 数据库
mysql -u root -p
CREATE DATABASE luzhi_admin CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

### 4. 初始化数据库

```bash
# 推送数据库 schema
npm run db:push

# (可选) 打开 Prisma Studio 查看数据库
npm run db:studio
```

### 5. 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000)

### 6. 登录系统

使用你在 `.env` 文件中配置的账号密码登录：
- 默认用户名：admin
- 默认密码：admin123（请务必修改！）

## 配置自动通知

### 方式一：Server酱（微信通知）

#### 1. 获取 Server酱 SendKey

1. 访问 [Server酱官网](https://sct.ftqq.com/)
2. 使用微信登录
3. 获取你的 SendKey

#### 2. 在系统中配置 Server酱

1. 登录系统，点击"设置"标签页
2. 选择"Server酱通知"
3. 点击"新增配置"
4. 填入配置名称和 SendKey
5. 点击"创建"

### 方式二：邮箱通知

#### 1. 准备邮箱信息

常见邮箱配置：
- **QQ邮箱**：smtp.qq.com:587（需获取授权码）
- **163邮箱**：smtp.163.com:465（需获取授权码）
- **Gmail**：smtp.gmail.com:587（需开启两步验证并获取应用专用密码）

#### 2. 在系统中配置邮箱

1. 登录系统，点击"设置"标签页
2. 选择"邮箱通知"
3. 点击"新增配置"
4. 填入以下信息：
   - 配置名称：例如"主要邮箱"
   - 接收邮箱：接收通知的邮箱地址
   - SMTP服务器：邮箱服务商的SMTP地址
   - SMTP端口：通常为587或465
   - SMTP用户名：通常是你的邮箱地址
   - SMTP密码：邮箱密码或授权码
5. 点击"创建"

**提示**：可以同时配置多个Server酱和邮箱，系统会向所有启用的配置发送通知。

### 3. 设置定时任务

#### 方式一：使用系统 Cron（推荐用于生产环境）

```bash
# 设置执行权限
chmod +x scripts/setup-cron.sh

# 运行设置脚本
./scripts/setup-cron.sh

# 编辑 crontab
crontab -e

# 添加以下行（每小时执行一次）
0 * * * * /path/to/luzhi/scripts/check-expiration.sh
```

#### 方式二：使用外部 Cron 服务

如果部署在 Vercel 等 Serverless 平台，可以使用：
- [EasyCron](https://www.easycron.com/)
- [cron-job.org](https://cron-job.org/)

配置定时任务调用：
```
URL: https://your-domain.com/api/cron/check-expiration
Method: GET
Headers: Authorization: Bearer your-cron-secret
Schedule: 每小时或每2小时
```

## 使用说明

### 主播管理

1. **新增主播**
   - 点击"新增主播"按钮
   - 填写主播信息（微信ID、微信名字、主播名字等）
   - 选择直播平台
   - 设置收费金额
   - 选择开始时间和到期时间（默认30天）
   - 点击"创建"

2. **编辑主播**
   - 点击主播卡片上的编辑图标
   - 修改信息后点击"更新"

3. **删除主播**
   - 点击主播卡片上的删除图标
   - 确认删除

### 查看收益

1. 点击"收益统计"标签页
2. 选择年份和月份
3. 查看当前月收益、上月收益和对比数据

### 配置通知

1. 点击"设置"标签页
2. 添加 Server酱 配置
3. 可以添加多个配置，系统会向所有启用的配置发送通知
4. 使用开关按钮启用/禁用配置

## 数据库结构

### Streamer（主播表）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | String | 主键 |
| wechatId | String | 微信ID |
| wechatName | String | 微信名字 |
| streamerName | String | 主播名字 |
| liveUrl | String | 直播地址 |
| platform | Enum | 平台（DOUYIN/DOUYU/HUYA/BILIBILI/OTHER） |
| isCustom | Boolean | 是否定制 |
| fee | Decimal | 收费金额 |
| startDate | Date | 开始时间 |
| expireDate | Date | 到期时间 |
| status | Enum | 状态（ACTIVE/EXPIRED） |

### ServerChan（Server酱配置表）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | String | 主键 |
| name | String | 配置名称 |
| sendKey | String | Server酱 SendKey |
| isActive | Boolean | 是否启用 |

### Notification（通知记录表）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | String | 主键 |
| streamerId | String | 主播ID（外键） |
| sentAt | DateTime | 发送时间 |
| content | Text | 通知内容 |

## API 接口

### 主播管理

- `GET /api/streamers` - 获取主播列表
- `POST /api/streamers` - 创建主播
- `GET /api/streamers/[id]` - 获取单个主播
- `PUT /api/streamers/[id]` - 更新主播
- `DELETE /api/streamers/[id]` - 删除主播

### 收益统计

- `GET /api/revenue?year=2024&month=1` - 获取收益统计

### Server酱配置

- `GET /api/server-chan` - 获取所有配置
- `POST /api/server-chan` - 创建配置
- `PUT /api/server-chan/[id]` - 更新配置
- `DELETE /api/server-chan/[id]` - 删除配置

### 定时任务

- `GET /api/cron/check-expiration` - 检查过期并发送通知（需要 Authorization header）

## 部署

### Vercel 部署（推荐）

1. 将代码推送到 GitHub
2. 在 [Vercel](https://vercel.com) 导入项目
3. 配置环境变量（DATABASE_URL, CRON_SECRET 等）
4. 部署完成后，配置外部 Cron 服务调用定时任务 API

### 自托管部署

```bash
# 构建项目
npm run build

# 启动生产服务器
npm start
```

使用 PM2 保持服务运行：

```bash
npm install -g pm2
pm2 start npm --name "luzhi-admin" -- start
pm2 save
pm2 startup
```

## 开发

```bash
# 开发模式
npm run dev

# 类型检查
npm run lint

# 打开 Prisma Studio
npm run db:studio

# 重置数据库（慎用）
npx prisma db push --force-reset
```

## 故障排除

### 数据库连接失败

- 检查 MySQL 是否运行
- 验证 `.env` 中的 `DATABASE_URL` 是否正确
- 确保数据库已创建

### 定时任务不工作

- 检查 crontab 是否正确配置
- 查看日志文件 `logs/cron.log`
- 验证 `CRON_SECRET` 环境变量是否设置
- 确保脚本有执行权限

### Server酱通知未收到

- 确认 SendKey 是否正确
- 检查 Server酱 配置是否已启用
- 查看浏览器控制台或服务器日志

## License

MIT

## 支持

如有问题，请提交 Issue 或联系开发者。

