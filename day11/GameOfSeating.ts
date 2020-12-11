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

const neighbours = (seat: Seat, world: Map<string, Seat>): Seat[] => {
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

const mustToggle = (seat: Seat, world: Map<string, Seat>): boolean => {
    switch (seat.state) {
        case '.':
            return false;
        case '#':
            return (
                neighbours(seat, world).filter((s) => s.state === '#').length >=
                4
            );
        case 'L':
            return (
                neighbours(seat, world).filter((s) => s.state === '#')
                    .length === 0
            );
    }
};

const cellsAsArray = (cellMap: Map<string, Seat>): Seat[] => {
    const result = new Array<Seat>();
    cellMap.forEach((v) => result.push(v));
    return result;
};

const update = (world: Map<string, Seat>): Map<string, Seat> =>
    cellsAsArray(world)
        .filter((seat) => mustToggle(seat, world))
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

    const world = text.split('\n').reduce((world, line, idx) => {
        const latitude = idx;
        line.split('').map((value, longitude) => {
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
            map = update(map);
            lastHash = currHash;
            currHash = printWorld(map);
        }
        console.log(cellsAsArray(world).filter((s) => s.state === '#').length);
    };
    partOne();
};
x();
