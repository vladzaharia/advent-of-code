import { getAllScripts, executeAdventFile } from './util/exeggutor';

getAllScripts(__dirname).forEach(async (f) => await executeAdventFile(f));