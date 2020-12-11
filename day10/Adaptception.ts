const plugIntoSocket = (
    availableAdapters: number[],
    socketStack: number[]
): number[] => {
    const currentJoltage: number = socketStack.length
        ? socketStack[socketStack.length - 1]
        : 0;

    const nextAdapter = availableAdapters
        .slice()
        .filter((a) => a - currentJoltage <= 3 && a - currentJoltage >= 1)
        .sort((a, b) => a - b);

    if (!nextAdapter[0]) {
        return socketStack;
    }

    const newStack = [...socketStack, nextAdapter[0]];
    const leftovers = availableAdapters.slice();
    leftovers.splice(availableAdapters.indexOf(nextAdapter[0]), 1);

    return plugIntoSocket(leftovers, newStack);
};

const partTwo = async () => {
    // const adapters: number[] = [16, 10, 15, 5, 1, 11, 7, 19, 6, 12, 4];
    const adapters: number[] = await Deno.readTextFile('day10/input.txt').then(
        (f: string) =>
            f
                .split('\n')
                .filter((x: string) => x)
                .map((n: string) => Number.parseInt(n, 10))
    );
    const pluggedStack = [
        ...plugIntoSocket(adapters, [0]),
        Math.max(...adapters) + 3,
    ];

    const memo = new Map<number, number>();

    const solve = (idx: number): number => {
        if (!memo.has(idx)) {
            if (idx === pluggedStack.length - 1) {
                memo.set(idx, 1);
            } else {
                let total = 0;
                let neighIdx = idx + 1;
                while (
                    neighIdx < pluggedStack.length &&
                    pluggedStack[neighIdx] - pluggedStack[idx] <= 3
                ) {
                    total += solve(neighIdx);
                    neighIdx++;
                }
                memo.set(idx, total);
            }
        }
        return memo.get(idx)!;
    };
    console.log(`part 2: ${solve(0)}`);
};

const partOne = async () => {
    // const adapters: number[] = [16, 10, 15, 5, 1, 11, 7, 19, 6, 12, 4];
    const adapters: number[] = await Deno.readTextFile('day10/input.txt').then((f: string) =>
        f.split('\n').filter((x: string) => x).map((n: string) => Number.parseInt(n, 10)));

    const pluggedStack = [
        ...plugIntoSocket(adapters, [0]),
        Math.max(...adapters) + 3,
    ];

    const diffs = pluggedStack.reduce(
        (carry, curr, idx, all): [number, number, number] => {
            const diff = all[idx + 1] - curr;
            if (isNaN(diff)) {
                return carry;
            }

            switch (diff) {
                case 1:
                    return [carry[0] + 1, carry[1], carry[2]];
                case 2:
                    return [carry[0], carry[1] + 1, carry[2]];
                case 3:
                    return [carry[0], carry[1], carry[2] + 1];
                default:
                    throw new Error(
                        `In this moment we realized, we fucked up...${diff}`
                    );
            }
        },
        [0, 0, 0] as [number, number, number]
    );
    console.log(`part 1: ${diffs[0] * diffs[2]}`);
};

partOne();
partTwo();
