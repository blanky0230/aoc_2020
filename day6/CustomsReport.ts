import { readFileSync } from 'fs';

export const unanymousAnswersFromGroup = (input: string): string[] =>
    input
        .split('\n')
        .map((l) => l.trim().split(''))
        .reduce(
            (carry: string[], current: string[], _, all: string[][]) => [
                ...carry,
                ...current.filter(
                    (c) => all.every((l) => l.includes(c)) && !carry.includes(c)
                ),
            ],
            []
        );

export const uniqueAnswersFromGroup = (input: string): string[] =>
    input
        .split('\n')
        .map((l) => l.trim().split(''))
        .reduce(
            (carry: string[], current: string[]) => [
                ...carry,
                ...current.filter((c) => !carry.includes(c)),
            ],
            []
        );

const main = () => {
    const data = readFileSync('input.txt', 'utf-8').split('\n\n');
    const part1 = data
        .map((g) => uniqueAnswersFromGroup(g).length)
        .reduce((carry, curr) => carry + curr);
    const part2 = data
        .map((g) => unanymousAnswersFromGroup(g).length)
        .reduce((carry, curr) => carry + curr);
    console.log(part1);
    console.log(part2);
};
main();
