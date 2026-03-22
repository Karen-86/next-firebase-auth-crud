import { Skeleton } from "@/components/ui/skeleton";

export default function BlogFormSkeleton() {
  return (
    <div className="flex flex-col space-y-3">
      <span className="absolute top-[50%] left-[50%] translate-x-[-50%]  text-xs text-blue-500">
        client loading (blog)...
      </span>
      <Skeleton className="min-h-14 w-full rounded-md" />
      <Skeleton className="min-h-14 w-full rounded-md" />
      <Skeleton className="min-h-14 w-full rounded-md" />
      <Skeleton className="min-h-14 w-full rounded-md" />
      <Skeleton className="min-h-14 w-full rounded-md" />
    </div>
  );
}
