"use client";

import { useRouter } from "next/navigation";
import { RouteModal } from "@/components/shared/route-modal";
import { PolicyForm } from "@/features/policies/components/policy-form";

export default function NewPolicyModal() {
  const router = useRouter();

  return (
    <RouteModal title="Nova apólice" description="Cadastre uma nova apólice de seguro automóvel.">
      <PolicyForm
        mode="create"
        embedded
        onSuccess={() => router.back()}
        onCancel={() => router.back()}
      />
    </RouteModal>
  );
}
