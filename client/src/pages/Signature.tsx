import { useRef, useState } from "react";
import Button from "react-bootstrap/Button";
import { ReactSketchCanvas, ReactSketchCanvasRef } from "react-sketch-canvas";

const SignaturePage = () =>
{
    const canvas = useRef<ReactSketchCanvasRef | null>(null);
    const [message, setMessage] = useState<string>("N/A");

    return (<div className="d-flex justify-content-center align-items-center flex-column" style={{ minHeight: "100vh" }}>
        <h3 className="mb-4">Sign Here!</h3>
        <div className="w-50 border border-dark" style={{height: "50vh"}}>
            <ReactSketchCanvas
                strokeWidth={4}
                strokeColor="#FF0000"
                ref={canvas}
            />
        </div>

        <h5 className="mt-4">System Message: {message}</h5>
        <div className="mt-4 bg-secondary p-3 rounded border border-dark">
            <Button className="me-2" onClick={() => {
                console.log(canvas.current?.exportPaths())
            }}>
                Submit
            </Button>

            <Button className="ms-2 btn-cancel" onClick={() => {
                canvas.current?.clearCanvas();
            }}>
                Clear
            </Button>
        </div>
    </div>);
}

export default SignaturePage;