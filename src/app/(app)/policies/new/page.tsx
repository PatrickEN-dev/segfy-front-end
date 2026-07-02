import { PageHeader } from "@/components/layout/page-header";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { PolicyForm } from "@/features/policies/components/policy-form";

export default function NewPolicyPage() {
  return (
    <>
      <PageHeader
        title="Nova apólice"
        description="Cadastre uma nova apólice de seguro automóvel."
        breadcrumbs={
          <Breadcrumbs
            items={[
              { label: "Apólices", href: "/policies" },
              { label: "Nova" },
            ]}
          />
        }
      />
      <PolicyForm mode="create" />
    </>
  );
}
