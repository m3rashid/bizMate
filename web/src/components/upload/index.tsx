import { FormEvent } from 'react'
import { useMutation } from '@tanstack/react-query'

import Input from '../lib/input'
import Button from '../lib/button'
import apiClient from '../../api/client'

type UploadProps = {}

function Upload(props: UploadProps) {
	const { mutate: uploadFile } = useMutation({
		mutationKey: ['drive', 'upload-file'],
		mutationFn: (data: { url: string; key: string; file: File }) =>
			fetch(data.url, { method: 'PUT', body: data.file, headers: { 'Content-Type': 'multipart/form-data' } }),
	})

	const { mutate: handleUpload } = useMutation({
		mutationKey: ['drive', 'get-signed-url'],
		mutationFn: (file: File) => {
			const fileType = file.type || file.name.split('.').pop()
			return apiClient('/drive/get-signed-url', { method: 'POST', body: JSON.stringify({ name: file.name, type: fileType }) })
		},
		onSuccess: (data: { key: string; url: string }, file) => uploadFile({ ...data, file }),
	})

	function handleEditForm(e: FormEvent<HTMLFormElement>) {
		e.preventDefault()
		const formData = new FormData(e.target as HTMLFormElement)
		const file = formData.get('file') as File
		if (!file) return

		handleUpload(file)
	}

	return (
		<form className="mb-8 flex h-full max-w-sm flex-col gap-4" onSubmit={handleEditForm}>
			<Input type="file" name="file" />
			<Button type="submit">Save</Button>
		</form>
	)
}

export default Upload
