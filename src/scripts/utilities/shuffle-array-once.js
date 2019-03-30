// Take an array and swap only 2 values
export default function shuffleArrayOnce(array) {
  const randomIndex = Math.floor(Math.random() * array.length);
  const shiftedIndex = array.length - 1;
  const tempValue = array[shiftedIndex];

  array[shiftedIndex] = array[randomIndex];
  array[randomIndex] = tempValue;

  return array;
}
