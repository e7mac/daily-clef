import { Document, Page, pdfjs } from 'react-pdf';
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import React, { useState, useEffect } from 'react';

export default function PDFDisplay(props) {
	const [numPages, setNumPages] = useState(null);
	const [pageNumber, setPageNumber] = useState(1);
	const handle = useFullScreenHandle();

	useEffect(() => {
		// Runs ONCE after initial rendering
		pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
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
					<p>
						Page {pageNumber || (numPages ? 1 : '--')} of {numPages || '--'}
					</p>
					<button
						type="button"
						disabled={pageNumber <= 1}
						onClick={previousPage}
					>
						Previous
        		</button>
					<button
						type="button"
						disabled={pageNumber >= numPages}
						onClick={nextPage}
					>
						Next
        		</button>
				</div>
				<Document
					file={props.file}
					onLoadSuccess={onDocumentLoadSuccess}
				>
					<Page pageNumber={pageNumber} />
				</Document>
			</>
		)
	}

	return (
		<>
			<div>
				<button onClick={handle.enter}>
					Enter fullscreen
      			</button>

				<FullScreen handle={handle}>
					{pdfPage()}
				</FullScreen>
			</div>
			{pdfPage()}
		</>
	);
}