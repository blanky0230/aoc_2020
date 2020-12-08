import { readFileSync } from 'fs';

type opcode = 'nop' | 'acc' | 'jmp';
type operation = [opcode, number];
type ROM = Array<operation>;

interface Device {
    accumulator: number;
    instructionPtr: number;
    rom: ROM;
}

const startDevice = (rom: Array<operation>): Device => ({
    accumulator: 0,
    instructionPtr: 0,
    rom,
});

const cycle = (device: Device): Device => {
    const instruction = device.rom[device.instructionPtr];
    switch (instruction[0]) {
        case 'nop':
            return { ...device, instructionPtr: device.instructionPtr + 1 };
        case 'acc':
            return {
                ...device,
                accumulator: device.accumulator + instruction[1],
                instructionPtr: device.instructionPtr + 1,
            };
        case 'jmp':
            return {
                ...device,
                instructionPtr: device.instructionPtr + instruction[1],
            };
        default:
            throw new Error(instruction[0]);
    }
};

const buildRom = (input: string): ROM =>
    input
        .split('\n')
        .filter((l) => l)
        .map((line) => {
            const rawop = line.split(' ');
            return [rawop[0], Number.parseInt(rawop[1], 10)] as operation;
        });

const rom = buildRom(readFileSync('input.txt', 'utf-8').trim());

const playPartOne = (rom: ROM): Device => {
    let device = startDevice(rom);
    let visitedInstructions: number[] = [];
    while (device.instructionPtr < rom.length) {
        device = cycle(device);
        if (visitedInstructions.includes(device.instructionPtr)) {
            return device;
        }
        visitedInstructions.push(device.instructionPtr);
    }
    return device;
};

const flipOpcode = (original: opcode): opcode => {
    switch (original) {
        case 'acc':
            return original;
        case 'nop':
            return 'jmp';
        case 'jmp':
            return 'nop';
    }
};

const flipInstruction = (original: operation): operation => [
    flipOpcode(original[0]),
    original[1],
];

const mutateRom = (original: ROM, atIndex: number): ROM => {
    const newRom = original.slice();
    newRom[atIndex] = flipInstruction(original[atIndex]);
    return newRom;
};

const bruteForceRoms = (originalRom: ROM): Array<ROM> =>
    Array.from(Array(rom.length - 1).keys()).map((n: number) =>
        mutateRom(originalRom, n)
    );

console.log(playPartOne(rom).accumulator);
console.log(
    bruteForceRoms(rom)
        .map((rom) => playPartOne(rom))
        .filter((d) => d.instructionPtr === rom.length)[0].accumulator
);
