const fs = require('fs');
const readline = require('readline');
const path = require('path');

const directoryPath = 'D:/words/';

function getAllTextFilesInDirectory(directoryPath) {
    const fileNames = fs.readdirSync(directoryPath);
    const textFiles = fileNames.filter((fileName) => fileName.endsWith('.txt'));
    return textFiles.map((fileName) => path.join(directoryPath, fileName));
}

const filePaths = getAllTextFilesInDirectory(directoryPath);

async function readLines(filePath) {
    return new Promise((resolve, reject) => {
        const usernames = new Set();
        const fileStream = fs.createReadStream(filePath);
        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity,
        });

        rl.on('line', (line) => {
            const words = line.split(' ');
            for (const word of words) {
                usernames.add(word);
            }
        });

        rl.on('close', () => {
            resolve(usernames);
        });
    });
}

async function main() {
    const start = Date.now();

    const [uniqueCount, commonCount, atLeastTenCount] = await Promise.all([
        uniqueValues(),
        existInAllFiles(),
        existInAtleastTen(),
    ]);

    const end = Date.now();
    console.log('Total elapsed time: ' + (end - start) + 'ms');

    console.log('Unique Usernames:', uniqueCount);
    console.log('Usernames in All Files:', commonCount);
    console.log('Usernames in At Least 10 Files:', atLeastTenCount);
}

async function uniqueValues() {
    const allUsernames = new Set();
    const uniquePromises = filePaths.map(async (filePath) => {
        const usernames = await readLines(filePath);
        usernames.forEach((username) => allUsernames.add(username));
    });
    await Promise.all(uniquePromises);
    return allUsernames.size;
}

async function existInAllFiles() {
    const commonUsernamesPromises = filePaths.map(async (filePath) => {
        const usernames = await readLines(filePath);
        return new Set(usernames);
    });
    const usernameSets = await Promise.all(commonUsernamesPromises);
    const usernamesInFirstFile = usernameSets[0];
    for (const usernameSet of usernameSets.slice(1)) {
        usernamesInFirstFile.forEach((username) => {
            if (!usernameSet.has(username)) {
                usernamesInFirstFile.delete(username);
            }
        });
    }
    return usernamesInFirstFile.size;
}

async function existInAtleastTen() {
    const usernameCounts = new Map();
    for (const filePath of filePaths) {
        const usernames = await readLines(filePath);
        for (const username of usernames) {
            if (!usernameCounts.has(username)) {
                usernameCounts.set(username, 1);
            } else {
                usernameCounts.set(username, usernameCounts.get(username) + 1);
            }
        }
    }
    const filteredUsernames = [...usernameCounts.entries()].filter(
        ([_, count]) => count >= 10
    );
    return filteredUsernames.length;
}

main();
