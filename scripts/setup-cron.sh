#!/bin/bash

# 设置定时任务脚本
# 使用 crontab 每小时检查一次过期主播

echo "设置定时任务..."

# 获取当前脚本所在目录
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

# 创建 cron 任务脚本
cat > "$PROJECT_DIR/scripts/check-expiration.sh" << 'EOF'
#!/bin/bash

# 读取环境变量
source ~/.bashrc

# 获取项目目录
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

# 读取 .env 文件
if [ -f "$PROJECT_DIR/.env" ]; then
  export $(cat "$PROJECT_DIR/.env" | grep -v '^#' | xargs)
fi

# 调用 API
curl -X GET \
  -H "Authorization: Bearer $CRON_SECRET" \
  "$NEXT_PUBLIC_APP_URL/api/cron/check-expiration" \
  >> "$PROJECT_DIR/logs/cron.log" 2>&1

echo "$(date): Checked expiration" >> "$PROJECT_DIR/logs/cron.log"
EOF

chmod +x "$PROJECT_DIR/scripts/check-expiration.sh"

# 创建日志目录
mkdir -p "$PROJECT_DIR/logs"

echo "定时任务脚本已创建: $PROJECT_DIR/scripts/check-expiration.sh"
echo ""
echo "要设置 crontab，请运行："
echo "crontab -e"
echo ""
echo "然后添加以下行 (每小时执行一次)："
echo "0 * * * * $PROJECT_DIR/scripts/check-expiration.sh"
echo ""
echo "或者每2小时执行一次："
echo "0 */2 * * * $PROJECT_DIR/scripts/check-expiration.sh"

