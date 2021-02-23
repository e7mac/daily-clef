import { Form, Button } from 'react-bootstrap';
import React, { useRef } from 'react';

export default function UploadPDF(props) {

	const fileRef = useRef(null)

	const submitClicked = (e) => {
		const fileInput = fileRef.current
		const files = fileInput.files;
		for (let file of files) {
			const modified = Math.floor(file.lastModified / 1000);
			// props.setStatus("Uploading...")
			props.api.uploadFileFlow(file, modified, {}, props.piece)
				.then((res) => {
					console.log(res)
					props.onUploaded(res.url)
					fileInput.value = ''
				})
		}
	}

	const upload = (e) => {
		fileRef.current.click()
	}

	return (
		<span>
			<Form hidden={true}>
				<Form.Group>
					<Form.File onChange={submitClicked} ref={fileRef} accept="application/pdf" />
				</Form.Group>
			</Form>
			<Button variant="light" onClick={upload}>{props.title || "Upload PDF"}</Button>
		</span>
	);
}
