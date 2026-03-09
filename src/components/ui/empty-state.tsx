import { InboxIcon } from "@heroicons/react/24/outline";
import { Card } from "@/components/ui/card";

type EmptyStateProps = {
  title: string;
  description: string;
};

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <Card className="text-center">
      <InboxIcon className="mx-auto h-9 w-9 text-slate-400" />
      <h3 className="mt-3 text-lg font-semibold text-slate-900 dark:text-slate-100">
        {title}
      </h3>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
        {description}
      </p>
    </Card>
  );
}
