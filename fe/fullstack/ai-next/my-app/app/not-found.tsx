import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-xl flex-col items-center gap-6 px-6 py-24 text-center">
        <p className="text-sm font-semibold tracking-widest text-zinc-500 uppercase dark:text-zinc-400">
          错误 404
        </p>
        <h1 className="text-6xl font-semibold tracking-tight text-black dark:text-zinc-50">
          页面不存在
        </h1>
        <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
          你访问的页面可能已被移动或删除。请检查链接地址，或者返回首页继续浏览。
        </p>
        <Button
          render={<Link href="/" />}
          className="mt-2 h-12 px-6 text-base"
        >
          返回首页
        </Button>
      </main>
    </div>
  );
}
