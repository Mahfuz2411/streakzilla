export function Loader() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="flex items-end gap-2">
        <div className="w-4 h-4 bg-black rounded animate-[bounce_1s_ease-in-out_infinite_0ms]"></div>
        <div className="w-4 h-4 bg-black rounded animate-[bounce_1s_ease-in-out_infinite_150ms]"></div>
        <div className="w-4 h-4 bg-black rounded animate-[bounce_1s_ease-in-out_infinite_300ms]"></div>
      </div>
    </div>
  );
}
