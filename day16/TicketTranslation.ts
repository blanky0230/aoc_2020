export {};

const main = async () => {
    const notes: string[] = await Deno.readTextFile(
        'day16/input.txt'
    ).then((f: string) => f.trim().split('\n\n'));

    const rules = notes[0]
        .split('\n')
        .filter((x) => x)
        .map((x) => {
            const name = x.split(':')[0].trim();
            const bounds = /(\d+)-(\d+) or (\d+)-(\d+)/
                .exec(x.trim())
                ?.slice(-4)
                .map((n) => Number.parseInt(n, 10));
            return { name, bounds };
        })
        .map(({ name, bounds }) => ({
            name,
            fun: (n: number) =>
                (bounds![0] <= n && bounds![1] >= n) ||
                (bounds![2] <= n && bounds![3] >= n),
        }));

    const nearbyyTicketsFlat = notes[2]
        .split('\n')
        .slice(1)
        .map((x) => x.split(',').map((x) => x.trim()))
        .flat(1)
        .map((x) => Number.parseInt(x, 10));

    console.log(
        `part 1: ${nearbyyTicketsFlat
            .filter((t) => rules.every((r) => !r.fun(t)))
            .reduce((x, y) => x + y, 0)}`
    );

    const nearbyTickets = notes[2]
        .split('\n')
        .slice(1)
        .map((x) => x.split(',').map((x) => Number.parseInt(x.trim(), 10)));

    const validNearbyTickets = nearbyTickets.filter(
        (t: number[]) =>
            t.filter((num) => rules.every((r) => !r.fun(num))).length === 0
    );

    const rulesToIdx = rules.reduce((carry, rule) => {
        const validOn = validNearbyTickets
            .map((ticket) =>
                ticket.reduce(
                    (carry, curr, currIdx) =>
                        rule.fun(curr) ? [...carry, currIdx] : carry,
                    [] as number[]
                )
            )
            .flat(1);

        const alwaysValidOnIdx = new Set(
            validOn.filter(
                (x) =>
                    validOn.filter((y) => y === x).length ===
                    validNearbyTickets.length
            )
        );
        return carry.set(rule.name, alwaysValidOnIdx);
    }, new Map<string, Set<number>>());

    const nextTargetForRemoval = (
        map: Map<string, Set<number>>,
        alreadyCleared: Set<string>
    ): string | null => {
        let answer = null;
        map.forEach((value, key) => {
            if (value.size === 1 && !alreadyCleared.has(key)) {
                answer = key;
            }
        });
        return answer;
    };

    let clearedKeys = new Set<string>();
    let nextKeyToClearFrom = nextTargetForRemoval(rulesToIdx, clearedKeys);
    while (nextKeyToClearFrom !== null) {
        const val = Array.from(rulesToIdx.get(nextKeyToClearFrom)!.values())[0];
        // console.log(`deleting ${val} from all rules other than ${nextKeyToClearFrom}`);
        const targets = Array.from(rulesToIdx.keys()).filter(
            (k) => k !== nextKeyToClearFrom
        );
        targets.map((k) => {
            const set = rulesToIdx.get(k)!;
            set.delete(val);
            rulesToIdx.set(k, set);
        });
        clearedKeys.add(nextKeyToClearFrom);
        nextKeyToClearFrom = nextTargetForRemoval(rulesToIdx, clearedKeys);
    }

    const depatureKeys = Array.from(rulesToIdx.keys()).filter((k) =>
        k.split(' ').includes('departure')
    );
    const departureIndicies = depatureKeys.map(
        (k) => Array.from(rulesToIdx.get(k)!)[0]
    );
    const myTicket = notes[1]
        .split('\n')
        .slice(1)
        .map((x) => x.split(',').map((x) => x.trim()))
        .flat(1)
        .map((x) => Number.parseInt(x, 10));
    console.log(
        `part 2: ${departureIndicies.reduce(
            (carry, idx) => carry * myTicket[idx],
            1
        )}`
    );
};

main();
