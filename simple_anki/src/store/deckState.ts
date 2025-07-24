export const deck = {
    topic: "Geography",
    created: Date.now(),
    modified: Date.now(),
    id: "1",
    cards: [] as {
      image: string;
      concept: string;
      description: string;
      review: {
        lastReviewed: number;
        nextDue: number;
        interval: number;
        repetition: number;
      };
    }[]
  };