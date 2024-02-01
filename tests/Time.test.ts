import { Time } from "../src/models/Time";


describe('Expiration time', () => {

    describe('Time class', () => {

        it('should create correctly TimeString', () => {
            const time = Time.from('1s');
            expect(time.value).toBe(1000);
        });

        it('should create correctly timestamp', () => {
            const time = Time.from(1000);
            expect(time.value).toBe(1000);
        });

    });

});