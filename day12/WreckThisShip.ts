type Cardinal = 'N' | 'E' | 'S' | 'W';
type Rotation = 'L' | 'R';
type Forward = 'F';
type Direction = 0 | 90 | 180 | 270 | -180 | -90 | -270;
type Distance = [number, number];

type Action = Cardinal | Rotation | Forward;

interface Ship {
    direction: Direction;
    distance: Distance;
}

interface BetterShip extends Ship {
    waypoint: Distance;
}

const createShip = (): Ship => ({
    direction: 90,
    distance: [0, 0],
});

const createBetterShip = (): BetterShip => ({
    direction: 90,
    distance: [0, 0],
    waypoint: [10, 1],
});

const turnShip = (ship: Ship, rotation: Rotation, amount: number): Ship => {
    switch (rotation) {
        case 'R':
            return {
                ...ship,
                direction: ((ship.direction + amount) % 360) as Direction,
            };
        case 'L':
            return {
                ...ship,
                direction: ((ship.direction - amount) % 360) as Direction,
            };
    }
};

const directionToCardinal = (direction: Direction): Cardinal => {
    switch (direction) {
        case 0:
            return 'N';
        case 90:
        case -270:
            return 'E';
        case 180:
        case -180:
            return 'S';
        case 270:
        case -90:
            return 'W';
        default:
            throw new Error(direction);
    }
};

const executeAction = (ship: Ship, action: Action, amount: number): Ship => {
    switch (action) {
        case 'E':
            return {
                ...ship,
                distance: [ship.distance[0] + amount, ship.distance[1]],
            };
        case 'W':
            return {
                ...ship,
                distance: [ship.distance[0] - amount, ship.distance[1]],
            };
        case 'N':
            return {
                ...ship,
                distance: [ship.distance[0], ship.distance[1] + amount],
            };
        case 'S':
            return {
                ...ship,
                distance: [ship.distance[0], ship.distance[1] - amount],
            };

        case 'R':
        case 'L':
            return { ...turnShip(ship, action, amount) };

        case 'F':
            return executeAction(
                ship,
                directionToCardinal(ship.direction),
                amount
            );
    }
};

const executeActionBetter = (
    ship: BetterShip,
    action: Action,
    amount: number
): BetterShip => {
    switch (action) {
        case 'E':
            return {
                ...ship,
                waypoint: [ship.waypoint[0] + amount, ship.waypoint[1]],
            };
        case 'W':
            return {
                ...ship,
                waypoint: [ship.waypoint[0] - amount, ship.waypoint[1]],
            };
        case 'N':
            return {
                ...ship,
                waypoint: [ship.waypoint[0], ship.waypoint[1] + amount],
            };
        case 'S':
            return {
                ...ship,
                waypoint: [ship.waypoint[0], ship.waypoint[1] - amount],
            };

        case 'L':
        case 'R':
            return {
                ...ship,
                waypoint: rotatePositionAround(
                    ship.distance,
                    ship.waypoint,
                    action,
                    amount as Direction
                ),
            };

        case 'F':
            return moveShipToWayPointRepeat(ship, amount);
    }
};

const rotatePositionAround = (
    center: Distance,
    start: Distance,
    rotation: Rotation,
    deg: Direction
): Distance => {
    let angle;
    switch (rotation) {
        case 'L':
            angle = (deg * Math.PI) / 180;
            break;
        case 'R':
            angle = ((360 - deg) * Math.PI) / 180;
            break;
    }

    var rotatedX =
        Math.cos(angle) * (start[0] - center[0]) -
        Math.sin(angle) * (start[1] - center[1]) +
        center[0];
    var rotatedY =
        Math.sin(angle) * (start[0] - center[0]) +
        Math.cos(angle) * (start[1] - center[1]) +
        center[1];

    return [rotatedX, rotatedY];
};
const moveShipToWayPoint = (ship: BetterShip): BetterShip => {
    const distNew = ship.waypoint;
    const wpNew = addDistances(distNew, [
        ship.waypoint[0] - ship.distance[0],
        ship.waypoint[1] - ship.distance[1],
    ]);
    return { ...ship, distance: distNew, waypoint: wpNew };
};

const moveShipToWayPointRepeat = (
    ship: BetterShip,
    repeat: number
): BetterShip => {
    let newShip = ship;
    let rep = repeat;
    while (rep) {
        newShip = moveShipToWayPoint(newShip);
        --rep;
    }
    return newShip;
};

const addDistances = (vecA: Distance, vecB: Distance): Distance => [
    vecA[0] + vecB[0],
    vecA[1] + vecB[1],
];

const testInstrcutions = `
    F10
    N3
    F7
    R90
    F11`;

const testInstructions = async () => {
    const instructions: Array<[Action, number]> = await Deno.readTextFile(
        'day12/input.txt'
    ).then((f: string) =>
        // const instructions: Array<[Action, number]> = testInstrcutions
        f
            .split('\n')
            .filter((x: string) => x)
            .map((l: string) => {
                const match = /(\w{1})(\d+)/.exec(l);
                if (match === null) throw new Error();
                return [
                    match[1] as Action,
                    Number.parseInt(match[2], 10) as number,
                ];
            })
    );

    const ship: Ship = instructions.reduce(
        (s: Ship, i: [Action, number]): Ship => {
            // console.log(i);
            return executeAction(s, i[0] as Action, i[1] as number);
        },
        createShip()
    );

    console.log(
        ship.distance
            .map((x: number) => Math.abs(x))
            .reduce((a: number, c: number) => c + a, 0)
    );

    const betterShip: BetterShip = instructions.reduce(
        (s: BetterShip, i: [Action, number]): BetterShip => {
            return executeActionBetter(s, i[0] as Action, i[1]);
        },
        createBetterShip()
    );

    console.log(
        betterShip.distance
            .map((x: number) => Math.abs(x))
            .reduce((a: number, c: number) => c + a, 0)
    );
};

testInstructions();
export {};
