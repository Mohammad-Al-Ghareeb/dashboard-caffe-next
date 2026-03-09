import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <Card className="border-rose-300/60 text-center dark:border-rose-900/70">
      <ExclamationTriangleIcon className="mx-auto h-9 w-9 text-rose-500" />
      <h3 className="mt-3 text-lg font-semibold text-slate-900 dark:text-slate-100">
        Something went wrong
      </h3>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
        {message}
      </p>
      {onRetry ? (
        <Button className="mt-4" onClick={onRetry}>
          Retry
        </Button>
      ) : null}
    </Card>
  );
}
