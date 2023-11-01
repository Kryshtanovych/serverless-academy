const fs = require('fs');

const originalDataText = fs.readFileSync('original.json', 'utf-8');

const cleanedDataText = originalDataText.replace(/\*\*/g, '');

const originalData = JSON.parse(cleanedDataText);

const userDataMap = new Map();

originalData.forEach(vacation => {
  const userId = vacation.user._id;
  const userName = vacation.user.name;

  if (!userDataMap.has(userId)) {
    userDataMap.set(userId, {
      userId,
      userName,
      vacations: [],
    });
  }

  const vacationData = {
    startDate: vacation.startDate,
    endDate: vacation.endDate,
  };

  userDataMap.get(userId).vacations.push(vacationData);
});

const transformedData = Array.from(userDataMap.values());

fs.writeFileSync('transformed.json', JSON.stringify(transformedData, null, 2));

console.log('Transformation complete.');
