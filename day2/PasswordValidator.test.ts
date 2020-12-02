import { isPasswordValid } from "./PasswordValidator";

describe('Website examples', () => {

it.each`
min | max | search | password | valid
${1}|${3}| ${'a'}| ${'abcde'} | ${true}
${1}|${3}| ${'b'}| ${'cdefg'} | ${false}
${2}|${9}|${'c'}| ${'ccccccccc'} | ${true}
`
    ('$search should occur at least $min and at max $max times in $password = $valid', ({min, max, search, password, valid}) => {
        expect(isPasswordValid(search, min, max, password)).toBe(valid);
    });

})