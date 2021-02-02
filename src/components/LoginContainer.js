import { Card, Container, Row, Col } from 'react-bootstrap';
import React from 'react';

import LoginForm from './LoginForm';

import './LoginContainer.css';

export default function LoginContainer(props) {
	return (
		<div>
			<Container flex className="value-prop">
				<Row auto>
					<Col sm className="value-prop-card">
						<Card >
							<h3>Supercharge your practice sessions</h3>
							<h5>
								<p> Daily Clef helps you get the most out of your practice sessions with automated track logging and intelligent music classification </p>
								<p> Just hit record </p>
								<p> Intelligent Recognition </p>
								<p> Visualized progress </p>

							</h5>
						</Card>
					</Col>
					<Col sm>
						<Card>
							<LoginForm handle_login={props.handle_login} />
						</Card>
					</Col>
				</Row>
			</Container>
		</div>);
}
