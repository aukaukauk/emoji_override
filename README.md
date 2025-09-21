# Noto Emoji Override / Noto Emoji 覆盖

## Overview / 概述
- Wraps emoji sequences in lightweight spans so Chrome on Windows renders them with Google's Noto Emoji.
- 通过脚本自动包裹 emoji 序列，让 Windows 版 Chrome 使用 Google Noto Emoji 渲染表情。
- Comes with bundled Noto Emoji fonts as fallback when the system font is missing.
- 内置 Noto Emoji 字体，即使系统未安装也可以显示 Google 风格表情。

## Installation / 安装
1. Download or clone this repository.
   - 下载或克隆此仓库。
2. Open Chrome → chrome://extensions → enable Developer Mode → Load unpacked → choose the `extension/` folder.
   - 打开 Chrome → chrome://extensions → 启用开发者模式 → “加载已解压的扩展程序” → 选择 `extension/` 目录。

## Usage / 使用
- Click the extension icon and press the button to enable or disable the override.
- 点击扩展图标，使用按钮启用或关闭表情覆盖。
- Use “Block This Site” / “Unblock This Site” to maintain a per-site block list (based on domain).
- 通过 “Block This Site” / “Unblock This Site” 按钮维护站点黑名单（基于域名）。
- Refresh pages (or open any page with emoji) to confirm the Noto Emoji style.
- 刷新页面（或任意包含表情的页面）验证是否显示为 Noto 风格。

## Known Issues / 已知问题
- Very dynamic pages may momentarily show system emoji before the wrapper updates the DOM.
- 动态刷新频繁的页面可能短暂出现系统表情，脚本会很快重新包裹。
- Bundled fonts increase the extension size (~15 MB) and may render as monochrome on some legacy Windows builds.
- 内置字体会增加扩展体积（约 15 MB），且在部分旧版 Windows 上可能显示为黑白。
