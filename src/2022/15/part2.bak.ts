import { Missingno } from '../../util/missingno';
import { Unown } from '../../util/unown';

export function main() {
    const sensors = Unown.parseInput(__filename).map(createSensor);

    let result: number = 0;
    // let maxCoord = 20;
    let maxCoord = 4000000;

    for (let i = 0; i < maxCoord; i++) {
        console.log(`${i}/${maxCoord}`);

        for (let j = 0; j < maxCoord; j++) {
            if (sensors.every((s) => getDistance(s.sensor, { i, j }) > s.distance) && !sensors.some((s) => s.beacon.i === i && s.beacon.j === j)) {
                Missingno.log(`No beacon at ${i},${j}`);
                return j * 4000000 + i;
            }
        }
    }

    return result;
}

interface Coordinates {
    /** y */
    i: number;

    /** x */
    j: number;
}

interface Sensor {
    sensor: Coordinates;
    beacon: Coordinates;
    distance: number;
}

function getDistance(a: Coordinates, b: Coordinates): number {
    return Math.abs(a.i - b.i) + Math.abs(a.j - b.j);
}

function createSensor(line: string): Sensor {
    const pairStr = line.split(": ");
    const sensorStr = pairStr[0];
    const beaconStr = pairStr[1];

    const coordRegex = /x=(.+), y=(.+)/;

    const sensorMatch = sensorStr.match(coordRegex);
    const beaconMatch = beaconStr.match(coordRegex);

    const points = {
        sensor: {
            i: parseInt(sensorMatch![2], 10),
            j: parseInt(sensorMatch![1], 10)
        },
        beacon: {
            i: parseInt(beaconMatch![2], 10),
            j: parseInt(beaconMatch![1], 10)
        }
    };

    return {
        sensor: points.sensor,
        beacon: points.beacon,
        distance: getDistance(points.sensor, points.beacon)
    }
}
