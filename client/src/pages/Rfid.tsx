import { useEffect, useState } from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";
import io from 'socket.io-client';

enum Status
{
    NOT_CONNECTED = 0,
    CONNECTED = 1,
    CONNECTING = 2,
    REFUSED = 3
}

const RfidPage = () =>
{
    const [status, setStatus] = useState<Status>(Status.NOT_CONNECTED);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    const targetKey = "8A3A4580";
    const [key, setKey] = useState<string>("N/A")

    useEffect(() => {
        if (status !== Status.CONNECTED) { return; }

        const socket = io("http://localhost:3333");
        socket.on("serialdata", (data) => {
            const newKey = (data?.key ?? "N/A").trim();
            setKey(newKey);
            setIsAuthenticated(newKey === targetKey);
        });

        return () => {
            socket.close();
        }
    }, [status]);

    const attemptConnection = () =>
    {
        if (status === Status.CONNECTING) { return; }
        setStatus(Status.CONNECTING);
        axios.get("http://localhost:3333/connect").then((response) => {
            setStatus(response.status === 200 ? (
                response.data.status ? Status.CONNECTED : Status.REFUSED
            ) : Status.NOT_CONNECTED);
        });
    }

    return (
        <div className="vh-100 d-flex align-items-center justify-content-around">
            <div className="bg-blay border border-black p-3 m-2 w-25">
                <h3>Connection Panel</h3><hr />
                {(() => {
                    switch (status)
                    {
                        case Status.CONNECTED:
                            return <>
                                <h5>Target Key: <span className="fw-normal">{targetKey}</span></h5>
                                <h5>Last Key: <span className="fw-normal">{key}</span></h5>
                                <div className="d-flex align-items-center mt-3">
                                    <div className="bg-success rounded-circle border me-3"
                                    style={{ width: "25px", height: "25px" }} />
                                    <span>CONNECTED</span>
                                </div>
                                <div className="d-flex align-items-center mt-3">
                                    <div className={`${isAuthenticated ? "bg-success" : "bg-danger"} rounded-circle border me-3`}
                                    style={{ width: "25px", height: "25px" }} />
                                    <span>AUTHENTICATED</span>
                                </div>
                            </>;
                        case Status.CONNECTING:
                            return <div className="d-flex justify-content-center align-items-center">
                                <div className="spinner-border text-light me-3" />
                                <h5 className="m-0">Connecting...</h5>
                            </div>;
                        default: // Also Include NOT CONNECTED Case
                            return <div className="d-flex flex-column justify-content-center align-items-center">
                                {status === Status.REFUSED &&
                                    <span className="fst-italic text-danger">Connection Refused. Please Try Again...</span>
                                }
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