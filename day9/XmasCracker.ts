// import { readFileSync } from 'fs';

const isValidInSequence = (
    sequence: Array<number>,
    newNumber: number,
    cursor: number,
    preamble: number
) =>
    sequence
        .slice(cursor - preamble, cursor)
        .filter(
            (v, idx, seq) => seq.includes(newNumber - v) && newNumber - v !== v
        ).length > 0;

const findCorruptedNumber = (
    sequence: Array<number>,
    preamble: number
): number => {
    let idx = preamble;
    while (
        isValidInSequence(sequence, sequence[idx], idx, preamble) &&
        idx < sequence.length - 1
    ) {
        idx++;
    }
    return sequence[idx];
};

const findSumSequence = (originalSequence: Array<number>, preamble: number) => {
    //Huh. I was lucky this worked.
    const corruptNumber = findCorruptedNumber(originalSequence, preamble);
    let start = 0;
    let end = 0;
    let curSum = -1;
    while (curSum !== corruptNumber) {
        curSum = originalSequence
            .slice(start, end)
            .reduce((c, cu) => c + cu, 0);
        if (curSum > corruptNumber) {
            start++;
        } else {
            end++;
        }
    }
    return originalSequence.slice(start, end);
};

const foo = async () => {
    const data = await Deno.readTextFile('day9/input.txt').then((f) =>
        f
            .split('\n')
            .filter((x) => x)
            .map((n) => Number.parseInt(n, 10))
    );
    console.log(findCorruptedNumber(data, 25));
    const part2 = findSumSequence(data, 25).sort((a, b) => a - b);
    console.log(part2[0] + part2[part2.length - 1]);
};

foo();

// const testData = [
//     35,
//     20,
//     15,
//     25,
//     47,
//     40,
//     62,
//     55,
//     65,
//     95,
//     102,
//     117,
//     150,
//     182,
//     127,
//     219,
//     299,
//     277,
//     309,
//     576,
// ];
// console.log(findSumSequence(testData, 5));
