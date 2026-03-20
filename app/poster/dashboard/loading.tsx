import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function Loading() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-end justify-between mb-10">
        <div className="space-y-2">
          
          <Skeleton className="h-15 w-36" />
        </div>
        <Skeleton className="h-7 w-20" />
      </div>
      <div className="space-y-4 ">
        {[1, 2, 3,4,5,6].map((i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-19 w-48" />
            </CardHeader>
            <CardContent className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-6 w-27" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}