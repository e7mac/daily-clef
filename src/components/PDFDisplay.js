import { Button } from 'react-bootstrap';
import { Document, Page, pdfjs } from 'react-pdf';
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import React, { useState, useEffect } from 'react';
import Viewer, { Worker } from '@phuocng/react-pdf-viewer';

import '@phuocng/react-pdf-viewer/cjs/react-pdf-viewer.css';

export default function PDFDisplay(props) {
	const [numPages, setNumPages] = useState(null);
	const [pageNumber, setPageNumber] = useState(1);
	const handle = useFullScreenHandle();

	useEffect(() => {
		// Runs ONCE after initial rendering
		// pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
	}, []);

	function onDocumentLoadSuccess({ numPages }) {
		setNumPages(numPages);
		setPageNumber(1);
	}

	function changePage(offset) {
		setPageNumber(prevPageNumber => prevPageNumber + offset);
	}

	function previousPage() {
		changePage(-1);
	}

	function nextPage() {
		changePage(1);
	}

	function pdfPage() {
		return (
			<>
				<div>
					<div>
						<p>
							Page {pageNumber || (numPages ? 1 : '--')} of {numPages || '--'}
						</p>
						<Button
							variant="light"
							disabled={pageNumber <= 1}
							onClick={previousPage}>
							Previous
						</Button>
						<Button
							variant="light"
							disabled={pageNumber >= numPages}
							onClick={nextPage}>
							Next
						</Button>
					</div>
					<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
						<Document
							file={props.file}
							onLoadSuccess={onDocumentLoadSuccess}
						>
							<Page pageNumber={pageNumber} />
						</Document>
					</div>
				</div>
			</>
		)
	}

	return (
		<>
			<div>
				<Worker workerUrl="https://unpkg.com/pdfjs-dist@2.5.207/build/pdf.worker.min.js">
					<div style={{ height: '750px' }}>
						<Viewer fileUrl={props.file} />
					</div>
				</Worker>
				<Button
					variant="light"
					onClick={handle.enter}>
					Enter fullscreen
				</Button>
				<FullScreen handle={handle}>
					{pdfPage()}
				</FullScreen>
			</div>
			{pdfPage()}
		</>
	);
}