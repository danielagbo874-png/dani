"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";

import { saveUserPreferences } from "@/app/(chat)/actions";
import { toast } from "@/components/chat/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type AssistantStyle =
  | "Clear & direct"
  | "Warm & conversational"
  | "Deep reasoning"
  | "Executive brief";

type FocusArea =
  | "Writing & ideation"
  | "Planning & strategy"
  | "Execution & ops"
  | "Learning & research";

type SettingsState = {
  displayName: string;
  assistantStyle: AssistantStyle;
  focusArea: FocusArea;
};

const SETTINGS_STORAGE_KEY = "nexa-ai-settings";

const defaultSettings: SettingsState = {
  displayName: "",
  assistantStyle: "Clear & direct",
  focusArea: "Writing & ideation",
};

export default function SettingsPage() {
  const { data: session, status, update } = useSession();
  const [settings, setSettings] = useState<SettingsState>(defaultSettings);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const fallbackName =
      session?.user?.name ||
      session?.user?.email?.split("@")[0] ||
      "Your account";

    const savedSettings = window.localStorage.getItem(SETTINGS_STORAGE_KEY);

    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings) as Partial<SettingsState>;
        setSettings({
          ...defaultSettings,
          ...parsed,
          displayName: parsed.displayName || fallbackName,
        });
      } catch {
        setSettings((prev) => ({ ...prev, displayName: fallbackName }));
      }
    } else {
      setSettings((prev) => ({ ...prev, displayName: fallbackName }));
    }

    setIsHydrated(true);
  }, [session?.user?.email, session?.user?.name]);

  const updateSetting = <Key extends keyof SettingsState>(
    key: Key,
    value: SettingsState[Key]
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const finalSettings = {
      ...defaultSettings,
      ...settings,
      displayName: settings.displayName.trim() || "Your account",
    };

    const fd = new FormData();
    fd.set("displayName", finalSettings.displayName);
    fd.set("assistantStyle", finalSettings.assistantStyle);
    fd.set("focusArea", finalSettings.focusArea);

    window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(finalSettings));
    setSettings(finalSettings);

    const result = await saveUserPreferences(fd);

    if (result.ok) {
      await update({
        name: finalSettings.displayName,
      });
      toast({
        type: "success",
        description: "Your Nexa preferences have been saved.",
      });
      return;
    }

    toast({
      type: "error",
      description: result.error || "Something went wrong while saving.",
    });
  };

  const accountName =
    session?.user?.name || session?.user?.email || "Your account";

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 py-16">
      <div className="w-full max-w-3xl rounded-3xl border border-border/60 bg-card/80 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.08)] backdrop-blur-sm">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-primary/80">
          Personal settings
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground">
          Customize Nexa AI
        </h1>
        <p className="mt-3 text-muted-foreground">
          Tune your assistant to sound like you, focus on what matters most, and keep your workspace feeling personal.
        </p>

        <form className="mt-8 space-y-6" onSubmit={handleSave}>
          <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
            <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
              Account
            </p>
            <p className="mt-2 text-lg font-medium text-foreground">{accountName}</p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground" htmlFor="display-name">
                Display name
              </label>
              <Input
                id="display-name"
                placeholder="Your name"
                value={settings.displayName}
                onChange={(event) =>
                  updateSetting("displayName", event.target.value)
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground" htmlFor="assistant-style">
                Assistant style
              </label>
              <Select
                value={settings.assistantStyle}
                onValueChange={(value) =>
                  updateSetting("assistantStyle", value as AssistantStyle)
                }
              >
                <SelectTrigger className="w-full" id="assistant-style">
                  <SelectValue placeholder="Select a style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Clear & direct">Clear & direct</SelectItem>
                  <SelectItem value="Warm & conversational">
                    Warm & conversational
                  </SelectItem>
                  <SelectItem value="Deep reasoning">Deep reasoning</SelectItem>
                  <SelectItem value="Executive brief">Executive brief</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-foreground" htmlFor="focus-area">
                Default focus
              </label>
              <Select
                value={settings.focusArea}
                onValueChange={(value) =>
                  updateSetting("focusArea", value as FocusArea)
                }
              >
                <SelectTrigger className="w-full" id="focus-area">
                  <SelectValue placeholder="Choose a focus" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Writing & ideation">
                    Writing & ideation
                  </SelectItem>
                  <SelectItem value="Planning & strategy">
                    Planning & strategy
                  </SelectItem>
                  <SelectItem value="Execution & ops">Execution & ops</SelectItem>
                  <SelectItem value="Learning & research">
                    Learning & research
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
            <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
              Workspace preview
            </p>
            <div className="mt-3 grid gap-4 md:grid-cols-3">
              <div>
                <p className="text-xs text-muted-foreground">Style</p>
                <p className="mt-1 font-medium text-foreground">
                  {settings.assistantStyle}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Focus</p>
                <p className="mt-1 font-medium text-foreground">
                  {settings.focusArea}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Name</p>
                <p className="mt-1 font-medium text-foreground">
                  {settings.displayName || "Your account"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Link
              className="inline-flex items-center justify-center rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted/60"
              href="/upgrade"
            >
              View plans
            </Link>
            <Button
              className="rounded-full"
              disabled={!isHydrated || status === "loading"}
              type="submit"
            >
              Save preferences
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}
