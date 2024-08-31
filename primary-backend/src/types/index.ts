import { z } from "zod";

export const SignupSchema = z.object({
  email: z.string().min(5),
  password: z.string().min(6),
  name: z.string(),
});

export const SigninSchema = z.object({
  email: z.string().min(5),
  password: z.string().min(6),
});

export const zapCreateSchema = z.object({
  name: z.string(),
  availableTriggerId: z.string(),
  triggerMetadata: z.any().optional(),
  actions: z.array(
    z.object({
      availableActionId: z.string(),
      actionMetadata: z.any().optional(),
    })
  ),
});
