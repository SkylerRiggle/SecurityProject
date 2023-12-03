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

const SweepParameters = async (
    low: SigParameters,
    high: SigParameters,
    granularity: number
) => {
    const results = new Map<number, SigParameters>();

    for (let comp = low.compressionTolerance; comp < high.compressionTolerance; comp += granularity)
    {
        for (let dist = low.distanceTolerance; dist < high.distanceTolerance; dist += granularity)
        {
            for (let angle = low.angleTolerance; angle < high.angleTolerance; angle += granularity)
            {
                for (let size = low.sizeTolerance; size < high.sizeTolerance; size += granularity)
                {
                    for (let match = high.matchPercent; match >= low.matchPercent; match -= granularity)
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

    let max = -Infinity;
    for (const score of Array.from(results.keys()))
    {
        max = Math.max(score, max);
    }

    const best = results.get(max);
    console.log("BEST PARAMS:\n--------------------");
    console.log(`SCORE: ${max}`);
    console.log(`COMPRESSION: ${best?.compressionTolerance}`);
    console.log(`DISTANCE: ${best?.distanceTolerance}`);
    console.log(`ANGLE: ${best?.angleTolerance}`);
    console.log(`SIZE: ${best?.sizeTolerance}`);
    console.log(`MATCH: ${best?.matchPercent}`);
}

export default SweepParameters;