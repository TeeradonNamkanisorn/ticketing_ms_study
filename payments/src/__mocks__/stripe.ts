export const stripe = {
  charges: {
    create: jest.fn().mockResolvedValue({
      id: Math.random() * 1000,
    }),
  },
};
