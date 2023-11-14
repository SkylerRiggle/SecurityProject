import { Server } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

const connect = async (io:  Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>): Promise<boolean> =>
{
    return false;
}

export default connect;