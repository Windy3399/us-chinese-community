export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center space-y-6 max-w-md px-4">
        <div className="text-9xl font-bold text-zinc-200 dark:text-zinc-800 select-none">
          404
        </div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          页面未找到
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          抱歉，您访问的页面不存在或已被移除
        </p>
        <a href="/" className="text-blue-600 hover:underline">
          返回首页
        </a>
      </div>
    </div>
  );
}
