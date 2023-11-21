import { useRef, useState } from "react";
import Button from "react-bootstrap/Button";
import { Point, ReactSketchCanvas, ReactSketchCanvasRef } from "react-sketch-canvas";

const TOLERANCE = 0.05;
const AUTH_TOLERANCE = 10;
const AUTH_MATCH = 0.8;

const SignaturePage = () =>
{
    const canvas = useRef<ReactSketchCanvasRef | null>(null);

    const [message, setMessage] = useState<string>("Waiting for First Signature...");
    const [loading, setLoading] = useState<boolean>(false);

    const [signature, setSignature] = useState<number[]>([]);

    const reducePoints = (points: Point[]): number[] => 
    {
        const slopes: number[] = [];

        let idx = 0;
        while (idx < points.length - 1)
        {
            const p1 = points[idx];
            const p2 = points[idx + 1];

            const difX = p2.x - p1.x;
            const difY = p2.y - p1.y;

            if (!(difX || difY))
            {
                points.splice(idx + 1, 1);
                continue;
            }

            slopes.push(difX ? difY / difX : Infinity);
            idx++;
        }

        idx = 0;
        while (idx < slopes.length - 1)
        {
            const diff = Math.abs(slopes[idx] - slopes[idx + 1]);
            if (diff <= TOLERANCE || !diff)
            {
                slopes.splice(idx + 1, 1);
                continue;
            }
            idx++;
        }

        return slopes;
    }

    const handleState = (slopeSegments: number[]) =>
    {
        if (slopeSegments.length === 0) { return; }
        if (signature.length === 0)
        {
            setSignature(slopeSegments);
            setMessage("Ready for Authentication!");
            return;
        }

        let match = 0;

        // TODO Do Authentication Work

        setMessage((match >= AUTH_MATCH) ? "Authenticated!" : "Not Authenticated...");
    }

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
                if (!cur) { return; }
                setLoading(true);

                const pointCollection = [];
                const paths = await cur.exportPaths();
                for (const path of paths)
                {
                    pointCollection.push(reducePoints(path.paths));
                }

                handleState(pointCollection.flat());

                cur.clearCanvas();
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
    </div>);
}

export default SignaturePage;