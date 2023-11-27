import { Point } from "react-sketch-canvas";

interface Segment
{
    angle: number;
    distance: number;
}

class SigAuth
{
    private compressionTolerance: number;
    private distanceTolerance: number;
    private angleTolerance: number;
    private sizeTolerance: number;
    private matchPercent: number;

    private passSegments: Segment[][] = [];
    private password: Segment[] = [];

    constructor(
        compressionTolerance: number,
        distanceTolerance: number,
        angleTolerance: number,
        sizeTolerance: number,
        matchPercent: number
    ) {
        this.compressionTolerance = compressionTolerance;
        this.distanceTolerance = distanceTolerance;
        this.angleTolerance = angleTolerance;
        this.sizeTolerance = sizeTolerance;
        this.matchPercent = matchPercent;
    }

    public CreatePassword(): boolean
    {
        if (this.passSegments.length === 0) { return false; }

        this.password = this.passSegments[0];
        for (let idx = 1; idx < this.passSegments.length; idx++)
        {
            let jdx = 0;
            const segments = this.passSegments[idx], beta = 1 - (1 / idx);
            
            for (; jdx < Math.min(this.password.length, segments.length); jdx++)
            {
                this.password[jdx].angle = (
                    beta * this.password[jdx].angle +
                    (segments[jdx].angle / idx)
                );
                this.password[jdx].distance = (
                    beta * this.password[jdx].distance +
                    (segments[jdx].distance / idx)
                );
            }

            for (; jdx < segments.length; jdx++)
            {
                this.password.push(segments[jdx]);
            }
        }

        // Delete old segment data "more secure"
        this.passSegments.splice(0, this.passSegments.length);
        return true;
    }

    private InternalAuthCheck(small: Segment[], large: Segment[]): boolean
    {
        const chunk = Math.ceil(large.length * this.sizeTolerance);
        if ((large.length - small.length) > chunk) { return false; }

        let jdx = 0, count = 0;
        for (let idx = 0; idx < small.length; idx++)
        {
            const s1 = small[idx];
            for (let kdx = jdx; kdx < Math.min(large.length, jdx + chunk); kdx++)
            {
                const s2 = large[kdx];
                const ad = Math.abs(s1.angle - s2.angle);
                const dd = Math.abs(s1.distance - s2.distance);

                if (
                    (!ad || ad <= Math.abs(s2.angle) * this.angleTolerance) &&
                    (dd <= s2.distance * this.distanceTolerance)
                ) {
                    count++;
                    jdx = kdx + 1;
                    break;
                }
            }
        }

        console.log(`AUTH CHECK: ${count / small.length}`)
        return (count / small.length) >= this.matchPercent;
    }

    public CheckAuth(points: Point[]): boolean
    {
        const segments = this.PointsToSegments(points);
        return (segments.length > this.password.length)
        ? this.InternalAuthCheck(this.password, segments)
        : this.InternalAuthCheck(segments, this.password);
    }

    public PointsToSegments(points: Point[]): Segment[]
    {
        const segments: Segment[] = [];

        let idx = 0, maxDist = 0;
        while (idx < points.length - 1)
        {
            const p1 = points[idx];
            const p2 = points[idx + 1];

            const diffX = p2.x - p1.x;
            const diffY = p2.y - p1.y;

            // Prune chained matching data points
            if (!(diffX || diffY))
            {
                points.splice(idx + 1, 1);
                continue;
            }

            idx++;

            // Remove chained segments with matching slope
            const newAngle = diffX ? Math.atan(diffY / diffX) : Infinity;
            const angleDiff = (segments.length > 0)
            ? Math.abs(newAngle - segments[segments.length - 1].angle)
            : Infinity;
            
            if (angleDiff <= this.compressionTolerance || !angleDiff) 
            {
                continue;
            }

            // Push resulting segment
            const distance = Math.sqrt((diffX * diffX) + (diffY * diffY));
            maxDist = Math.max(maxDist, distance);
            segments.push({
                angle: newAngle,
                distance: distance
            });
        }

        // Normalize the distance values
        segments.forEach((segment) => {
            segment.distance /= maxDist;
        });

        return segments;
    }

    public AddPasswordData(points: Point[])
    {
        this.passSegments.push(
            this.PointsToSegments(points)
        );
    }
}

export default SigAuth;