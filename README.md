# Circu

本项目是一个支持多人协同的在线文档应用，仓库主体是基于 pnpm Workspace 配置的 monorepo，包含以下4个包：

- circu-editor - 富文本编辑器模块
- circu-server - 应用后端
- circu-wiki - 应用前端
- slate-react - circu-editor 的渲染层部分, 主要代码来自于 [Slate.js 官方](https://github.com/ianstormtaylor/slate)

## Roadmap

### circu-editor

- [x] 支持内容块缩进和单行缩进，内容块缩进可以配合相关钮实现批量移动、展开和收起文档内容
- [x] 支持悬浮工具栏，可以通过悬浮工具栏更改行内或块级式
- [x] 支持 markdown 语法，详细语法可以通过将鼠标移动到浮工具栏的对应按钮上得知
- [ ] 支持文档目录功能，通过多级标题生成文档目录，点击对目录文档可以跳转到对应位置

### circu-server

- [x] 支持基本的文档和文件夹管理功能
- [x] 支持基本的权限、分享和协作功能
- [ ] 支持文档多人协同
- [ ] 支持文档历史记录回溯
- [ ] 配合相关中间件令服务端实例支持横向扩展