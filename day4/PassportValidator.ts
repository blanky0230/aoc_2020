import { readFileSync } from 'fs';

const keys = ['byr', 'iyr', 'eyr', 'hgt', 'hcl', 'ecl', 'pid', 'cid'];

export const validatePassportRaw = (input: string): boolean => {
    const notFoundKeys = keys.filter(
        (k) => !new RegExp(`${k}:`, 'gm').test(input)
    );
    return notFoundKeys.length === 0
        ? true
        : notFoundKeys.length === 1 && notFoundKeys[0] === 'cid';
};

const birthYear = (input: string): boolean => {
    const matches = input.match(/byr:(\d+)/);
    if (matches === null) {
        return false;
    }
    const numeric = parseInt(matches[1], 10);
    return numeric >= 1920 && numeric <= 2002;
};

const issueYear = (input: string): boolean => {
    const matches = input.match(/iyr:(\d+)/);
    if (matches === null) {
        return false;
    }
    const numeric = parseInt(matches[1], 10);
    return numeric >= 2010 && numeric <= 2020;
};

const expirationYear = (input: string): boolean => {
    const matches = input.match(/eyr:(\d+)/);
    if (matches === null) {
        return false;
    }
    const numeric = parseInt(matches[1], 10);
    return numeric >= 2020 && numeric <= 2030;
};

const height = (input: string): boolean => {
    const matches = input.match(/hgt:(\d+)(cm|in)/);
    if (matches === null) {
        return false;
    }
    const numeric = parseInt(matches[1], 10);
    console.log(matches[2]);
    const min = matches[2] === 'cm' ? 150 : 59;
    const max = matches[2] === 'cm' ? 193 : 76;
    return numeric >= min && numeric <= max;
};

const hairColor = (input: string): boolean =>
    /hcl:#([0-9]|[a-f]){6}/gm.test(input);

const eyeColor = (input: string): boolean => {
    const matches = input.match(/ecl:(\w{3})/);
    if (matches === null) {
        return false;
    }
    return ['amb', 'blu', 'brn', 'grn', 'gry', 'hzl', 'oth'].includes(
        matches[1]
    );
};

const pid = (input: string): boolean => {
    return /pid:\d{9}/gm.test(input);
};

export const validatePassport = (input: string): boolean =>
    [birthYear, issueYear, expirationYear, height, hairColor, eyeColor, pid]
        .map((fn) => fn(input))
        .every((t) => t);

const main = () => {
    const data = readFileSync('./input.txt', 'utf-8').split(
        new RegExp('^$', 'gm')
    );
    const valid = data.filter(validatePassportRaw);
    console.log(valid.filter(validatePassport).length);
};

main();
