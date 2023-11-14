const PageCard = (props: {
    label: string;
    href: string;
    imageName: string;
}) =>
{
    return (
        <a href={props.href} className="m-3">
            <div className="page-card grow">
                <div className="position-absolute top-0 bottom-0 start-0 end-0 bg-black" style={{
                    zIndex: -2
                }}/>
                <div className="blur-bg" style={{
                    backgroundImage: `url(/images/${props.imageName})`,
                    zIndex: -1
                }} />
                <h1 className="m-0 py-3 bg-black w-100 text-center">
                    {props.label}
                </h1>
            </div>
        </a>
    );
}

const HomePage = () =>
{
    return (<>
        <h1 className="w-100 text-center my-5 display-3">Select an Authentication Method</h1>

        <br/>
        
        <div className="d-flex flex-wrap w-100 justify-content-around">
            <PageCard
                label="Standard"
                href="/standard"
                imageName="lock.jpg"
            />
            <PageCard
                label="RFID Tag"
                href="/rfid"
                imageName="chip.jpg"
            />
            <PageCard
                label="Signature"
                href="/signature"
                imageName="quil.jpg"
            />
        </div>
    </>);
}

export default HomePage;