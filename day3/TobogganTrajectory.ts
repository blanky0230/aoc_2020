import {readFileSync} from 'fs'

const readMap = (): Array<string> => readFileSync('./input.txt','utf-8').split('\n').map(f=> f.trim());

export const hitTree = (map: Array<string>, currentPos: [number, number]): boolean => {
    return map[currentPos[1]][currentPos[0]] === '#'
}

export const traverseMapWithTrees = (slope: {right: number, down: number}, map: Array<string>, startPos: [number, number]): number => {
    const trackWidth = map[0].length;
    let pos = startPos;
    let trees = 0;

    while (pos[1] < map.length) {
        const hit = hitTree(map, pos);
        if(hit) {
            trees++;
        }
        pos[0] = (pos[0] + slope.right) % trackWidth;
        pos[1] += slope.down;
    }
    return trees;
}

const main = () => {
    const map = readMap();
    const pos = [0,0] as [number, number];
    console.log(traverseMapWithTrees({right: 3, down: 1}, map, pos));
    
    const slopes = [{right: 1, down: 1}, {right: 3, down: 1}, {right: 5, down: 1}, {right:7, down: 1}, {right: 1, down: 2}];
    const res = slopes.map( slope => traverseMapWithTrees(slope, map, [0,0] as [number, number]) ).reduce((c,s) => c*s, 1);
    console.log(res);
}

main();