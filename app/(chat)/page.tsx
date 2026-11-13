export default function Page() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 py-16">
      <div className="w-full max-w-4xl rounded-3xl border border-border/60 bg-card/80 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.08)] backdrop-blur-sm md:p-12">
        <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
          <div className="flex size-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
            ✦
          </div>
          Nexa AI
        </div>

        <div className="mt-8 grid gap-10 md:grid-cols-[1.2fr_0.8fr] md:items-center">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-primary/80">
              Personal AI workspace
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-foreground md:text-6xl">
              Think clearly. Create faster. Stay in flow.
            </h1>
            <p className="mt-5 max-w-xl text-base text-muted-foreground md:text-lg">
              A focused AI companion for planning, writing, coding, and turning ideas into action. Your conversations, prompts, and projects stay in one place.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                className="inline-flex items-center rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
                href="/"
              >
                Start chatting
              </a>
              <a
                className="inline-flex items-center rounded-full border border-border bg-background px-5 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted/60"
                href="/login"
              >
                Sign in
              </a>
            </div>
          </div>

          <div className="rounded-2xl border border-border/60 bg-background/70 p-5">
            <div className="space-y-4">
              <div className="rounded-2xl border border-border/60 bg-card px-4 py-3">
                <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                  Best for
                </p>
                <p className="mt-2 text-lg font-medium text-foreground">
                  Writing, coding, planning
                </p>
              </div>
              <div className="rounded-2xl border border-border/60 bg-card px-4 py-3">
                <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                  Memory
                </p>
                <p className="mt-2 text-lg font-medium text-foreground">
                  Personal context, not just prompts
                </p>
              </div>
              <div className="rounded-2xl border border-border/60 bg-card px-4 py-3">
                <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                  Workflow
                </p>
                <p className="mt-2 text-lg font-medium text-foreground">
                  Ask once, iterate fast, ship smarter
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
