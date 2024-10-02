import { Button, Card, Container, Row, Col } from 'react-bootstrap';
import React, { useState } from 'react';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';

export default function LoginContainer(props) {
  const [signup, setSignup] = useState(false);

  const toggleSignup = () => {
    setSignup(!signup)
  }

  return (
    <div>
      <Container className="value-prop">
        <Row className="g-4">
          <Col md={6}>
            <Card>
              <Card.Body>
                <Card.Title as="h3">Supercharge your practice sessions</Card.Title>
                <Card.Text as="h5">
                  <p>Daily Clef helps you get the most out of your practice sessions with automated track logging and intelligent music classification</p>
                  <p>Just hit record</p>
                  <p>Intelligent Recognition</p>
                  <p>Visualized progress</p>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card>
              <Card.Body>
                <Button variant="secondary" onClick={toggleSignup} className="mb-3">
                  {signup ? "Login to existing account" : "Create new account"}
                </Button>
                {signup ? <SignupForm api={props.api} /> : <LoginForm api={props.api} />}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
