import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_API_BASE_URL: z
    .string()
    .url("NEXT_PUBLIC_API_BASE_URL must be a valid URL"),
});

const parsed = envSchema.safeParse({
  NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

if (!parsed.success) {
  const flat = parsed.error.flatten().fieldErrors;
  throw new Error(
    `Invalid environment variables:\n${JSON.stringify(flat, null, 2)}`,
  );
}

export const env = parsed.data;
