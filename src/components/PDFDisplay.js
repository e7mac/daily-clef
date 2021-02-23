import React from 'react';

export default function PDFDisplay(props) {
	return (
		<>
			<iframe title="Sheet music" src={`https://docs.google.com/viewer?embedded=true&url=${props.file}`} width="100%" height="900px" />
		</>
	);
}