export type Data = {
  position: number;
};

export const getData: (length: number) => Data[] = (length: number) => {
  return Array.from({
    length,
  }).map((_, i) => {
    return {
      position: i + 1,
    };
  });
};
