import {
    uniqueAnswersFromGroup,
    unanymousAnswersFromGroup,
} from './CustomsReport';

it('', () => {
    const input = `abcx
    abcy
    abcz`;
    expect(uniqueAnswersFromGroup(input)).toEqual([
        'a',
        'b',
        'c',
        'x',
        'y',
        'z',
    ]);
});

it('', () => {
    const input = `abcx
    abcy
    abcz`;
    expect(unanymousAnswersFromGroup(input)).toEqual(['a', 'b', 'c']);
});
