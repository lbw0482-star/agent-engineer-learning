export type Post = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
};

export const posts: Post[] = [
  {
    slug: "nextjs-app-router-intro",
    title: "Next.js App Router 初体验",
    date: "2026-08-20",
    excerpt:
      "App Router 是 Next.js 新一代的路由方案，基于文件系统约定，支持嵌套布局、加载态与错误边界。",
    content:
      "App Router 于 Next.js 13 正式推出，是官方推荐的路由方案。它基于 React Server Components，可以在服务端直接获取数据并渲染，从而减少发送到浏览器的 JavaScript 体积。\n\n## 核心概念\n\n- layout：共享布局，父子页面复用同一份 UI\n- page：路由对应的页面内容\n- loading：路由切换时的加载态，基于 Suspense\n- error：错误边界，局部错误不会拖垮整个应用\n\n## 与 Pages Router 的区别\n\nPages Router 是 Next.js 早期版本的路由方案。App Router 在保持兼容的同时，引入了嵌套路由、并行路由、拦截路由等高级特性，是目前推荐的新一代方案。",
  },
  {
    slug: "react-server-components",
    title: "什么是 React Server Components",
    date: "2026-08-18",
    excerpt:
      "Server Components 让组件默认在服务端运行，从而减少客户端代码量，是 React 19 与 Next.js 的关键能力。",
    content:
      "React Server Components（RSC）允许组件默认在服务端渲染，只有真正需要交互的部分才会打包发送到浏览器，页面因此更小、更快。\n\n## 如何使用\n\n- 组件默认就是 Server Component，无需额外标记\n- 需要交互时，在文件顶部添加 'use client' 指令\n- Server 与 Client 组件可以自由组合嵌套\n\n## 常见误区\n\n很多人担心 RSC 只能在服务端使用。实际上，Server Components 也可以通过预渲染输出静态 HTML，与 SSG、ISR 等渲染策略结合使用，灵活应对不同场景。",
  },
];

export function getPostBySlug(slug: string) {
  return posts.find((post) => post.slug === slug);
}
