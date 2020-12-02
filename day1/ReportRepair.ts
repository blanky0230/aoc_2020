import fs from 'fs';


export const reportRepair = (input: number[], target = 2020): number => input.filter( (n) => input.includes(target -n)).reduce( (acc, curr) => acc * curr, 1)

export const reportRepairTriple = (input: number[]): number => {
    for(let i = 0; i < input.length; i++) {
        for(let j = 0; j< input.length; j++) {
            if(input.includes(2020 - input[i] - input[j])) {
                return input[i] * input[j] * (2020 - input[i] - input[j])
            }
        }
    }
    throw new Error();
}

const main = () => {
    const inputs = fs.readFileSync('./day1/input.txt', 'utf-8').split('\n').map((x) => parseInt(x, 10));
    console.log(reportRepair(inputs));
    console.log(reportRepairTriple(inputs));

}

main();