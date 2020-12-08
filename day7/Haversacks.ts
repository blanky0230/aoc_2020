import { readFileSync } from 'fs';

export interface Bag {
    color: string;
    contents: { color: string; cardinality: number }[];
}

const decodeBag = (
    bagString: string
): { color: string; cardinality: number } | null => {
    if (bagString.includes('no other bags')) {
        return null;
    }

    const matches = /([0-9])\s(([a-z]+\s){2})bag(s?)/.exec(bagString);

    return {
        color: matches![2].trim(),
        cardinality: Number.parseInt(matches![1], 10),
    };
};

// `light red bags contain 1 bright white bag, 2 muted yellow bags.
// dark orange bags contain 3 bright white bags, 4 muted yellow bags.
// bright white bags contain 1 shiny gold bag.
// muted yellow bags contain 2 shiny gold bags, 9 faded blue bags.
// shiny gold bags contain 1 dark olive bag, 2 vibrant plum bags.
// dark olive bags contain 3 faded blue bags, 4 dotted black bags.
// vibrant plum bags contain 5 faded blue bags, 6 dotted black bags.
// faded blue bags contain no other bags.
// dotted black bags contain no other bags.
// `

const graph: Bag[] = readFileSync('input.txt', 'utf-8')
    .split('\n')
    .filter((x) => x)
    .map((line) => {
        const [left, right] = line.split(' bags contain ');

        const contents = right
            .replace('.', '')
            .split(',')
            .map((x) => decodeBag(x.trim()))
            .filter((bag) => bag) as [{ color: string; cardinality: number }];

        return {
            color: left,
            contents,
        };
    });

const mayContain = (bags: Bag[], bag: Bag, search: string): boolean => {
    if (bag.color === search) {
        return true;
    }
    return bag.contents.some((b) =>
        mayContain(bags, graph.filter((f) => f.color === b.color)[0], search)
    );
};

const getBagCount = (bags: Bag[], bag: Bag): number =>
    bag.contents.reduce((carry, { color, cardinality }) => {
        carry += cardinality;
        carry +=
            getBagCount(bags, bags.filter((b) => b.color === color)[0]) *
            cardinality;
        return carry;
    }, 0);

console.log(graph.filter((i) => mayContain(graph, i, 'shiny gold')).length - 1);
console.log(
    getBagCount(graph, graph.filter((b) => b.color === 'shiny gold')[0])
);
