const inputHandler = process.stdin;
const outputHandler = process.stdout;

function getUserInput() {
  outputHandler.write('Enter a few words or numbers separated by a space (or type "exit" to quit): ');
  inputHandler.once('data', function (input) {
    input = input.toString().trim();
    if (input.toLowerCase() === 'exit') {
      process.exit();
    } else {
      processInput(input);
    }
  });
}

function processInput(input) {
  const inputArr = input.split(' ');

  outputHandler.write('What would you like to do with the input?\n');
  outputHandler.write('1. Sort words alphabetically\n');
  outputHandler.write('2. Show numbers from lesser to greater\n');
  outputHandler.write('3. Show numbers from bigger to smaller\n');
  outputHandler.write('4. Display words in ascending order by the number of letters in the word\n');
  outputHandler.write('5. Show only unique words\n');
  outputHandler.write('6. Show only unique values from the set of words and numbers\n');
  outputHandler.write('Enter your choice (1-6): ');

  inputHandler.once('data', function (choice) {
    choice = choice.toString().trim();
    switch (choice) {
      case '1':
        const sortedWords = inputArr.filter(item => isNaN(item)).sort();
        console.log(sortedWords);
        getUserInput();
        break;
      case '2':
        const sortedNumbersAsc = inputArr.filter(item => !isNaN(item)).map(Number).sort((a, b) => a - b);
        console.log(sortedNumbersAsc);
        getUserInput();
        break;
      case '3':
        const sortedNumbersDesc = inputArr.filter(item => !isNaN(item)).map(Number).sort((a, b) => b - a);
        console.log(sortedNumbersDesc);
        getUserInput();
        break;
      case '4':
        const sortedWordsByLength = inputArr.sort((a, b) => a.length - b.length);
        console.log(sortedWordsByLength);
        getUserInput();
        break;
      case '5':
        const uniqueWords = [...new Set(inputArr)];
        console.log(uniqueWords);
        getUserInput();
        break;
      case '6':
        const uniqueValues = [...new Set(inputArr.map(item => isNaN(item) ? item : Number(item)))];
        console.log(uniqueValues);
        getUserInput();
        break;
      default:
        outputHandler.write('Invalid choice. Please enter a valid option (1-6): ');
    }
  });
}

getUserInput();
