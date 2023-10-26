import fs from 'fs';
import inquirer from 'inquirer';

const dbFile = 'users.txt';

const mainMenu = async () => {
  const { action } = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'Choose an action:',
      choices: ['Create a user', 'Search for a user', 'Exit'],
    },
  ]);

  switch (action) {
    case 'Create a user':
      await createUser();
      break;
    case 'Search for a user':
      await searchUser();
      break;
    case 'Exit':
      console.log('Goodbye!');
      process.exit(0);
  }
};

const createUser = async () => {
  const userData = await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'Enter the user\'s name (Press Enter to stop adding users):',
    },
    {
      type: 'list',
      name: 'gender',
      message: 'Choose the user\'s gender:',
      choices: ['Male', 'Female', 'Other'],
      when: (answers) => answers.name !== '',
    },
    {
      type: 'number',
      name: 'age',
      message: 'Enter the user\'s age:',
      when: (answers) => answers.name !== '',
    },
  ]);

  if (userData.name) {
    saveUser(userData);
    console.log('User added successfully!');
  }

  mainMenu();
};

const saveUser = (user) => {
  const users = loadUsers();
  users.push(user);
  fs.writeFileSync(dbFile, JSON.stringify(users, null, 2));
};

const loadUsers = () => {
  try {
    const data = fs.readFileSync(dbFile, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

const searchUser = async () => {
  const nameToSearch = await inquirer.prompt([
    {
      type: 'input',
      name: 'searchName',
      message: 'Enter the name of the user you want to search:',
    },
  ]);

  const users = loadUsers();
  const foundUsers = users.filter((user) =>
    user.name.toLowerCase() === nameToSearch.searchName.toLowerCase()
  );

  if (foundUsers.length === 0) {
    console.log('User not found in the database.');
  } else {
    console.log('Found user(s):');
    foundUsers.forEach((user) => {
      console.log(`Name: ${user.name}`);
      console.log(`Gender: ${user.gender}`);
      console.log(`Age: ${user.age}`);
      console.log('-------------------');
    });
  }

  mainMenu();
};

mainMenu();
