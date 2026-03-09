import { Card } from "@/components/ui/card";

export function LoadingState({ label = "Loading..." }: { label?: string }) {
  return (
    <Card className="animate-pulse">
      <div className="space-y-3">
        <div className="h-4 w-32 rounded bg-slate-200 dark:bg-slate-700" />
        <div className="h-3 w-full rounded bg-slate-200 dark:bg-slate-700" />
        <div className="h-3 w-5/6 rounded bg-slate-200 dark:bg-slate-700" />
        <p className="text-sm text-slate-600 dark:text-slate-300">{label}</p>
      </div>
    </Card>
  );
}
