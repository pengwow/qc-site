# QuantCell 项目展示网站

QuantCell Project Showcase Website - 一个专业的开源量化交易平台展示网站。

## 功能特性

### 核心功能
- **全面展示 QuantCell 核心功能**：策略回测、实时数据、多交易所支持、风险管理等
- **GitHub & Gitee 源码仓库链接**：明显的开源仓库入口
- **技术架构可视化**：清晰展示系统架构设计
- **代码示例展示**：简洁的 Python 策略代码示例

### 交互功能
- **中英文双语切换**：完整的中英文国际化支持
- **深色/浅色主题切换**：支持暗色和亮色模式
- **响应式布局**：适配桌面端、平板和移动端
- **平滑滚动导航**：优雅的页面滚动体验

### 设计特点
- **现代 UI/UX 设计**：采用玻璃态设计风格
- **渐变色彩主题**：专业的蓝紫渐变配色
- **动画效果**：浮动元素、悬停动画等
- **代码高亮**：专业的代码展示区域

## 技术栈

- **HTML5** - 语义化标记
- **Tailwind CSS** - 实用优先的 CSS 框架（本地托管）
- **Lucide Icons** - 现代图标库（本地托管）
- **本地字体** - Inter & JetBrains Mono 字体（本地托管）
- **原生 JavaScript** - 无框架依赖

## 项目结构

```
qc-site/
├── index.html          # 主页面文件
├── README.md           # 项目文档
└── assets/             # 静态资源目录
    ├── css/            # CSS 文件
    │   ├── fonts.css   # 本地字体样式
    │   └── tailwindcss.min.js  # Tailwind CSS
    ├── fonts/          # 字体文件
    │   ├── inter-*.woff2       # Inter 字体
    │   └── jetbrains-mono-*.woff2  # JetBrains Mono 字体
    └── js/             # JavaScript 文件
        └── lucide.min.js       # Lucide 图标库
```

## 快速开始

### 本地开发

1. 克隆或下载项目到本地

2. 进入项目目录
```bash
cd qc-site
```

3. 启动本地服务器（任选其一）

**使用 Python:**
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

**使用 Node.js:**
```bash
npx serve .
```

**使用 VS Code:**
安装 Live Server 插件，右键点击 `index.html` 选择 "Open with Live Server"

4. 在浏览器中访问
```
http://localhost:8000
```

### 生产部署

#### 方案一：静态托管（推荐）

**Vercel:**
```bash
# 安装 Vercel CLI
npm i -g vercel

# 部署
vercel --prod
```

**Netlify:**
```bash
# 安装 Netlify CLI
npm i -g netlify-cli

# 部署
netlify deploy --prod --dir=.
```

**GitHub Pages:**
1. 将代码推送到 GitHub 仓库
2. 进入 Settings > Pages
3. 选择 Source 为 Deploy from a branch
4. 选择 main 分支和 / (root) 目录
5. 保存后等待部署完成

#### 方案二：传统服务器部署

**Nginx 配置:**
```nginx
server {
    listen 80;
    server_name quantcell.example.com;
    root /var/www/quantcell-site;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # 启用 gzip 压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml;
}
```

**Apache 配置:**
```apache
<VirtualHost *:80>
    ServerName quantcell.example.com
    DocumentRoot /var/www/quantcell-site

    <Directory /var/www/quantcell-site>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>

    # 启用压缩
    LoadModule deflate_module modules/mod_deflate.so
    AddOutputFilterByType DEFLATE text/html text/css application/javascript
</VirtualHost>
```

#### 方案三：Docker 部署

创建 `Dockerfile`:
```dockerfile
FROM nginx:alpine
COPY . /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
```

创建 `nginx.conf`:
```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }
}
```

构建并运行:
```bash
docker build -t quantcell-site .
docker run -d -p 8080:80 quantcell-site
```

## 自定义配置

### 修改 GitHub/Gitee 链接

在 `index.html` 中搜索以下链接并替换为你的实际仓库地址:

```html
<!-- GitHub 链接 -->
<a href="https://github.com/your-repo/quantcell" ...>

<!-- Gitee 链接 -->
<a href="https://gitee.com/your-repo/quantcell" ...>
```

### 修改项目统计信息

在 Hero 区域更新统计数据:

```html
<div class="text-2xl font-bold">10k+</div>  <!-- 下载量 -->
<div class="text-2xl font-bold">500+</div>  <!-- GitHub Stars -->
<div class="text-2xl font-bold">50+</div>   <!-- 贡献者 -->
```

### 添加/修改功能特性

在 Features 区域，复制以下模板添加新功能:

```html
<div class="feature-card p-6 rounded-2xl glass border ...">
  <div class="w-12 h-12 rounded-xl bg-{color}-500/10 flex items-center justify-center mb-4">
    <i data-lucide="{icon-name}" class="w-6 h-6 text-{color}-500"></i>
  </div>
  <h3 class="text-xl font-semibold mb-2" data-i18n="features.{key}.title">标题</h3>
  <p class="text-slate-600 dark:text-slate-400 text-sm" data-i18n="features.{key}.description">描述</p>
</div>
```

### 扩展国际化内容

在 JavaScript 部分的 `translations` 对象中添加新的翻译键值:

```javascript
const translations = {
  en: {
    'your.new.key': 'English text',
    // ...
  },
  zh: {
    'your.new.key': '中文文本',
    // ...
  }
};
```

然后在 HTML 中使用:
```html
<span data-i18n="your.new.key">Default text</span>
```

## 浏览器支持

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 性能优化

### 已实现的优化
- 使用 CDN 加载第三方资源（Tailwind、Lucide、Google Fonts）
- 图片懒加载（如添加图片）
- CSS 动画使用 GPU 加速
- 最小化 JavaScript 代码

### 建议的进一步优化
1. **压缩资源**: 使用 gzip 或 brotli 压缩
2. **图片优化**: 使用 WebP 格式，添加响应式图片
3. **缓存策略**: 配置浏览器缓存头
4. **预加载**: 添加关键资源的预加载链接

## 开发规范

### 代码风格
- 使用 2 空格缩进
- 属性使用双引号
- 类名使用 kebab-case
- ID 使用 camelCase

### 提交规范
```
feat: 新功能
fix: 修复问题
docs: 文档更新
style: 代码格式调整
refactor: 重构
perf: 性能优化
```

## 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'feat: add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 联系方式

- 项目主页: https://github.com/your-repo/quantcell
- 问题反馈: https://github.com/your-repo/quantcell/issues
- 邮件: your-email@example.com

## 致谢

- [Tailwind CSS](https://tailwindcss.com/) - 优秀的 CSS 框架
- [Lucide Icons](https://lucide.dev/) - 精美的图标库
- [Google Fonts](https://fonts.google.com/) - 免费字体资源

---

Made with ❤️ for the QuantCell Community
