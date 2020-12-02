import {reportRepair, reportRepairTriple} from './ReportRepair';

test('example from page', () => {
    expect(reportRepair([1721,979, 366,299,675,1456])).toBe(514579);
});

test('examlpe for triple', () => {
    expect(reportRepairTriple([1721,979, 366,299,675,1456])).toBe(241861950);
})