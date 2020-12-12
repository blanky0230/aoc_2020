type Vector = [number, number];
type SeatState = '.' | '#' | 'L';

interface Seat {
    position: Vector;
    state: SeatState;
}

const seat = (position: Vector, state: SeatState): Seat => ({
    position,
    state,
});

const neighboursSorrounding = (seat: Seat, world: Map<string, Seat>): Seat[] => {
    const neighbours = new Array<Seat>();
    const [centerX, centerY] = seat.position;
    for (let i = centerX - 1; i <= centerX + 1; i++) {
        for (let j = centerY - 1; j <= centerY + 1; j++) {
            const cursor = JSON.stringify([i, j] as Vector);
            const neighbour = world.get(cursor);
            if (
                neighbour?.position === seat.position ||
                neighbour === undefined
            ) {
                continue;
            }
            neighbours.push(neighbour);
        }
    }
    return neighbours;
};

const raycastNeighbours = (seat: Seat, world: Map<string, Seat>): Seat[] => {
    const directions: Vector[] = [
        [1, 0],
        [0, 1],
        [1, 1],
        [-1, 1],
        [1, -1],
        [-1, 0],
        [0, -1],
        [-1, -1],
    ];
    return directions
        .map((d: Vector) => {
            let check = addVectors(seat.position, d);
            let cursor = JSON.stringify(check);
            while (world.has(cursor)) {
                if (world.get(cursor)?.state !== '.') {
                    return world.get(cursor);
                }
                check = addVectors(check, d);
                cursor = JSON.stringify(check);
            }
            return null;
        })
        .filter((n) => n) as Seat[];
};

const addVectors = (vecA: Vector, vecB: Vector): Vector => [
    vecA[0] + vecB[0],
    vecA[1] + vecB[1],
];

const mustToggle = (seat: Seat, world: Map<string, Seat>, neighboursFunc: (seat: Seat, world: Map<string, Seat>) => Seat[], dieThreshold: number): boolean => {
    switch (seat.state) {
        case '.':
            return false;
        case '#':
            return (
                neighboursFunc(seat, world).filter((s) => s.state === '#').length >=
                dieThreshold
            );
        case 'L':
            return (
                neighboursFunc(seat, world).filter((s) => s.state === '#')
                    .length === 0
            );
    }
};

const cellsAsArray = (cellMap: Map<string, Seat>): Seat[] => {
    const result = new Array<Seat>();
    cellMap.forEach((v) => result.push(v));
    return result;
};

const update = (world: Map<string, Seat>, neighboursFunc: (seat: Seat, world: Map<string, Seat>) => Seat[], dieThreshold: number): Map<string, Seat> =>
    cellsAsArray(world)
        .filter((seat) => mustToggle(seat, world, neighboursFunc, dieThreshold))
        .map(
            (seat) =>
                ({ ...seat, state: seat.state === '#' ? 'L' : '#' } as Seat)
        )
        .reduce(
            (world: Map<string, Seat>, seat: Seat): Map<string, Seat> =>
                world.set(JSON.stringify(seat.position), seat),
            world
        );

const printWorld = (world: Map<string, Seat>): string =>
    cellsAsArray(world)
        .map((s) => `${s.state}`)
        .join('');

const testMap: string = `L.LL.LL.LL
LLLLLLL.LL
L.L.L..L..
LLLL.LL.LL
L.LL.LL.LL
L.LLLLL.LL
..L.L.....
LLLLLLLLLL
L.LLLLLL.L
L.LLLLL.LL`;

const x = async () => {
    const text = await Deno.readTextFile('day11/input.txt').then((f: string) =>
        f
            .split('\n')
            .filter((x: string) => x)
            .join('\n')
    );

    const world = text
        .split('\n')
        .reduce((world: Map<string, Seat>, line: string, idx: number) => {
            const latitude = idx;
            line.split('').map((value: string, longitude: number) => {
                const position = [latitude, longitude] as Vector;
                const state = value as SeatState;
                world.set(JSON.stringify(position), seat(position, state));
            });
            return world;
        }, new Map<string, Seat>());

    const partOne = () => {
        let lastHash = printWorld(world);
        let currHash = '';
        let map = world;
        while (lastHash !== currHash) {
            map = update(map, neighboursSorrounding, 4);
            lastHash = currHash;
            currHash = printWorld(map);
        }
        console.log(cellsAsArray(world).filter((s) => s.state === '#').length);
    };

    const partTwo = () => {
        let lastHash = printWorld(world);
        let currHash = '';
        let map = world;
        while (lastHash !== currHash) {
            map = update(map, raycastNeighbours, 5);
            lastHash = currHash;
            currHash = printWorld(map);
        }
        console.log(cellsAsArray(world).filter((s) => s.state === '#').length);
    };
    partOne();
    partTwo();
};
x();
