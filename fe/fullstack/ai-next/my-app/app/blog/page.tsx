import type { Metadata } from "next";
import Link from "next/link";
import { posts } from "./posts";

export const metadata: Metadata = {
  title: "博客",
  description: "我的 Next.js 学习博客",
};

export default function BlogPage() {
  return (
    <div className="flex flex-col flex-1 items-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-3xl flex-col gap-10 py-20 px-6 sm:px-16">
        <header className="flex flex-col gap-4">
          <h1 className="text-4xl font-semibold tracking-tight text-black dark:text-zinc-50">
            博客
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            记录我在 Next.js 与 React 学习路上的思考与实践。
          </p>
        </header>

        <section className="flex flex-col gap-6">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex flex-col gap-3 rounded-2xl border border-solid border-black/[.08] bg-white p-6 transition-colors hover:border-black/[.2] dark:border-white/[.145] dark:bg-[#1a1a1a] dark:hover:border-white/[.3]"
            >
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-xl font-semibold text-black group-hover:underline dark:text-zinc-50">
                  {post.title}
                </h2>
                <time className="shrink-0 text-sm text-zinc-500 dark:text-zinc-400">
                  {post.date}
                </time>
              </div>
              <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                {post.excerpt}
              </p>
              <span className="text-sm font-medium text-black underline underline-offset-4 dark:text-zinc-50">
                阅读全文 →
              </span>
            </Link>
          ))}
        </section>
      </main>
    </div>
  );
}
