import { Request, Response, Express } from 'express';
import io from "socket.io";
import tryConnect from '../rfid/rfid';

const register = (app: Express) =>
{
    app.get('/connect', async (_req: Request, res: Response) => {
        const status = await tryConnect();

        if (status)
        {
            // TODO: IO Emit
        }

        res.send({ status: status });
    });
}

export default register;