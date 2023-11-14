import { useState } from "react";
import Form from "react-bootstrap/Form";

const StandardPage = () =>
{
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const attemptLogin = () =>
    {
        console.log(`${username}, ${password}`);
    }

    return (
        <div className="w-100 vh-100 d-flex justify-content-center align-items-center">
            <Form onSubmit={attemptLogin}>
                <div className="w-100 d-flex justify-content-center">
                    <img src="/images/person.jpg" alt="Person" width="100px" className="rounded-circle border shadow" />
                </div>
                <h3 className="display-2 w-100 text-center">Login</h3>

                <br />

                <span>Username:</span>
                <Form.Control
                    placeholder="Enter Username..."
                    onChange={(e) => {
                        setUsername(e.currentTarget.value);
                    }}
                />

                <br />
                
                <span>Password:</span>
                <Form.Control
                    placeholder="Enter Password..."
                    type="password"
                    onChange={(e) => {
                        setPassword(e.currentTarget.value);
                    }}
                />

                <br />

                <div className="d-flex justify-content-around">
                    <Form.Control
                        className="btn text-white"
                        style={{width:"fit-content"}}
                        type="submit"
                        value="Login"
                    />

                    <a href="/" className="btn text-white">
                        Back
                    </a>
                </div>
            </Form>
        </div>
    );
}

export default StandardPage;