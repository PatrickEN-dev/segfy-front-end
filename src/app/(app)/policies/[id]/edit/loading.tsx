import {
  FormCardSkeleton,
  PageHeaderSkeleton,
} from "@/components/shared/page-skeleton";

export default function EditPolicyLoading() {
  return (
    <>
      <PageHeaderSkeleton withBreadcrumbs />
      <FormCardSkeleton fields={8} />
    </>
  );
}
