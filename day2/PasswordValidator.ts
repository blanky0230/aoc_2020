import { readFileSync } from 'fs';

export const isPasswordValid = (check: string, min: number, max: number, password: string): boolean => {
    const foo = password.split('').filter(c => c === check);
    return foo.length >= min && foo.length <= max;
}

export const isCorporatePasswordValid = (check: string, indexA: number, indexB: number, password:string): boolean => {
    return password[indexA-1] === check && password[indexB-1] !== check || password[indexA-1] !== check && password[indexB-1] === check
}

const readInputs = (): Array<{check: string, min: number, max: number, password: string}>  => {
    return readFileSync('./input.txt','utf-8').split('\n').map(line => {
        const matches = (line.match(/(\d{1,})-(\d{1,}) (\w{1}): (\w+)/))
        return {check: matches![3], min: parseInt(matches![1], 10), max: parseInt(matches![2],10), password: matches![4]}
    });

}

const main = () => {
    const all =readInputs();
    const validCnt = all.filter(({check, min, max, password}) => isPasswordValid(check, min, max, password)).length
    const corporate = all.filter(({check, min, max, password}) => isCorporatePasswordValid(check, min, max, password)).length
    console.log(validCnt);
    console.log(corporate);
}
main();