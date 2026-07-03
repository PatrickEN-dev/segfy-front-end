import {
  PageHeaderSkeleton,
  TableCardSkeleton,
} from "@/components/shared/page-skeleton";

export default function PoliciesLoading() {
  return (
    <>
      <PageHeaderSkeleton withAction />
      <TableCardSkeleton rows={8} withToolbar />
    </>
  );
}
