import React from 'react';

import UploadPDF from './UploadPDF';

export default class PDFDisplay extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			uploadedFile: null
		}
	}

	onUploaded = (url) => {
		this.setState({
			uploadedFile: url
		})
	}

	render() {
		const file = this.state.uploadedFile || this.props.file
		return (
			<>
				{
					file
						? <iframe title="Sheet music" src={`https://docs.google.com/viewerng/viewer?embedded=true&url=${file}`} width="100%" height="900px" />
						: ""
				}
				<p>
					<UploadPDF onUploaded={this.onUploaded} title="Replace PDF" api={this.props.api} piece={this.props.piece} />
				</p>
			</>
		);
	}
}