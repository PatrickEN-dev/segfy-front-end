import {
  FormCardSkeleton,
  PageHeaderSkeleton,
} from "@/components/shared/page-skeleton";

export default function NewPolicyLoading() {
  return (
    <>
      <PageHeaderSkeleton withBreadcrumbs />
      <FormCardSkeleton />
    </>
  );
}
