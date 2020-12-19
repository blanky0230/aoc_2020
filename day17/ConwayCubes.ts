export {};

interface Position {
    coordinates: [number, number, number];
    neighbours: Array<[number, number, number]>;
}

interface Position4 {
    coordinates: [number, number, number, number];
    neighbours: Array<[number, number, number, number]>;
}

interface Cell {
    active: boolean;
    position: Position;
}

interface Cell4 {
    active: boolean;
    position: Position4;
}

const createPosition = (coordinates: [number, number, number]): Position => {
    let [centerX, centerY, centerZ] = coordinates;
    let neighbours = [] as [number, number, number][];
    for (let x = centerX - 1; x <= centerX + 1; x++) {
        for (let y = centerY - 1; y <= centerY + 1; y++) {
            for (let z = centerZ - 1; z <= centerZ + 1; z++) {
                let coord: [number, number, number] = [x, y, z];
                if (JSON.stringify(coordinates) !== JSON.stringify(coord)) {
                    neighbours.push(coord);
                }
            }
        }
    }
    return { coordinates, neighbours };
};

const createPosition4D = (
    coordinates: [number, number, number, number]
): Position4 => {
    let [centerX, centerY, centerZ, centerW] = coordinates;
    let neighbours = [] as [number, number, number, number][];
    for (let x = centerX - 1; x <= centerX + 1; x++) {
        for (let y = centerY - 1; y <= centerY + 1; y++) {
            for (let z = centerZ - 1; z <= centerZ + 1; z++) {
                for (let w = centerW - 1; w <= centerW + 1; w++) {
                    let coord: [number, number, number, number] = [x, y, z, w];
                    if (JSON.stringify(coordinates) !== JSON.stringify(coord)) {
                        neighbours.push(coord);
                    }
                }
            }
        }
    }
    return { coordinates, neighbours };
};

/**
 * Since we are on an infinite Space - let's make sure we get everyone involved...
 * **/
const updateCell = (cell: Cell, world: Map<string, Cell>): Cell => {
    // const aliveNeighbours = Array.from(world.values()).filter((c) => c.active);
    const aliveNeighbours = cell.position.neighbours
        .map((p) => world.get(JSON.stringify(p)))
        .filter((c) => c)
        .filter((c) => c!.active);
    // console.log(aliveNeighbours.length);

    if (cell.active) {
        if (aliveNeighbours.length === 2 || aliveNeighbours.length === 3) {
            return cell;
        }
        return { ...cell, active: !cell.active };
    }
    return { ...cell, active: aliveNeighbours.length === 3 };
};

const updateCell4 = (cell: Cell4, world: Map<string, Cell4>): Cell4 => {
    const aliveNeighbours = cell.position.neighbours
        .map((p) => world.get(JSON.stringify(p)))
        .filter((c) => c)
        .filter((c) => c!.active);
    // console.log(aliveNeighbours.length);

    if (cell.active) {
        if (aliveNeighbours.length === 2 || aliveNeighbours.length === 3) {
            return cell;
        }
        return { ...cell, active: !cell.active };
    }
    return { ...cell, active: aliveNeighbours.length === 3 };
};

const expandWorld = (world: Map<string, Cell>): Map<string, Cell> => {
    Array.from(world.values()).map((cell) => {
        cell.position.neighbours.reduce((world, curr) => {
            if (!world.has(JSON.stringify(curr))) {
                world.set(JSON.stringify(curr), {
                    active: false,
                    position: createPosition(curr),
                });
            }
            return world;
        }, world);
    });
    return world;
};

const expandWorld4 = (world: Map<string, Cell4>): Map<string, Cell4> => {
    Array.from(world.values()).map((cell) => {
        cell.position.neighbours.reduce((world, curr) => {
            if (!world.has(JSON.stringify(curr))) {
                world.set(JSON.stringify(curr), {
                    active: false,
                    position: createPosition4D(curr),
                });
            }
            return world;
        }, world);
    });
    return world;
};

const createWorld = (input: string): Map<string, Cell> => {
    const lines = input.trim().split('\n');
    const map = lines
        .map((line, x) =>
            line
                .trim()
                .split('')
                .map((c, y) => ({
                    active: c === '#',
                    position: createPosition([x, y, 0]),
                }))
        )
        .flat(1)
        .reduce(
            (map, cell) =>
                map.set(JSON.stringify(cell.position.coordinates), cell),
            new Map<string, Cell>()
        );
    return map;
};

const createWorld4D = (input: string): Map<string, Cell4> => {
    const lines = input.trim().split('\n');
    const map = lines
        .map((line, x) =>
            line
                .trim()
                .split('')
                .map(
                    (c, y): Cell4 => ({
                        active: c === '#',
                        position: createPosition4D([x, y, 0, 0]),
                    })
                )
        )
        .flat(1)
        .reduce(
            (map, cell) =>
                map.set(JSON.stringify(cell.position.coordinates), cell),
            new Map<string, Cell4>()
        );
    return map;
};

const updateWorld = (world: Map<string, Cell>): Map<string, Cell> => {
    let newWorld = expandWorld(world);
    Array.from(newWorld.entries())
        .map(
            ([key, cell]) => [key, updateCell(cell, newWorld)] as [string, Cell]
        )
        .reduce((newWorld, [key, cell]) => newWorld.set(key, cell), newWorld);
    return newWorld;
};

const updateWorld4D = (world: Map<string, Cell4>): Map<string, Cell4> => {
    let newWorld = expandWorld4(world);
    Array.from(newWorld.entries())
        .map(
            ([key, cell]) =>
                [key, updateCell4(cell, newWorld)] as [string, Cell4]
        )
        .reduce((newWorld, [key, cell]) => newWorld.set(key, cell), newWorld);
    return newWorld;
};

const partOne = async () => {
    const input: string = await Deno.readTextFile(
        'day17/input.txt'
    ).then((f: string) => f.trim());
    // let world = createWorld(`.#.
    // ..#
    // ###`);
    let world = createWorld(input);

    let gen = 0;
    while (gen < 6) {
        // console.log(world);
        world = updateWorld(world);
        gen++;
    }

    console.log(Array.from(world.values()).filter((c) => c.active).length);
};
partOne();

const partTwo = async () => {
    const input: string = await Deno.readTextFile(
        'day17/input.txt'
    ).then((f: string) => f.trim());
    // let world = createWorld4D(`.#.
    // ..#
    // ###`);
    let world = createWorld4D(input);

    let gen = 0;
    while (gen < 6) {
        // console.log(world);
        world = updateWorld4D(world);
        gen++;
    }

    console.log(Array.from(world.values()).filter((c) => c.active).length);
};
partTwo();
