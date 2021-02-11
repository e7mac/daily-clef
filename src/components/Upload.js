import { Form, Button } from 'react-bootstrap';
import React, { useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCloudUploadAlt } from '@fortawesome/free-solid-svg-icons'

export default function Upload(props) {

	const fileRef = useRef(null)

	const submitClicked = (e) => {
		const fileInput = fileRef.current
		const files = fileInput.files;
		for (let file of files) {
			const modified = Math.floor(file.lastModified / 1000);
			props.setStatus("Uploading...")
			props.api.uploadFileFlow(file, modified)
				.then(() => {
					fileInput.value = ''
					props.setStatus("✅ Uploaded")
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
					<Form.File onChange={submitClicked} ref={fileRef} accept="audio/*, video/*" />
				</Form.Group>
			</Form>
			<Button variant="outline-success" onClick={upload}><FontAwesomeIcon icon={faCloudUploadAlt} /></Button>
		</span>
	);
}
