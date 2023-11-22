const data = require("./data.json");

/**
 * Compares two pieces of signature data and compares them
 * @param {number[]} signature The original signature data
 * @param {number[]} slopeSegments The attempted signature data
 * @returns {boolean} The authentication result
 */
const AuthMethod = (
    signature,
    slopeSegments,
    PADDING,
    AUTH_MATCH,
    AUTH_TOLERANCE
) => {
    let match = 0;
    for (let idx = 0; idx < slopeSegments.length; idx++)
    {
        const val = slopeSegments[idx];
        const end = Math.min(signature.length, idx + PADDING);
        for (let jdx = Math.max(
            0, idx - PADDING
        ); jdx < end; jdx++)
        {
            const diff = Math.abs(val - signature[jdx]);
            if (diff <= AUTH_TOLERANCE || !diff)
            {
                match++;
                break;
            }
        }
    }
    return (match / slopeSegments.length) >= AUTH_MATCH;
}


const MATCH_START = 0;
const MATCH_END = 1;
const MATCH_STEP = 0.01;

const TOL_START = 0;
const TOL_END = 5;
const TOL_STEP = 0.01;

const PAD_START = 0;
const PAD_END = 4;
const PAD_STEP = 1;

let minVal = Infinity;
let maxScore = -1;
let params = {
    padding: -1,
    match: -1,
    tolerance: -1
};

for (let padding = PAD_START; padding < PAD_END + PAD_STEP; padding += PAD_STEP)
{
    const padVal = padding / PAD_END;
    for (let tolerance = TOL_START; tolerance < TOL_END + TOL_STEP; tolerance += TOL_STEP)
    {
        const tolVal = tolerance / TOL_END;
        for (let match = MATCH_START; match < MATCH_END + MATCH_STEP; match += MATCH_STEP)
        {
            let score = 0;
            data.signatures.forEach((sigData) => {
                sigData.accept.forEach((accept) => {
                    score += AuthMethod(sigData.original, accept, padding, match, tolerance) ? 1 : 0;
                });

                sigData.deny.forEach((deny) => {
                    score += AuthMethod(sigData.original, deny, padding, match, tolerance) ? 0 : 1;
                });
            });

            const val = padVal + tolVal + match;
            if (score >= maxScore && val < minVal)
            {
                params.padding = padding;
                params.tolerance = tolerance;
                params.match = match;
                minVal = val;
                maxScore = score;
            }
        }
    }
}

console.log(`MAX SCORE: ${maxScore}\nMIN VALUE: ${minVal}`);
console.log(`BEST PARAMS: \n\tPADDING: ${params.padding}\n\tTOLERANCE: ${params.tolerance}\n\tMATCH: ${params.match}`);