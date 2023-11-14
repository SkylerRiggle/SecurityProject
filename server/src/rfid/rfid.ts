import { SerialPort } from 'serialport';
import { ReadlineParser } from '@serialport/parser-readline';
import handleRFID from './handler';

const HANDSHAKE = 'A';
const ACCEPT = 'B';

const tryConnect = async (): Promise<boolean> =>
{
    const portInfo = await SerialPort.list();

    for (const port of portInfo)
    {
        const serialport = new SerialPort({
            path: port.path,
            baudRate: 9600
        });

        serialport.on('readable', () => {
            const value = serialport.read()?.toString();
            if (value != HANDSHAKE)
            {

            }

            serialport.write(ACCEPT);
            serialport.flush();
        });
    }

    return false;
}

const initRFID = async (baudRate: number) => SerialPort.list().then((portInfo) => {
    const connectStep = (index: number) =>
    {
        if (index >= portInfo.length || index < 0)
        {
            initRFID(baudRate);
        }

        const serialport = new SerialPort({
            path: portInfo[0].path,
            baudRate: baudRate
        });
    
        const parser = serialport.pipe(new ReadlineParser({ delimiter: '\r\n' }));
    
        parser.on('data', (data) => {
            handleRFID(data);
        });
        
        serialport.on('open', () => {
            console.log(`Serial Port Opened At: ${portInfo[0].path}`);
        });
        
        serialport.on('error', (err) => {
            console.log('Error:', err.message);
        });

        let isConnected = false;
        serialport.on('readable', () => {
            const value = serialport.read()?.toString();
            if (value != HANDSHAKE && !isConnected)
            {
                serialport.close();
                return connectStep(index + 1);
            }
            
            isConnected = true;
            serialport.write(ACCEPT);
            serialport.flush();
        })
    }

    if (portInfo.length <= 0)
    {
        console.log("[WARN]: Could Not Connect To RFID Ports...");
        return;
    }
    connectStep(0);
});

export default tryConnect;