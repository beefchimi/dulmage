// Shuffle the order of values in an array
export default function shuffleArray(array) {
  let currentIndex = array.length;
  let randomIndex;
  let tempValue;

  while (currentIndex !== 0) {
    // pick a random element from the array
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    tempValue = array[currentIndex];

    // and swap it with the current element
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = tempValue;
  }

  return array;
}
