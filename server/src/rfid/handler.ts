/* Key Value For Blue Card */
const KEY = "8A3A4580";

const handleRFID = (dataInput: any) =>
{
    // CAMERON
    // Write Your Own Handler Here...
    console.log(`Key Value: ${dataInput}`);
    console.log(dataInput == KEY
        ? "Authenticated"
        : "Not Authenticated..."
    );
}

export default handleRFID;