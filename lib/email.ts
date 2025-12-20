import nodemailer from 'nodemailer'

export interface EmailConfig {
  email: string
  smtpHost: string
  smtpPort: number
  smtpUser: string
  smtpPass: string
}

export async function sendEmail(
  config: EmailConfig,
  to: string,
  subject: string,
  html: string
): Promise<boolean> {
  try {
    const transporter = nodemailer.createTransport({
      host: config.smtpHost,
      port: config.smtpPort,
      secure: config.smtpPort === 465, // true for 465, false for other ports
      auth: {
        user: config.smtpUser,
        pass: config.smtpPass,
      },
    })

    await transporter.sendMail({
      from: `"直播录制管理系统" <${config.email}>`,
      to,
      subject,
      html,
    })

    return true
  } catch (error) {
    console.error('发送邮件失败:', error)
    return false
  }
}

export function generateExpirationEmailHTML(streamerData: {
  wechatId: string
  wechatName: string
  streamerName: string
  liveUrl: string
  platform: string
  isCustom: boolean
  fee: string
  startDate: string
  expireDate: string
}): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 30px;
      border-radius: 10px 10px 0 0;
      text-align: center;
    }
    .content {
      background: #f8f9fa;
      padding: 30px;
      border-radius: 0 0 10px 10px;
    }
    .info-item {
      background: white;
      padding: 15px;
      margin-bottom: 10px;
      border-radius: 5px;
      border-left: 4px solid #667eea;
    }
    .info-label {
      font-weight: bold;
      color: #667eea;
      margin-bottom: 5px;
    }
    .info-value {
      color: #333;
    }
    .warning {
      background: #fff3cd;
      border-left: 4px solid #ffc107;
      padding: 15px;
      margin-top: 20px;
      border-radius: 5px;
    }
    .footer {
      text-align: center;
      color: #6c757d;
      font-size: 12px;
      margin-top: 30px;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>⚠️ 主播到期提醒</h1>
    <p>有主播录制服务已到期，请及时处理</p>
  </div>
  <div class="content">
    <div class="info-item">
      <div class="info-label">主播名字</div>
      <div class="info-value">${streamerData.streamerName}</div>
    </div>
    <div class="info-item">
      <div class="info-label">微信信息</div>
      <div class="info-value">${streamerData.wechatName} (${streamerData.wechatId})</div>
    </div>
    <div class="info-item">
      <div class="info-label">直播平台</div>
      <div class="info-value">${streamerData.platform}</div>
    </div>
    <div class="info-item">
      <div class="info-label">直播地址</div>
      <div class="info-value"><a href="${streamerData.liveUrl}">${streamerData.liveUrl}</a></div>
    </div>
    <div class="info-item">
      <div class="info-label">是否定制</div>
      <div class="info-value">${streamerData.isCustom ? '是' : '否'}</div>
    </div>
    <div class="info-item">
      <div class="info-label">收费金额</div>
      <div class="info-value">¥${streamerData.fee}</div>
    </div>
    <div class="info-item">
      <div class="info-label">开始时间</div>
      <div class="info-value">${streamerData.startDate}</div>
    </div>
    <div class="info-item">
      <div class="info-label">到期时间</div>
      <div class="info-value">${streamerData.expireDate}</div>
    </div>
    <div class="warning">
      <strong>⚠️ 注意：</strong>该主播已到期，请尽快联系客户续费或进行相应处理。
    </div>
  </div>
  <div class="footer">
    <p>这是系统自动发送的邮件，请勿直接回复</p>
    <p>直播录制管理系统 © 2025</p>
  </div>
</body>
</html>
  `
}

