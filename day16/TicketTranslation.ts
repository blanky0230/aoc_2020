export {};

const main = async () => {
    const notes: string[] = await Deno.readTextFile(
        'day16/input.txt'
    ).then((f: string) => f.trim().split('\n\n'));

    const rules = notes[0]
        .split('\n')
        .filter((x) => x)
        .map((x) => /(\d+)-(\d+) or (\d+)-(\d+)/.exec(x.trim()))
        .map((x) => x?.slice(-4).map((n) => Number.parseInt(n, 10)))
        .map((bounds) => (n: number) =>
            (bounds![0] <= n && bounds![1] >= n) ||
            (bounds![2] <= n && bounds![3] >= n)
        );
    const nearbyyTickets = notes[2]
        .split('\n')
        .slice(1)
        .map((x) => x.split(',').map((x) => x.trim()))
        .flat(1)
        .map((x) => Number.parseInt(x, 10));
    console.log(
        nearbyyTickets
            .filter((t) => rules.every((r) => !r(t)))
            .reduce((x, y) => x + y, 0)
    );
};

main();
