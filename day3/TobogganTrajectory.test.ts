import { traverseMapWithTrees, hitTree } from './TobogganTrajectory';

describe('small tests', () => {
    const testmap = `..##.......
    #...#...#..
    .#....#..#.
    ..#.#...#.#
    .#...##..#.
    ..#.##.....
    .#.#.#....#
    .#........#
    #.##...#...
    #...##....#
    .#..#...#.#`
        .split('\n')
        .map((f) => f.trim());

    partOne('traverse once', () => {
        const start = [0, 0] as [number, number];
        expect(hitTree(testmap, start)).toBe(false);
    });

    partOne('traverse whole map', () => {
        const start = [0, 0] as [number, number];
        expect(
            traverseMapWithTrees({ right: 3, down: 1 }, testmap, start)
        ).toBe(7);
    });

    partOne('traverse whole map', () => {
        const start = [0, 0] as [number, number];
        expect(
            traverseMapWithTrees({ right: 1, down: 1 }, testmap, start)
        ).toBe(2);
    });

    partOne('traverse whole map', () => {
        const start = [0, 0] as [number, number];
        expect(
            traverseMapWithTrees({ right: 5, down: 1 }, testmap, start)
        ).toBe(3);
    });

    partOne('traverse whole map', () => {
        const start = [0, 0] as [number, number];
        expect(
            traverseMapWithTrees({ right: 7, down: 1 }, testmap, start)
        ).toBe(4);
    });

    partOne('traverse whole map', () => {
        const start = [0, 0] as [number, number];
        expect(
            traverseMapWithTrees({ right: 1, down: 2 }, testmap, start)
        ).toBe(2);
    });

    partOne('traverse several maps & product trees', () => {
        const slopes = [
            { right: 1, down: 1 },
            { right: 3, down: 1 },
            { right: 5, down: 1 },
            { right: 7, down: 1 },
            { right: 1, down: 2 },
        ];
        const res = slopes
            .map((slope) =>
                traverseMapWithTrees(slope, testmap, [0, 0] as [number, number])
            )
            .reduce((c, s) => c * s, 1);
        expect(res).toEqual(336);
    });
});
