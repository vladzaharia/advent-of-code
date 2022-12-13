import { Missingno } from "../../util/missingno";
import { Unown } from "../../util/unown";

export function main() {
    const lines = Unown.parseInput(__filename);

    // Contain the resulting CRT display
    const result: string[] = [];
    let currentLine: string = "";

    // X register, starts at 1
    let regX = 2;

    // In the middle of an `addx` which takes 2 cycles
    let midAdd: number | false = false;

    // Go through cycles
    for (let i = 1; i <= 240; i++) {
        const spritePos = [regX - 1, regX, regX + 1];
        const pixel = (i%40);
        Missingno.log(`cycle ${i}/ pixel ${pixel}: sprite at ${spritePos}`);    

        // Add to current line
        if (spritePos.includes(pixel)) {
            currentLine += "█";
            Missingno.log(`cycle ${i}/ pixel ${pixel}: adding █, line ${currentLine}`);    
        } else {
            currentLine += ".";
            Missingno.log(`cycle ${i}/ pixel ${pixel}: adding ., line ${currentLine}`);    
        }

        // Push current line and reset
        if ([40, 80, 120, 160, 200, 240].includes(i)) {
            result.push(currentLine);
            currentLine = "";
        }

        // Execute current cycle's op
        if (midAdd) {
            Missingno.log(`cycle ${i}/ pixel ${pixel}: adding ${midAdd} to ${regX}`);    

            regX += midAdd;
            midAdd = false;
        } else {
            // Grab a line, parse it, and run an op
            const line = lines.splice(0, 1)[0];
            Missingno.log(`cycle ${i}/ pixel ${pixel}: ${line}`);

            if (line !== "noop") {
                midAdd = parseInt(line.split(" ")[1], 10);
            }
        }
    }

    // Return the value
    return result.join("\n");
}
