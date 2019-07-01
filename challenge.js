const fs = require('fs')
const endOfLine = require('os').EOL;
const shuffle = require('knuth-shuffle').knuthShuffle;


/**
 * Wraps readfile in a promise
 * @param {String} fileName
 * @returns {Promise<String>} 
 */
const readFile = (fileName) => {
    return new Promise((res, rej) => {
        fs.readFile(fileName, "utf8", (err, data) => {
            if (err) rej(err)
            else res(data)
        })
    })
}

const isEvenIndex = (element, index) => index % 2 === 0;
const isUnique = (value, index, self) => self.indexOf(value) === index

// takes in a file name
const getNames = async (fileName) => {
    let names = []
    // waits for the file to be read
    let arr = await readFile(fileName)
    // splits file on new line and filters out everyother line, takes that 
    // first and second index which contains the first and last name
    arr.split(endOfLine).filter(isEvenIndex).forEach(line => {
        let lastName = line.split(' ')[0]
        let firstName = line.split(' ')[1]
        names.push([lastName, firstName])
    })
    return names
}
// takes in a file name and runs it through the readFile function
const unquieFullNames = async (fileName) => {
    let namesArr = await getNames(fileName)
    // finds if the names are unique
    let fullNames = namesArr.filter(isUnique)
    return fullNames.length
}
// takes in a file name and runs it through the readFile function
const unquieLastNames = async (fileName) => {
    let lastNames = []
    let arr = await readFile(fileName)
    // get the first index out of the file which is the last names
    arr.split(endOfLine).filter(isEvenIndex).forEach(line => {
        let lastName = line.split(' ')[0]
        lastNames.push(lastName)
    })
    // finds if they are unique
    lastNames = lastNames.filter(isUnique)
    return lastNames.length
}
// take in a file name and runs it through the readFile function
const unquieFirstNames = async (fileName) => {
    let firstNames = []
    let arr = await readFile(fileName)
    // gets the second index out of the file which is the first name
    arr.split(endOfLine).filter(isEvenIndex).forEach(line => {
        let firstName = line.split(' ')[1]
        firstNames.push(firstName)
    })
    // finds if they are unique
    firstNames = firstNames.filter(isUnique)
    return firstNames.length
}

// take in a file name and gets the last names out of it
const commonLastNames = async (fileName) => {
    let commonLastName = {}
    let lastNames = []
    let arr = await readFile(fileName)
    arr.split(endOfLine).filter(isEvenIndex).forEach(line => {
        let lastName = line.split(' ')[0]
        lastNames.push(lastName)
    })
    // counts the number of times you encounter a name and pushed it to an object
    lastNames.forEach(name => {
        if (!commonLastName[name]) {
            commonLastName[name] = 1
        } else {
            commonLastName[name]++
        }
    })
    let commonLastNameArr = []
    for (let names in commonLastName) {
        commonLastNameArr.push([names, commonLastName[names]])
    }
    // sorts object
    commonLastNameArr = commonLastNameArr.sort((a, b) => {
        return a[1] - b[1]
    })
    // returns the last 10 which are the highest common names
    return commonLastNameArr.slice(-10)
}
// takes in a file and gives you the first names
const commonFirstNames = async (fileName) => {
    let commonFirstName = {}
    let firstNames = []
    let arr = await readFile(fileName)
    arr.split(endOfLine).filter(isEvenIndex).forEach(line => {
        let firstName = line.split(' ')[1]
        firstNames.push(firstName)
    })
    // counts how many times you encounter a name and pushes it to an object
    firstNames.forEach(name => {
        if (!commonFirstName[name]) {
            commonFirstName[name] = 1
        } else {
            commonFirstName[name]++
        }
    })
    let commonFirstNameArr = []
    for (let names in commonFirstName) {
        commonFirstNameArr.push([names, commonFirstName[names]])
    }
    // sorts the object
    commonFirstNameArr = commonFirstNameArr.sort((a, b) => {
        return a[1] - b[1]
    })
    // returns the last 10 which are the highest count
    return commonFirstNameArr.slice(-10)
}
// uses the getNames function to get all the names
const completelyUniqueNames = async () => {
    let fullNames = await getNames()
    const uniqueNames = fullNames.reduce((accum, current) => {
        // should only max out at 25 items
        const hitMaxSize = accum.length >= 25;
        if(hitMaxSize) {
            return accum;
        }
        // destructors the first and last name 
        const [lastName, firstName] = current
        let hasMatch = false
        // compairs the name to the accum to see if you have encountered the name before
        for (let i = 0; i < accum.length; i++) {
            const [accumLast, accumFrist] = accum[i]
            if (firstName === accumFrist || lastName == accumLast) {
                hasMatch = true
                break
            }
        }
        // if the name has no match push it to the accum
        if (!hasMatch) {
            accum.push(current)
        }
        return accum
    }, [])
    return uniqueNames
}
// takes in the names from completelyUniqueNames
const modifiedUniqueNames = async () => {
    let unquieFullNames = await completelyUniqueNames()
    let lastNames = []
    let firstNames = []
    let shuffledNames = []
    unquieFullNames.forEach(name => {
        lastNames.push(name[0])
        firstNames.push(name[1])
    })
    // uses knuth-shuffle npm package to shuffle first names
    firstNames = shuffle(firstNames)
    // merged the two arrays together to give an array of new first and last names
    for (let i = 0; i <= lastNames.length; i++) {
        shuffledNames.push([lastNames[i], firstNames[i]])
    }
    shuffledNames.pop()
    return shuffledNames
}