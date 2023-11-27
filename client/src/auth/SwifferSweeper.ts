import SweepData from "./swiffer-data.json";
import SigAuth, { SigParameters } from "./SigAuth";

const Core = (params: SigParameters): number =>
{
    let score = 0;
    const auth = new SigAuth(params);

    for (const test of SweepData.data)
    {
        for (const pass of test.password)
        {
            auth.AddPasswordData(pass);
        }
        auth.CreatePassword();

        for (const accept of test.accept)
        {
            score += auth.CheckAuth(accept).score;
        }

        for (const deny of test.deny)
        {
            score -= auth.CheckAuth(deny).score;
        }
    }

    return score;
}

const SweepParameters = (
    low: SigParameters,
    high: SigParameters,
    granularity: number
) => {
    const results = new Map<number, SigParameters>();

    const compStep = (high.compressionTolerance - low.compressionTolerance) / granularity;
    const distStep = (high.distanceTolerance - low.distanceTolerance) / granularity;
    const angleStep = (high.angleTolerance - low.angleTolerance) / granularity;
    const sizeStep = (high.sizeTolerance - low.sizeTolerance) / granularity;
    const matchStep = (high.matchPercent - low.matchPercent) / granularity;

    for (let comp = low.compressionTolerance; comp < high.compressionTolerance; comp += compStep)
    {
        for (let dist = low.distanceTolerance; dist < high.distanceTolerance; dist += distStep)
        {
            for (let angle = low.angleTolerance; angle < high.angleTolerance; angle += angleStep)
            {
                for (let size = low.sizeTolerance; size < high.sizeTolerance; size += sizeStep)
                {
                    for (let match = low.matchPercent; match < high.matchPercent; match += matchStep)
                    {
                        const params: SigParameters = {
                            compressionTolerance: comp,
                            distanceTolerance: dist,
                            angleTolerance: angle,
                            sizeTolerance: size,
                            matchPercent: match
                        };
                        results.set(Core(params), params);
                    }
                }
            }
        }
    }

    let min = Infinity;
    for (const score of Array.from(results.keys()))
    {
        min = Math.min(score, min);
    }
    console.log(`BEST PARAMETERS:\n${results.get(min)}`);
}

export default SweepParameters;