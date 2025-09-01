import { z } from 'zod';

// OpenAI Chat Completions API schema
export const chatCompletionsSchema = z.object({
  model: z.string().min(1),
  messages: z.array(z.object({
    role: z.enum(['system', 'user', 'assistant', 'tool']),
    content: z.union([
      z.string(),
      z.array(z.object({
        type: z.enum(['text', 'image_url']),
        text: z.string().optional(),
        image_url: z.object({
          url: z.string().url(),
          detail: z.enum(['auto', 'low', 'high']).optional()
        }).optional()
      }))
    ]),
    name: z.string().optional(),
    tool_call_id: z.string().optional(),
    tool_calls: z.array(z.object({
      id: z.string(),
      type: z.literal('function'),
      function: z.object({
        name: z.string(),
        arguments: z.string()
      })
    })).optional()
  })).min(1),
  stream: z.boolean().optional(),
  temperature: z.number().min(0).max(2).optional(),
  top_p: z.number().min(0).max(1).optional(),
  n: z.number().int().min(1).max(128).optional(),
  stop: z.union([z.string(), z.array(z.string())]).optional(),
  max_tokens: z.number().int().min(1).optional(),
  presence_penalty: z.number().min(-2).max(2).optional(),
  frequency_penalty: z.number().min(-2).max(2).optional(),
  logit_bias: z.record(z.string(), z.number()).optional(),
  user: z.string().optional(),
  response_format: z.object({
    type: z.enum(['text', 'json_object']).optional(),
    json_schema: z.object({
      name: z.string(),
      description: z.string().optional(),
      schema: z.record(z.string(), z.any()).optional(),
      strict: z.boolean().optional()
    }).optional()
  }).optional()
});

// OpenAI Embeddings API schema
export const embeddingsSchema = z.object({
  model: z.string().min(1),
  input: z.union([z.string(), z.array(z.string())]),
  encoding_format: z.enum(['float', 'base64']).optional(),
  dimensions: z.number().int().min(1).optional(),
  user: z.string().optional()
});

// OpenAI Models API schema (no input validation needed for GET request)
export const modelsSchema = z.object({});

// Validation function
export function validateRequest(request, schema) {
  try {
    const validatedData = schema.parse(request);
    return { success: true, data: validatedData };
  } catch (error) {
    return { success: false, error: error.errors };
  }
}