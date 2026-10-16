import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function FeatureCard({
  id,
  icon: Icon,
  title,
  description,
}: {
  id?: string;
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <Card
      id={id}
      className="h-full transition-[translate,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10 motion-reduce:hover:translate-y-0"
    >
      <CardContent className="space-y-3">
        <div className="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="size-5" />
        </div>
        <h3 className="text-h3 font-semibold">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
