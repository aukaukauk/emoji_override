# Noto Emoji Override / Noto Emoji 覆盖

## Overview / 概述
- Wraps emoji sequences in lightweight spans so Chrome on Windows renders them with Google's Noto Emoji when the font is installed on the system.
- 通过脚本自动包裹 emoji 序列，让 Windows 版 Chrome 在系统已安装字体时使用 Google Noto Emoji 渲染表情。

## Installation / 安装
1. Download or clone this repository.
   - 下载或克隆此仓库。
2. Open Chrome → chrome://extensions → enable Developer Mode → Load unpacked → choose the extension/ folder.
   - 打开 Chrome → chrome://extensions → 启用开发者模式 → “加载已解压的扩展程序” → 选择 extension/ 目录。

## Usage / 使用
- Click the extension icon and press the button to enable or disable the override.
- 点击扩展图标，使用按钮启用或关闭表情覆盖。
- Refresh pages (or open any page with emoji) to confirm the new style.
- 刷新页面（或任意包含表情的页面）验证显示效果。

## Known Issues / 已知问题
- Very dynamic pages may momentarily show system emoji before the wrapper updates the DOM.
- 动态刷新频繁的页面可能短暂出现系统表情，脚本会很快重新包裹。
- If Noto Color Emoji is not installed, Windows will continue to display its default emoji.
- 如果系统未安装 Noto Color Emoji，仍会显示 Windows 默认表情。
