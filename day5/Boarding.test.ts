import { convertToBinary } from "./Boarding"

describe('converts rows and colums to binary numbers', () => {
    it('converts colums as per input', () => {
    expect(convertToBinary('BFFFBBF')).toBe(70);
    })
    it('converts rows as per input', () => {
    expect(convertToBinary('RRR')).toBe(7);
    })

    it('converts whole boarding pass directly to ID', () => {
        expect(convertToBinary('FFFBBBFRRR')).toBe(119);
    });
});