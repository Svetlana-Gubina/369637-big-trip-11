export function shuffle(arr) {
  let j;
  let temp;
  for (let i = arr.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    temp = arr[j];
    arr[j] = arr[i];
    arr[i] = temp;
  }
  return arr;
}

export const getRandomInteger = (min, max) => {
  let rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
};

export const getRandomOfArray = (arr) => {
  return arr[Math.floor(Math.random() * arr.length)];
};

export const getRandomBoolean = () => Boolean(Math.round(Math.random()));
