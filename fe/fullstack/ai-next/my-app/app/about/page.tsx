import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "关于 Next.js",
  description: "关于 Next.js 框架的介绍：它是什么、核心特性以及为什么受欢迎。",
};

const features = [
  {
    title: "App Router",
    description:
      "基于文件系统的路由约定，支持嵌套布局、加载态与错误边界，让页面结构一目了然。",
  },
  {
    title: "服务端组件",
    description:
      "默认在服务端渲染，减少发送到浏览器的 JavaScript，页面加载更快、SEO 更友好。",
  },
  {
    title: "全栈能力",
    description:
      "内置 API Routes 与 Server Actions，前后端逻辑可以在一个框架内完成。",
  },
  {
    title: "自动优化",
    description:
      "图片、字体、代码分割、静态生成等开箱即用，配合 Vercel 可一键部署。",
  },
];

export default function About() {
  return (
    <div className="flex flex-col flex-1 items-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-3xl flex-col gap-10 py-20 px-6 sm:px-16">
        <header className="flex flex-col gap-4">
          <h1 className="text-4xl font-semibold tracking-tight text-black dark:text-zinc-50">
            关于 Next.js
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Next.js 是一个基于 React 的
            全栈框架，由 Vercel 开发和维护。它提供路由、渲染、数据获取、构建优化等开箱即用的能力，
            被广泛用于构建高性能的 Web 应用。
          </p>
        </header>

        <section className="flex flex-col gap-4">
          <h2 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50">
            核心特性
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="flex flex-col gap-2 rounded-2xl border border-solid border-black/[.08] bg-white p-6 dark:border-white/[.145] dark:bg-[#1a1a1a]"
              >
                <h3 className="text-lg font-semibold text-black dark:text-zinc-50">
                  {feature.title}
                </h3>
                <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50">
            渲染方式
          </h2>
          <ul className="flex flex-col gap-3 text-zinc-600 dark:text-zinc-400">
            <li>
              <strong className="text-black dark:text-zinc-50">SSG</strong>
              ：构建时生成静态页面，适合内容不变的站点。
            </li>
            <li>
              <strong className="text-black dark:text-zinc-50">SSR</strong>
              ：每个请求在服务端渲染，适合内容动态更新的场景。
            </li>
            <li>
              <strong className="text-black dark:text-zinc-50">ISR</strong>
              ：结合 SSG 与 SSR，按需在后台重新生成静态页面。
            </li>
            <li>
              <strong className="text-black dark:text-zinc-50">CSR</strong>
              ：客户端渲染，适合需要高度交互的界面。
            </li>
          </ul>
        </section>

        <footer className="border-t border-solid border-black/[.08] pt-8 text-sm text-zinc-500 dark:border-white/[.145] dark:text-zinc-400">
          当前项目使用 Next.js 16 与 React 19。访问{" "}
          <a
            href="https://nextjs.org/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-black underline underline-offset-4 dark:text-zinc-50"
          >
            官方文档
          </a>{" "}
          了解更多。
        </footer>
      </main>
    </div>
  );
}
