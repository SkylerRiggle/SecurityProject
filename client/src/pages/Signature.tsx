import { useEffect, useRef, useState } from "react";
import Button from "react-bootstrap/Button";
import { ReactSketchCanvas, ReactSketchCanvasRef } from "react-sketch-canvas";
import SigAuth from "../auth/SigAuth";
import SweepParameters from "../auth/SwifferSweeper";

const numPasswords: number = 3;

const SignaturePage = () =>
{
    const [inputPasswords, setInputPasswords] = useState<number>(0);

    const canvas = useRef<ReactSketchCanvasRef | null>(null);
    const [auth, setAuth] = useState<SigAuth>();

    const [message, setMessage] = useState<string>(`Input ${numPasswords} of the Same Signature`);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => { setAuth(new SigAuth({
        compressionTolerance: 0.0872665, 
        distanceTolerance: 1.5, 
        angleTolerance: 0.4, 
        sizeTolerance: 0.35, 
        matchPercent: 0.75
    })); }, []);

    return (<div className="d-flex justify-content-center align-items-center flex-column" style={{ minHeight: "100vh" }}>
        <h3 className="mb-4">Sign Here!</h3>
        <div className="border border-dark" style={{width: "600px", height: "400px"}}>
            <ReactSketchCanvas
                strokeWidth={4}
                strokeColor="#FF0000"
                ref={canvas}
                className={`${loading && "d-none"}`}
            />
            {loading && <div className="d-flex justify-content-center align-items-center">
                <div className="spinner-border text-light me-3" />
                <h5 className="m-0">Loading...</h5>
            </div>}
        </div>

        <h5 className="mt-4">System Message: {message}</h5>
        <div className="mt-4 bg-secondary p-3 rounded border border-dark">
            <Button className="me-2" onClick={async () => {
                const cur = canvas.current;
                if (!cur || !auth || loading) { return; }
                setLoading(true);

                // Flat map each of the points in the sections
                const points = [];
                const paths = await cur.exportPaths();
                for (let idx = 0; idx < paths.length; idx++)
                {
                    const section = paths[idx].paths;
                    for (let jdx = 0; jdx < section.length; jdx++)
                    {
                        points.push(section[jdx]);
                    }
                }

                cur.clearCanvas();

                if (inputPasswords >= numPasswords)
                {
                    setMessage(auth.CheckAuth(points).isAuth
                        ? "Authenticated"
                        : "Failed to Authenticate"
                    );
                }
                else
                {
                    const newNum = inputPasswords + 1;
                    auth.AddPasswordData(points);
                    setInputPasswords(newNum);

                    if (newNum === numPasswords)
                    {
                        setMessage(auth.CreatePassword()
                            ? "Password Set! The Test May Begin!"
                            : "Failed to set Password... Please Refresh."
                        );

                        return setLoading(false);
                    }

                    setMessage(`Input ${numPasswords - newNum} More Password to Set.`);
                }

                setLoading(false);
            }}>
                Submit
            </Button>

            <Button className="ms-2 btn-cancel" onClick={() => {
                canvas.current?.clearCanvas();
                setMessage("Canvas Cleared");
            }}>
                Clear
            </Button>
        </div>

        <Button className="mt-3" onClick={() => {
            setLoading(true);
            SweepParameters({
                compressionTolerance: 0.05, 
                distanceTolerance: 0.25, 
                angleTolerance: 0.05, 
                sizeTolerance: 0.05, 
                matchPercent: 0.75
            }, {
                compressionTolerance: 0.1, 
                distanceTolerance: 3, 
                angleTolerance: 0.5, 
                sizeTolerance: 0.45, 
                matchPercent: 1
            });
            setLoading(false);
        }}>
            Clear
        </Button>
    </div>);
}

export default SignaturePage;