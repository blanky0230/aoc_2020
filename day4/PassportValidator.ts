import { readFileSync } from "fs";

const keys = ['byr','iyr', 'eyr', 'hgt', 'hcl', 'ecl', 'pid', 'cid'];

export const validatePassportRaw = (input: string): boolean => {
    const notFoundKeys = keys.filter((k) => !(new RegExp(`${k}:`, 'gm').test(input)));
    return notFoundKeys.length === 0 ? true : notFoundKeys.length === 1 && notFoundKeys[0] === 'cid';
}

const birthYear = (input: string): boolean => {
    const matches = input.match(/byr:(\d+)/);
    if (matches === null) {
        return false;
    }
    const numeric = parseInt(matches[1], 10);
    return  numeric >= 1920 && numeric <= 2002;
}

const issueYear = (input: string): boolean => {
    const matches = input.match(/iyr:(\d+)/);
    if (matches === null) {
        return false;
    }
    const numeric = parseInt(matches[1], 10);
    return  numeric >= 2010 && numeric <= 2020;
}

const expirationYear = (input: string): boolean => {
    const matches = input.match(/eyr:(\d+)/);
    if (matches === null) {
        return false;
    }
    const numeric = parseInt(matches[1], 10);
    return  numeric >= 2020 && numeric <= 2030;
}

const height = (input: string): boolean => {
    const matches = input.match(/hgt:(\d+)(cm|in)/);
    if (matches === null) {
        return false;
    }
    const numeric = parseInt(matches[1], 10);
    console.log(matches[2]);
    const min = matches[2] === 'cm' ? 150 : 59;
    const max = matches[2] === 'cm' ? 193 : 76;
    return  numeric >= min && numeric <= max;

}

const hairColor = (input: string): boolean => /hcl:#([0-9]|[a-f]){6}/gm.test(input);

const eyeColor = (input: string): boolean => {
    const matches = input.match(/ecl:(\w{3})/);
    if (matches === null) {
        return false;
    }
    return ['amb', 'blu', 'brn', 'grn', 'gry', 'hzl', 'oth'].includes(matches[1])
}

const pid = (input:string): boolean => { 
    return (/pid:\d{9}/gm.test(input));
}


export const validatePassport = (input: string): boolean =>  
    [birthYear, issueYear, expirationYear, height, hairColor,  eyeColor,  pid].map(fn => fn(input)).every(t => t);

    //      part2 += \
    // re.match('^[0-9]{4}$', byr) != None and 1920 <= int(byr) <= 2002 and \
    // re.match('^[0-9]{4}$', iyr) != None and 2010 <= int(iyr) <= 2020 and \
    // re.match('^[0-9]{4}$', eyr) != None and 2020 <= int(eyr) <= 2030 and \
    // re.match('^((1([5-8][0-9]|9[0-3]))cm|(59|6[0-9]|7[0-6])in)$', hgt) != None and \
    // re.match('^#[0-9a-z]{6}$', hcl) != None and \
    // re.match('^(amb|blu|brn|gry|grn|hzl|oth)$', ecl) != None and \
    // re.match('^[0-9]{9}$', pid) != None
// return part2


const main = () => {
    const data = readFileSync('./input.txt', 'utf-8').split(new RegExp('^$', 'gm'));
    const valid = data.filter(validatePassportRaw);
    // console.log(valid.length);
    console.log(
        valid.filter(validatePassport).length
        // );

}

main();