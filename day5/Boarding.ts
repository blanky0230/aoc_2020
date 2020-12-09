import { readFileSync } from 'fs';

export const convertToBinary = (input: string) =>
    parseInt(
        input
            .split('')
            .map((c) => (c === 'F' || c === 'L' ? 0 : 1))
            .join(''),
        2
    );

const main = () => {
    const input = readFileSync('input.txt', 'utf-8').split('\n');
    const ids = input.map(convertToBinary);
    console.log(Math.max(...ids));
    ids.sort((a, b) => a - b);
    const myId = ids.reduce(
        (carry: number | null, _, currIdx, all) =>
            carry !== null
                ? carry
                : all[currIdx + 1] - all[currIdx] > 1
                ? all[currIdx] + 1
                : carry,
        null
    );
    console.log(myId);
};

main();
