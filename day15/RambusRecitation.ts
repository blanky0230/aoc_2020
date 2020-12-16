export {};

interface Game {
    saidNumbers: Map<number, number[]>;
    turnToNumber: Map<number, number>;
    turn: number;
}

const play = ({ saidNumbers, turnToNumber, turn }: Game): Game => {
    const lastSaid: number | undefined = turnToNumber.get(turn - 1);
    if (lastSaid === undefined) {
        throw new Error();
    }

    const lastSaidAtTurns = saidNumbers.get(lastSaid) ?? [];

    if (lastSaidAtTurns.length < 2) {
        const newSaid = saidNumbers.get(0) ?? [];
        newSaid.push(turn);
        return {
            turnToNumber: turnToNumber.set(turn, 0),
            saidNumbers: saidNumbers.set(0, newSaid),
            turn: turn + 1,
        };
    }

    const atTurns = lastSaidAtTurns.slice(-2);
    const say = atTurns[1] - atTurns[0];
    return {
        turnToNumber: turnToNumber.set(turn, say),
        saidNumbers: saidNumbers.set(say, [
            ...(saidNumbers.get(say) ?? []),
            turn,
        ]),
        turn: turn + 1,
    };
};

const playIterative = (targetTurn: number): void => {
    let test = '15,12,0,14,3,1'.split(',').map((v) => parseInt(v.trim()));
    let turnToNumber = test.reduce(
        (tn, n, idx) => tn.set(idx + 1, n),
        new Map<number, number>()
    );
    let saidNumbers = test.reduce(
        (sn, n, idx) => sn.set(n, [idx + 1]),
        new Map<number, number[]>()
    );
    let turn = test.length;

    while (turn < targetTurn) {
        if (turn % 1000000 === 0) {
            console.log(`still running... ${turn}`);
        }
        let lastSaid: number | undefined = turnToNumber.get(turn - 1);
        if (lastSaid === undefined) {
            throw new Error();
        }

        let lastSaidAtTurns = saidNumbers.get(lastSaid) ?? [];

        if (lastSaidAtTurns.length < 2) {
            if (!saidNumbers.has(0)) {
                saidNumbers.set(0, []);
            }
            saidNumbers.get(0)!.push(turn);
            turnToNumber.set(turn, 0);
            turn += 1;
        } else {
            let atTurns = lastSaidAtTurns.slice(-2);
            let say = atTurns[1] - atTurns[0];
            if (say === undefined || turn === undefined) {
                console.log('AHA');
            }
            turnToNumber.set(turn, say);

            if (!saidNumbers.has(say)) {
                saidNumbers.set(say, []);
            }
            saidNumbers.get(say)!.push(turn);
            turn += 1;
        }
    }
    console.log(turnToNumber.get(targetTurn));
};

const partOne = () => {
    const test = '15,12,0,14,3,1'.split(',').map((v) => parseInt(v.trim()));
    // const test = '0,3,6'.split(',').map(v => parseInt(v.trim()));
    const turnToNumber = test.reduce(
        (tn, n, idx) => tn.set(idx + 1, n),
        new Map<number, number>()
    );
    const saidNumbers = test.reduce(
        (sn, n, idx) => sn.set(n, [idx + 1]),
        new Map<number, number[]>()
    );
    let game: Game = { saidNumbers, turnToNumber, turn: test.length + 1 };

    while (game.turn <= 2020) {
        game = play(game);
    }
    console.log(game.turnToNumber.get(2020));
};

const partTwo = () => {
    playIterative(30000000);
};

partOne();
console.log('-----');
partTwo();
