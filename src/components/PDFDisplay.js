import { Document, Page, pdfjs } from 'react-pdf';
import React from 'react';

export default class PDFDisplay extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			numPages: 0,
			pageNumber: 0
		}
	}

	componentDidMount() {
		pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
	}

	onDocumentLoadSuccess = ({ numPages }) => {
		this.setState({
			numPages: numPages,
			pageNumber: 1
		})
	}

	changePage = (offset) => {
		const pageNumber = this.state.pageNumber;
		this.setState({
			pageNumber: pageNumber + offset
		})
	}

	previousPage = () => {
		this.changePage(-1);
	}

	nextPage = () => {
		this.changePage(1);
	}

	render() {
		return (
			<span>
				{this.props.file
					? <div>
						<p>
							<div>
								<p>
									Page {this.state.pageNumber || (this.state.numPages ? 1 : '--')} of {this.state.numPages || '--'}
								</p>
								<button
									type="button"
									disabled={this.state.pageNumber <= 1}
									onClick={this.previousPage}
								>
									Previous
        							</button>
								<button
									type="button"
									disabled={this.state.pageNumber >= this.state.numPages}
									onClick={this.nextPage}
								>
									Next
        						</button>
							</div>
							<Document
								file={this.props.file}
								onLoadSuccess={this.onDocumentLoadSuccess}
							>
								<Page pageNumber={this.state.pageNumber} />
							</Document>
						</p>
					</div>
					: ""
				}
			</span >
		);
	}
}
