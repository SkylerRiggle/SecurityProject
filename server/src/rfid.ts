import { ReadlineParser, SerialPort } from "serialport";
import { Server } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

// parser.on('data', function (data) {
//     io.emit('serialdata', { data: data });
// });

const HANDSHAKE = 'A';
const ACCEPT = 'B';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const connect = async (io:  Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>): Promise<boolean> =>
{
    let status = false;

    for (const port of await SerialPort.list())
    {
        const serialPort = new SerialPort({
            baudRate: 9600,
            path: port.path
        });

        serialPort.on('open', () => {
            console.log(`Checking Port: ${port.path}`);
        });
        
        serialPort.on('error', (err) => {
            console.log('Error:', err.message);
        });

        serialPort.on("readable", () => {
            const value = serialPort.read()?.toString();

            if (status) { return io.emit("serialdata", { key: value }); }

            status = (value === HANDSHAKE) ?? false;
            if (!status) { return; }

            serialPort.write(ACCEPT);
            serialPort.flush();
        });

        await sleep(3000);
        if (status)
        {
            console.log("Connected to Port!");
            return true;
        }
        serialPort.close();
        await sleep(1500);
    }

    console.log("No Connection Found...");
    return false;
}

export default connect;