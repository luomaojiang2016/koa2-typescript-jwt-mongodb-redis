export class utilFunc {
    public static createRandom(bit: number): string {
        let random: string = "";
        for (let i = 0; i < bit; i++) {
            random += Math.floor(Math.random() * 10)
        }
        return random;
    }

    public static sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

}