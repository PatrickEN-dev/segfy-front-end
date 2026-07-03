import {
  PageHeaderSkeleton,
  TableCardSkeleton,
} from "@/components/shared/page-skeleton";

export default function ExpiringLoading() {
  return (
    <>
      <PageHeaderSkeleton />
      <TableCardSkeleton rows={5} />
    </>
  );
}
