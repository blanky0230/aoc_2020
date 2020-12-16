interface Adapter {
    mem: Map<number, string>;
    currentMask: string;
}

const setMask = (mask: string) => (adapter: Adapter): Adapter => ({
    ...adapter,
    currentMask: mask,
});

const writeMem = (address: number, value: string) => (
    adapter: Adapter
): Adapter => {
    return {
        ...adapter,
        mem: adapter.mem.set(
            address,
            value
                .split('')
                .map((char, idx) => {
                    if (adapter.currentMask[idx] !== 'X') {
                        return adapter.currentMask[idx];
                    }
                    return char;
                })
                .join('')
        ),
    };
};

const writeMemTwo = (address: number, value: string) => (
    adapter: Adapter
): Adapter => {
    return {
        ...adapter,
        mem: adapter.mem.set(
            address,
            value
                .split('')
                .map((char, idx) => {
                    if (adapter.currentMask[idx] === '0') {
                        return char;
                    }
                    return adapter.currentMask[idx];
                })
                .join('')
        ),
    };
};

const readInstruction = (input: string) => {
    const [left, right] = input.split('=').map((x: string) => x.trim());

    if (left === 'mask') {
        return setMask(right);
    }
    let matches = /mem\[(\d+)\]/.exec(left);
    return writeMem(
        parseInt(matches![1], 10),
        (parseInt(right) >> 0).toString(2).padStart(36, '0')
    );
};

const readInstructionPartTwo = (input: string) => {
    const [left, right] = input.split('=').map((x: string) => x.trim());

    if (left === 'mask') {
        return setMask(right);
    }
    let matches = /mem\[(\d+)\]/.exec(left);
    return writeMemTwo(
        parseInt(matches![1], 10),
        (parseInt(right) >> 0).toString(2).padStart(36, '0')
    );
};

const partOne = async () => {
    const input = await Deno.readTextFile('day14/input.txt').then(
        (f: string) => f
    );

    // const testinput = `mask = XXXXXXXXXXXXXXXXXXXXXXXXXXXXX1XXXX0X
    // mem[8] = 11
    // mem[7] = 101
    // mem[8] = 0`;

    const thunks = input.split('\n').map(readInstruction);
    const adapter = thunks.reduce(
        (a: Adapter, t: (x: Adapter) => Adapter) => t(a),
        {
            mem: new Map<number, string>(),
            currentMask: '',
        } as Adapter
    );

    let sum = 0;
    adapter.mem.forEach((element: string) => {
        sum += parseInt(element, 2);
    });
    console.log(sum);
};

const partTwo = async () => {
    const input = await Deno.readTextFile('day14/input.txt').then(
        (f: string) => f
    );

    // const testinput = `mask = XXXXXXXXXXXXXXXXXXXXXXXXXXXXX1XXXX0X
    // mem[8] = 11
    // mem[7] = 101
    // mem[8] = 0`;

    const thunks = input.split('\n').map(readInstructionPartTwo);
    const adapter = thunks.reduce(
        (a: Adapter, t: (x: Adapter) => Adapter) => t(a),
        {
            mem: new Map<number, string>(),
            currentMask: '',
        } as Adapter
    );
    console.log(adapter.mem);
};

partOne();
partTwo();
export {};
