import { z } from "zod";

const isAbsoluteHttp = (v: string) => /^https?:\/\//i.test(v);
const isRelativePath = (v: string) => v.startsWith("/");

const envSchema = z.object({
  NEXT_PUBLIC_API_BASE_URL: z
    .string()
    .min(1, "NEXT_PUBLIC_API_BASE_URL is required")
    .refine(
      (v) => isAbsoluteHttp(v) || isRelativePath(v),
      "NEXT_PUBLIC_API_BASE_URL must be an absolute URL (http/https) or a relative path (starting with '/').",
    ),
});

const parsed = envSchema.safeParse({
  NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

if (!parsed.success) {
  const flat = parsed.error.flatten().fieldErrors;
  throw new Error(`Invalid environment variables:\n${JSON.stringify(flat, null, 2)}`);
}

export const env = parsed.data;
