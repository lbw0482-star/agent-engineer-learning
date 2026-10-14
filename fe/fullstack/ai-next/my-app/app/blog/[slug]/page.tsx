import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostBySlug, posts } from "../posts";

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
  };
}

// 将 markdown 风格的正文（## 标题、- 列表、段落）渲染为对应元素
function renderContent(content: string) {
  const elements: ReactNode[] = [];
  const listItems: string[] = [];
  let key = 0;

  const flushList = () => {
    if (listItems.length === 0) return;
    elements.push(
      <ul
        key={key++}
        className="flex list-disc flex-col gap-2 pl-6 text-lg leading-8 text-zinc-600 dark:text-zinc-400"
      >
        {listItems.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    );
    listItems.length = 0;
  };

  for (const line of content.split("\n")) {
    if (line.startsWith("## ")) {
      flushList();
      elements.push(
        <h2
          key={key++}
          className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50"
        >
          {line.slice(3)}
        </h2>
      );
    } else if (line.startsWith("- ")) {
      listItems.push(line.slice(2));
    } else if (line.trim() !== "") {
      flushList();
      elements.push(
        <p
          key={key++}
          className="text-lg leading-8 text-zinc-600 dark:text-zinc-400"
        >
          {line}
        </p>
      );
    }
  }
  flushList();
  return elements;
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return (
    <div className="flex flex-col flex-1 items-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-3xl flex-col gap-8 py-20 px-6 sm:px-16">
        <Link
          href="/blog"
          className="text-sm font-medium text-zinc-500 underline underline-offset-4 hover:text-black dark:text-zinc-400 dark:hover:text-zinc-50"
        >
          ← 返回博客
        </Link>
        <article className="flex flex-col gap-6">
          <header className="flex flex-col gap-3">
            <time className="text-sm text-zinc-500 dark:text-zinc-400">
              {post.date}
            </time>
            <h1 className="text-4xl font-semibold tracking-tight text-black dark:text-zinc-50">
              {post.title}
            </h1>
          </header>
          {renderContent(post.content)}
        </article>
      </main>
    </div>
  );
}
