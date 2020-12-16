export {};

const tick = (time: number, pool: number[]): number[] =>
    pool.filter((p) => time % p === 0);

const partOne = async () => {
    // const earliestTime = 939;
    // const busses: number[] = '7,13,x,x,59,x,31,19'
    //     .split(',')
    //     .filter((x) => x !== 'x')
    //     .map((x) => Number.parseInt(x, 10));

    const input: [string, string] = await Deno.readTextFile(
        'day13/input.txt'
    ).then((f: string) => f.split('\n') as [string, string]);

    const earliestTime = Number.parseInt(input[0], 10);
    const busses: number[] = input[1]
        .split(',')
        .filter((x) => x !== 'x')
        .map((x) => Number.parseInt(x, 10));

    if (!earliestTime || !busses) {
        throw new Error();
    }

    let time = earliestTime;
    let possibleBusses: number[] = [];

    while (!possibleBusses.length) {
        possibleBusses = tick(time, busses);
        time++;
    }

    const waitTime = time - earliestTime - 1;
    console.log(waitTime);
    console.log(waitTime * possibleBusses[0]);
};

const partTwo = async () => {
    const earliestTime = 939;
    const busses: Array<number> = '7,13,x,x,59,x,31,19'
        .split(',')
        .filter((x) => x !== 'x')
        .map((x) => ('x' === x ? 0 : Number.parseInt(x, 10)))
        .map(BigInt);

    // const input: [string, string] = await Deno.readTextFile(
    //     'day13/input.txt'
    // ).then((f: string) => f.split('\n') as [string, string]);
    const multiplativeInverse = (n: number, b: number): number => {
        let b1 = b;
        let b0 = b;
        let [x0, x1] = [0, 1];
        if (b === 1) {
            return 1;
        }
        let a = n;
        let q;
        while (a > 1) {
            q = Math.floor(a / b);
            [a, b] = [b, a % b];
            [x0, x1] = [x1 - q * x0, x0];
        }
        if (x1 < 0) {
            x1 += b0;
        }
        return x1;
    };

    const chineseRemainder = (n: number, a: number[]): number => {
        let sum = 0;
        let product = a.reduce((carry, current) => carry * current, 1);
    };

    // const earliestTime = Number.parseInt(input[0], 10);
    // const busses: number[] = input[1]
    //     .split(',')
    //     .filter((x) => x !== 'x')
    //     .map((x) => Number.parseInt(x, 10));
};

partOne();
partTwo();
