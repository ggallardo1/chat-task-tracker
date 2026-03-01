import { prisma } from "../lib/prisma";

export const messageRepo = {
  findByHash(hash: string) {
    return prisma.inboundMessage.findUnique({
      where: { messageHash: hash }
    });
  },

  save(hash: string, rawText: string) {
    return prisma.inboundMessage.create({
      data: { messageHash: hash, rawText }
    });
  }
};
