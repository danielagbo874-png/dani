"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type UserRow = {
  createdAt: Date | string;
  email: string;
  emailVerified: boolean;
  id: string;
  isAnonymous: boolean;
  name: string | null;
};

type ChatRow = {
  createdAt: Date | string;
  id: string;
  title: string;
  userEmail: string | null;
  userId: string;
  userName: string | null;
  visibility: "public" | "private";
};

export function AdminDashboard({
  users,
  recentChats,
  stripeConfigured,
  stripePublishableConfigured,
}: {
  users: UserRow[];
  recentChats: ChatRow[];
  stripeConfigured: boolean;
  stripePublishableConfigured: boolean;
}) {
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<"overview" | "users" | "conversations" | "payments">("overview");

  const filteredUsers = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return users;

    return users.filter((user) => {
      const haystack = [user.name, user.email].filter(Boolean).join(" ").toLowerCase();
      return haystack.includes(value);
    });
  }, [query, users]);

  const filteredChats = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return recentChats;

    return recentChats.filter((chat) => {
      const haystack = [chat.title, chat.userName, chat.userEmail].filter(Boolean).join(" ").toLowerCase();
      return haystack.includes(value);
    });
  }, [query, recentChats]);

  const totalUsers = users.length;
  const verifiedUsers = users.filter((user) => user.emailVerified).length;
  const guestUsers = users.filter((user) => user.isAnonymous).length;
  const chatCount = recentChats.length;

  return (
    <main className="min-h-screen bg-background px-6 py-10 text-foreground">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-primary/80">
              Admin panel
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">Operations dashboard</h1>
          </div>
          <div className="flex items-center gap-3">
            <Button asChild variant="outline">
              <Link href="/">Back to app</Link>
            </Button>
          </div>
        </div>

        <div className="mb-6 flex flex-wrap items-center gap-2 rounded-2xl border border-border/60 bg-card/80 p-2">
          {[
            ["overview", "Overview"],
            ["users", "Users"],
            ["conversations", "Conversations"],
            ["payments", "Payments"],
          ].map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key as typeof tab)}
              className={`rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                tab === key ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="mb-6 flex items-center gap-3 rounded-2xl border border-border/60 bg-card/80 p-3">
          <input
            aria-label="Search admin records"
            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none ring-0 placeholder:text-muted-foreground"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search users or conversations..."
            value={query}
          />
        </div>

        {tab === "overview" ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Total users" value={String(totalUsers)} detail="Registered accounts" />
            <StatCard label="Verified users" value={String(verifiedUsers)} detail="Email verified accounts" />
            <StatCard label="Guest users" value={String(guestUsers)} detail="Anonymous traffic" />
            <StatCard label="Recent chats" value={String(chatCount)} detail="Latest stored conversations" />
          </div>
        ) : null}

        {tab === "users" ? (
          <section className="rounded-3xl border border-border/60 bg-card/80 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.05)]">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Users</h2>
              <span className="text-sm text-muted-foreground">{filteredUsers.length} results</span>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="text-muted-foreground">
                  <tr className="border-b border-border/60">
                    <th className="pb-3 pr-4 font-medium">Name</th>
                    <th className="pb-3 pr-4 font-medium">Email</th>
                    <th className="pb-3 pr-4 font-medium">Joined</th>
                    <th className="pb-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b border-border/40 align-top last:border-0">
                      <td className="py-3 pr-4 font-medium">{user.name ?? "Unnamed"}</td>
                      <td className="py-3 pr-4 text-muted-foreground">{user.email}</td>
                      <td className="py-3 pr-4 text-muted-foreground">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3">
                        <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                          user.isAnonymous
                            ? "bg-amber-500/10 text-amber-600"
                            : user.emailVerified
                              ? "bg-emerald-500/10 text-emerald-600"
                              : "bg-slate-500/10 text-slate-600"
                        }`}>
                          {user.isAnonymous ? "Guest" : user.emailVerified ? "Verified" : "Unverified"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ) : null}

        {tab === "conversations" ? (
          <section className="rounded-3xl border border-border/60 bg-card/80 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.05)]">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Recent conversations</h2>
              <span className="text-sm text-muted-foreground">{filteredChats.length} results</span>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="text-muted-foreground">
                  <tr className="border-b border-border/60">
                    <th className="pb-3 pr-4 font-medium">Title</th>
                    <th className="pb-3 pr-4 font-medium">User</th>
                    <th className="pb-3 pr-4 font-medium">Visibility</th>
                    <th className="pb-3 font-medium">Started</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredChats.map((chat) => (
                    <tr key={chat.id} className="border-b border-border/40 align-top last:border-0">
                      <td className="py-3 pr-4 font-medium">{chat.title}</td>
                      <td className="py-3 pr-4 text-muted-foreground">{chat.userName ?? chat.userEmail ?? "Unknown user"}</td>
                      <td className="py-3 pr-4">
                        <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                          chat.visibility === "public" ? "bg-blue-500/10 text-blue-600" : "bg-slate-500/10 text-slate-600"
                        }`}>
                          {chat.visibility}
                        </span>
                      </td>
                      <td className="py-3 text-muted-foreground">{new Date(chat.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ) : null}

        {tab === "payments" ? (
          <section className="rounded-3xl border border-border/60 bg-card/80 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.05)]">
            <h2 className="text-xl font-semibold">Payments overview</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <PaymentRow label="Stripe checkout" value={stripeConfigured ? "Configured" : "Not configured"} tone={stripeConfigured ? "good" : "warn"} />
              <PaymentRow label="Stripe publishable" value={stripePublishableConfigured ? "Configured" : "Not configured"} tone={stripePublishableConfigured ? "good" : "warn"} />
              <PaymentRow label="Subscription API" value="Checkout route enabled" tone="good" />
              <PaymentRow label="Webhook status" value="Not yet connected" tone="warn" />
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}

function StatCard({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card/80 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.04)]">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-3 text-3xl font-semibold tracking-tight">{value}</p>
      <p className="mt-2 text-xs text-muted-foreground">{detail}</p>
    </div>
  );
}

function PaymentRow({ label, value, tone }: { label: string; value: string; tone: "good" | "warn" | "neutral" }) {
  const colors = {
    good: "bg-emerald-500/10 text-emerald-600",
    warn: "bg-amber-500/10 text-amber-600",
    neutral: "bg-slate-500/10 text-slate-600",
  };

  return (
    <div className="flex items-center justify-between rounded-2xl border border-border/60 bg-background/70 px-4 py-3">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${colors[tone]}`}>{value}</span>
    </div>
  );
}
