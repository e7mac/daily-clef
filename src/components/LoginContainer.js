import { Button, Card, CardDeck, Container, Row } from 'react-bootstrap';
import { React, useState } from 'react';

import LoginForm from './LoginForm';
import SignupForm from './SignupForm';

export default function LoginContainer(props) {
	const [signup, setSignup] = useState(false);

	const toggleSignup = () => {
		setSignup(!signup)
	}

	return (
		<div>
			<Container flex className="value-prop">
				<Row auto>
					<CardDeck>
						<Card >
							<h3>Supercharge your practice sessions</h3>
							<h5>
								<p> Daily Clef helps you get the most out of your practice sessions with automated track logging and intelligent music classification </p>
								<p> Just hit record </p>
								<p> Intelligent Recognition </p>
								<p> Visualized progress </p>
							</h5>
						</Card>
						<Card>
							<Button variant="secondary" onClick={toggleSignup}>
								{
									signup
										? "Login to existing account"
										: "Create new account"
								}
							</Button>
							{
								signup
									? <SignupForm api={props.api} />
									: <LoginForm api={props.api} />
							}
						</Card>
					</CardDeck>
				</Row>
			</Container>
		</div>)
		;
}
