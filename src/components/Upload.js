import React, { useRef } from 'react';

import './Upload.css';

export default function Upload(props) {

	const fileRef = useRef(null)

	const submitClicked = (e) => {
		e.preventDefault()
		const fileInput = fileRef.current
  		const files = fileInput.files;
  		for (let file of files) {
  			const modified = Math.floor(file.lastModified/1000);
  			props.api.uploadFileFlow(file, modified)
  			.then(() => {
  				fileInput.value = ''
  				alert("file uploaded! thanks!")
  			})
  		}
	}

	return (
		<span>
			<form onSubmit={submitClicked}>
			<input ref={fileRef} type="file" name="files" />
			<input type="submit" name="submit" value="Upload" />
			</form>
		</span>
	);
}
