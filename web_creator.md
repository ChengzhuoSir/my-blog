# Web 站点构建常见问题与规范（Jekyll + GitHub Pages）

## 资源路径与加载
- 项目页必须设置 `baseurl: "/仓库名"`，页面与资源都用 `{{ '/path' | relative_url }}`。
- 避免使用 `assets/css/style.css`、`assets/js/main.js` 这类与默认主题同名的路径，改成 `site.css`、`site.js`。
- 静态资源要 **提交到仓库**，`_site/` 不会被提交（在 `.gitignore` 中）。

## Mermaid 不渲染
- 页面显示 `language-mermaid` 代码块，说明 JS 没执行或资源 404。
- 规范处理：把 `pre > code.language-mermaid` 转成 `.mermaid` 节点，并在 DOM Ready 后执行渲染。
- 若 CDN 不稳定，改用本地资源：`assets/vendor/mermaid/mermaid.min.js`。

## MathJax 不渲染
- 必须在布局里加载 MathJax，并设置 `window.MathJax` 配置。
- 在 JS 中调用 `MathJax.typesetPromise()`，必要时加入延迟重试。
- `_config.yml` 中开启：
  ```yml
  kramdown:
    input: GFM
    math_engine: mathjax
  ```

## 表格不显示/不对齐
- 表格前后必须有空行。
- 行内公式不要写 `|d_v - d_u|`（会被当作表格分隔符），改成 `\\lvert d_v - d_u \\rvert`。

## 本地预览与缓存
- 只用 Jekyll 预览：
  ```sh
  bundle exec jekyll serve --livereload --config _config.yml,_config.local.yml
  ```
- 样式不更新时：删除 `_site/`、`.jekyll-cache/` 并强刷（Ctrl+F5）。

## 部署检查
- 推送后到 GitHub Pages 验证资源 URL 是否可访问。
- 若公式/图不渲染，优先检查浏览器控制台与资源 404。

## 依赖/环境问题（Ruby 2.7）
- 推荐 bundler `2.4.22`，使用用户目录安装：
  ```sh
  gem install bundler -v 2.4.22 --user-install --no-document
  ```
- 避免权限错误：
  ```sh
  bundle config set path "$HOME/.bundle"
  ```

## 代码块复制按钮
- 使用 JS 为 `pre > code` 添加复制按钮，排除 `language-mermaid`。
- 本地预览若 Clipboard API 失败，降级 `document.execCommand('copy')`。
- CSS 需要为 `.code-wrap` 提供相对定位，并给按钮留出顶部内边距。
