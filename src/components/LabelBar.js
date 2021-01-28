import React, { useState, useEffect } from 'react';

import { Accordion, Card, Button, ListGroup } from 'react-bootstrap';

import './LabelBar.css';
import Label from './Label';

export default function LabelBar(props) {
	const [labels, setLabels] = useState([])

	useEffect(()=>{
		props.api.loadLabels().then((labels) => {
			setLabels(labels)
		})
	},[])

	return (
		<div>
		<Accordion>
			<Card>
				<Card.Header>
					<Accordion.Toggle as={Button} variant="link" eventKey="0">
						<h5>Pieces</h5>
					</Accordion.Toggle>
				</Card.Header>
				<Accordion.Collapse eventKey="0">
					<ListGroup>
						{
							labels.map((label, index) => {
								return (
								<ListGroup.Item>
								<Label label={label.name} key={label.name} loadClipsForLabel={props.loadClipsForLabel} />
								</ListGroup.Item>
								)
							})
						}  						
					</ListGroup>
				</Accordion.Collapse>
			</Card>
		</Accordion>		
		</div>
		);
}
