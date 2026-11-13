"use client";

import { CheckIcon, SparklesIcon, ZapIcon } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

import { setStoredPremiumPlan } from "@/lib/premium";

const features = [
	"Unlimited personal AI chats",
	"Priority model access",
	"Advanced writing and planning workflows",
	"Saved context across sessions",
	"Artifact creation and editing",
	"Faster response times",
];

const plans: Array<{
	name: string;
	description: string;
	price: string;
	sub?: string;
	cta: string;
	highlight: boolean;
	features: string[];
}> = [
	{
		name: "Starter",
		description: "For casual daily use",
		price: "$0",
		cta: "Current plan",
		highlight: false,
		features: [
			"3 AI chats per hour",
			"Basic workspace access",
			"Limited artifacts",
		],
	},
	{
		name: "Prime",
		description: "Best for power users",
		price: "$19",
		sub: "/ month",
		cta: "Upgrade to Prime",
		highlight: true,
		features: [
			"Unlimited personal chats",
			"Priority AI access",
			"Advanced planning workflows",
			"Premium artifact tools",
			"Faster responses",
		],
	},
	{
		name: "Team",
		description: "For collaborative work",
		price: "$49",
		sub: "/ month",
		cta: "Contact sales",
		highlight: false,
		features: [
			"Shared workspace and team prompts",
			"Priority support",
			"Collaborative artifacts",
			"Custom onboarding",
		],
	},
];

export default function UpgradePage() {
	const searchParams = useSearchParams();
	const checkoutState = searchParams.get("checkout");

	useEffect(() => {
		if (checkoutState === "success") {
			setStoredPremiumPlan("prime");
		}
	}, [checkoutState]);

	const handleCheckout = async (plan: string) => {
		const response = await fetch("/api/checkout", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ plan }),
		});

		const payload = (await response.json()) as { url?: string; error?: string };

		if (!response.ok || !payload.url) {
			window.alert(payload.error || "Unable to start checkout.");
			return;
		}

		window.location.href = payload.url;
	};

	return (
		<main className="flex min-h-screen justify-center bg-background px-6 py-16">
			<div className="w-full max-w-6xl">
				<div className="mx-auto max-w-2xl text-center">
					<div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/8 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-primary">
						<SparklesIcon className="size-3.5" />
						Nexa Prime
					</div>
					<h1 className="mt-6 text-4xl font-semibold tracking-tight text-foreground md:text-6xl">
						Upgrade your AI workflow.
					</h1>
					<p className="mt-4 text-base text-muted-foreground md:text-lg">
						Unlock a faster, more capable personal workspace for writing, planning,
						coding, and shipping your ideas.
					</p>
				</div>

				{checkoutState ? (
					<div className="mx-auto mt-8 max-w-2xl rounded-2xl border border-border/70 bg-card/80 p-4 text-center text-sm text-foreground">
						{checkoutState === "success"
							? "Your checkout was successful. Prime is now active on your account."
							: "Your checkout was cancelled. You can try again anytime."}
					</div>
				) : null}

				<div className="mt-12 grid gap-6 lg:grid-cols-3">
					{plans.map((plan) => (
						<div
							key={plan.name}
							className={`rounded-3xl border p-6 shadow-[0_20px_60px_rgba(0,0,0,0.08)] ${
								plan.highlight
									? "border-primary/50 bg-primary/5 ring-1 ring-primary/20"
									: "border-border/60 bg-card/80"
							}`}
						>
							<div className="flex items-center justify-between gap-3">
								<div>
									<p className="text-lg font-semibold text-foreground">
										{plan.name}
									</p>
									<p className="mt-1 text-sm text-muted-foreground">
										{plan.description}
									</p>
								</div>
								{plan.highlight ? (
									<div className="rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-primary">
										Popular
									</div>
								) : null}
							</div>

							<div className="mt-6 flex items-end gap-1">
								<span className="text-4xl font-semibold tracking-tight text-foreground">
									{plan.price}
								</span>
								{plan.sub ? (
									<span className="pb-1 text-sm text-muted-foreground">
										{plan.sub}
									</span>
								) : null}
							</div>

							<button
								className={`mt-6 inline-flex w-full items-center justify-center rounded-full px-4 py-3 text-sm font-medium transition-opacity ${
									plan.highlight
										? "bg-primary text-primary-foreground hover:opacity-90"
										: "border border-border bg-background text-foreground hover:bg-muted/60"
								}`}
								onClick={() => {
									if (plan.name === "Prime") {
										void handleCheckout("prime");
									}
								}}
								type="button"
							>
								{plan.cta}
							</button>

							<ul className="mt-6 space-y-3 text-sm text-foreground">
								{plan.features.map((feature) => (
									<li key={feature} className="flex items-start gap-3">
										<CheckIcon className="mt-0.5 size-4 text-primary" />
										<span>{feature}</span>
									</li>
								))}
							</ul>
						</div>
					))}
				</div>

				<div className="mt-12 rounded-3xl border border-border/60 bg-card/70 p-6 md:p-8">
					<div className="flex items-center gap-3">
						<div className="flex size-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
							<ZapIcon className="size-5" />
						</div>
						<div>
							<p className="text-sm font-medium uppercase tracking-[0.18em] text-primary/80">
								Included with Prime
							</p>
							<h2 className="text-2xl font-semibold text-foreground">
								Everything you need to stay in flow.
							</h2>
						</div>
					</div>

					<div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
						{features.map((feature) => (
							<div
								key={feature}
								className="rounded-2xl border border-border/60 bg-background/70 p-4"
							>
								<p className="font-medium text-foreground">{feature}</p>
							</div>
						))}
					</div>
				</div>

				<div className="mt-8 text-center">
					<Link
						className="inline-flex items-center rounded-full border border-border bg-background px-5 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted/60"
						href="/"
					>
						Back to chat
					</Link>
				</div>
			</div>
		</main>
	);
}
