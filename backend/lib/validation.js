const { z } = require("zod");

const bidSchema = z.object({
  itemId: z.number().int().positive(),
});

const addItemSchema = z.object({
  nomeProd: z.string().trim().min(1).max(120),
  descricao: z.string().trim().min(1).max(500),
  image: z.string().trim().url().max(2000),
  startAt: z.string().datetime().optional(),
});

module.exports = { bidSchema, addItemSchema };
