import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';

const Login = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    function validateForm() {
        return email.length > 0 && password.length > 0;
    }

    return (
        <React.Fragment>
        <Form>
            <Form.Group controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" placeholder="Enter email" onChange={ event => setEmail(event.target.value) }/>
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Password" onChange = { event => setPassword(event.target.value) } />
            </Form.Group>
  
            <Link onClick={event => (!email || ! password) ? event.preventDefault() : null} to={`/welcome`}>
                <Button variant="primary" type="submit">Enter</Button>
            </Link>
                
        </Form>
        </React.Fragment>
    );
}

export default Login;