import StoryBar from "@/components/StoryBar";

export default function Home() {
  return (
    <main className="min-h-dvh bg-canvas">
      <header className="mx-auto max-w-[640px] px-4 pt-8 pb-4">
        <h1 className="text-[22px] font-semibold tracking-[-0.4px] text-ink">
          Stories
        </h1>
        <p className="mt-1 text-[14px] text-ink-subtle">
          Share a moment. It vanishes in 24 hours.
        </p>
      </header>
      <StoryBar />
    </main>
  );
}
