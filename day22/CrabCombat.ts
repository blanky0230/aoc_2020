export {};

interface Player {
    name: string;
    deck: Array<number>;
}

const drawTopCard = (player: Player): [number, Player] => {
    if (!player.deck.length) {
        return [-1, player];
    }

    const topCard = player.deck[0];
    return [topCard, { ...player, deck: player.deck.slice(1) }];
};

const readInput = (input: string): [number[], number[]] => {
    return input
        .split(/Player \d:/)
        .filter((f) => f)
        .map((l) =>
            l
                .split('\n')
                .map((l) => l.trim())
                .filter((l) => l)
                .map((n) => Number.parseInt(n, 10))
        ) as [number[], number[]];
};

const playGame = (playerA: Player, playerB: Player): [Player, Player] => {
    const [cardA, mutPlayerA] = drawTopCard(playerA);
    const [cardB, mutPlayerB] = drawTopCard(playerB);
    if (cardA === -1 || cardB === -1) {
        return [playerA, playerB];
    }
    if (cardA > cardB) {
        return playGame(
            { ...mutPlayerA, deck: [...mutPlayerA.deck, cardA, cardB] },
            { ...mutPlayerB }
        );
    } else if (cardB > cardA) {
        return playGame(
            { ...mutPlayerA },
            { ...mutPlayerB, deck: [...mutPlayerB.deck, cardB, cardA] }
        );
    }
    throw new Error();
};

const partOne = async () => {
    // const input = `Player 1:
    // 9
    // 2
    // 6
    // 3
    // 1
    // Player 2:
    // 5
    // 8
    // 4
    // 7
    // 10`;

    const input: string = await Deno.readTextFile(
        'day22/input.txt'
    ).then((f: string) => f.trim());

    const decks = readInput(input);
    const players = [
        { name: 'Fred', deck: decks[0] },
        { name: 'George', deck: decks[1] },
    ];
    const winner = playGame(players[0], players[1]).filter(
        (p) => p.deck.length
    )[0];
    console.log(
        winner.deck
            .map((card, idx, all) => card * (all.length - idx))
            .reduce((a, b) => a + b, 0)
    );
};

partOne();
