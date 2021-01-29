import React, { useState, useEffect } from 'react';

import { Card, Container, Row, Col, Button } from 'react-bootstrap';

import './LoginContainer.css';
import LoginForm from './LoginForm';

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