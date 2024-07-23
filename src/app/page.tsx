export default function Home(): React.ReactNode {
  return (
    <main className="flex h-full flex-col items-center justify-center p-24 bg-slate-900">
      <div className="flex flex-col items-center justify-cente">
        <h1 className="text-5xl text-white">
          <span className="font-semibold text-yellow-100">Pow</span>
          <span className="mx-1 text-white">And</span>
          <span className="font-semibold text-yellow-100">Go</span>
        </h1>
        <p className="mt-3 text-xl text-slate-400">Launching Soon</p>
      </div>
    </main>
  );
}
