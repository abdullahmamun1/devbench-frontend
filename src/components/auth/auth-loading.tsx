import { LoaderCircle } from "lucide-react";

export default function AuthLoading({
  label = "Verifying account",
}: {
  label?: string;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
      <div className="flex w-full max-w-md flex-col items-center rounded-2xl border bg-background p-8 text-center shadow-sm">
        {/* Loader */}
        <div className="mb-5 flex size-16 items-center justify-center rounded-full bg-primary/10">
          <LoaderCircle className="size-8 animate-spin text-primary" />
        </div>

        {/* Content */}
        <h1 className="text-lg font-semibold tracking-tight">{label}</h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Please wait while we verify your account.
        </p>
      </div>
    </div>
  );
}
