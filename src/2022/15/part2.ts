import { Missingno } from '../../util/missingno';
import { Unown } from '../../util/unown';

export function main() {
    const sensors = Unown.parseInput(__filename).map(createSensor);

    let result: number = 0;
    // let maxCoord = 20;
    let maxCoord = 4000000;

    for (const sensor of sensors) {
        const minI = Math.max(0, sensor.sensor.i - sensor.distance - 1);
        const maxI = Math.min(maxCoord, sensor.sensor.i + sensor.distance + 1);

        console.log(`Checking sensor ${sensor.sensor.i},${sensor.sensor.j}, distance ${sensor.distance}, i min ${minI} max ${maxI}`);

        for (let i = minI; i <= maxI; i++) {
            const diff = Math.abs(i - sensor.sensor.i);

            const minJ = Math.max(0, sensor.sensor.j - (sensor.distance - diff) - 1);
            const maxJ = Math.min(maxCoord, sensor.sensor.j + (sensor.distance - diff) + 1);

            Missingno.log(`i ${i}, j min ${minJ} max ${maxJ}`);

            const others = sensors.filter((s) => s.sensor.i !== sensor.sensor.i && s.sensor.j !== sensor.sensor.j);

            for (let j = minJ; j <= maxJ; j++) {
                if (sensors.every((s) => getDistance(s.sensor, { i, j }) > s.distance) && !sensors.some((s) => s.beacon.i === i && s.beacon.j === j)) {

                // if (!others.every((s) => getDistance({i, j}, s.sensor) > s.distance)) {
                    Missingno.log(`No beacon at ${i},${j}`);
                    return j * 4000000 + i;
                } 
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

interface Points {
    sensor: Coordinates;
    beacon: Coordinates;
}

interface Sensor extends Points {
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

    const points: Points = {
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
        distance: getDistance(points.sensor, points.beacon),
    }
}

function createBounds(points: Points): Coordinates[] {
    Missingno.log(`createBounds: ${JSON.stringify(points)}`);
    const distance = getDistance(points.sensor, points.beacon);
    const result: Coordinates[] = [];

    for (let i = points.sensor.i - distance; i <= points.sensor.i + distance; i++) {
        const startJ = points.sensor.i - (distance - (i - points.sensor.i));
        const endJ = points.sensor.i + (distance - (i - points.sensor.i));

        result.push({ i: i, j: startJ });
        result.push({ i, j: endJ });
    }

    return result;
}