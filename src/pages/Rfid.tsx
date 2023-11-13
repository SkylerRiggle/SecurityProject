import { useState } from "react";
import Button from "react-bootstrap/Button";

const HANDSHAKE = 'A';
const ACCEPT = 'B';

enum Status
{
    NOT_CONNECTED = 0,
    CONNECTED = 1,
    CONNECTING = 2
}

const RfidPage = () =>
{
    const [status, setStatus] = useState<Status>(Status.NOT_CONNECTED);

    const attemptConnection = async () =>
    {
        if (status !== Status.NOT_CONNECTED) { return; }
        setStatus(Status.CONNECTING);
    }

    return (
        <div className="vh-100 d-flex align-items-center justify-content-around">
            <div className="bg-blay border border-black p-3 m-2 w-25">
                <h3>Connection Panel</h3><hr />
                {(() => {
                    switch (status)
                    {
                        case Status.CONNECTED:
                            return <></>;
                        case Status.CONNECTING:
                            return <div className="d-flex justify-content-center align-items-center">
                                <div className="spinner-border text-light me-3" />
                                <h5 className="m-0">Connecting...</h5>
                            </div>;
                        default: // Also Include NOT CONNECTED Case
                            return <div className="d-flex justify-content-center align-items-center">
                                <Button
                                    className="p-2 btn"
                                    onClick={attemptConnection}
                                >
                                    <h5 className="m-0">Connect</h5>
                                </Button>
                            </div>;
                    }
                })()}
            </div>

            <div className="bg-blay border border-black p-3 m-2 w-25">
                <h1 className="w-100 text-center">SCAN TAG</h1><hr />
                <img src="/images/scanner.png" alt="Scanner Icon" width="100%" />
            </div>
        </div>
    );
}

export default RfidPage;