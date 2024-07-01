import { getUniqueObjectsByKey, mimeTypes } from '@utils/helpers'
import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'

type UploaderProps = {
	onFinalize: (urls: string[]) => void
}

function Uploader(props: UploaderProps) {
	const [files, setFiles] = useState<File[]>([])
	const onDrop = useCallback((acceptedFiles: File[]) => {
		setFiles((prevFiles) => getUniqueObjectsByKey([...prevFiles, ...acceptedFiles], 'name'))
	}, [])

	const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { [mimeTypes.pdf]: [] } })

	// const { mutate: uploadFile } = useMutation({
	// 	mutationKey: ['drive', 'upload-file'],
	// 	mutationFn: (data: { url: string; key: string; file: File }) =>
	// 		fetch(data.url, { method: 'PUT', body: data.file, headers: { 'Content-Type': 'multipart/form-data' } }),
	// })

	// const { mutate: handleUpload } = useMutation({
	// 	mutationKey: ['drive', 'get-signed-url'],
	// 	mutationFn: (file: File) => {
	// 		const fileType = file.type || file.name.split('.').pop()
	// 		return apiClient('/drive/get-signed-url', { method: 'POST', body: JSON.stringify({ name: file.name, type: fileType }) })
	// 	},
	// 	onSuccess: (data: { key: string; url: string }, file) => uploadFile({ ...data, file }),
	// })

	// function handleEditForm(e: FormEvent<HTMLFormElement>) {
	// 	e.preventDefault()
	// 	const formData = new FormData(e.target as HTMLFormElement)
	// 	const file = formData.get('file') as File
	// 	if (!file) return

	// 	handleUpload(file)
	// }

	return (
		<div className="h-full w-full rounded-lg">
			{files.map((file) => (
				<div key={file.name} className="bg-red-100 p-2">
					{file.name}
				</div>
			))}
			<div className="h-full" {...getRootProps()}>
				<input {...getInputProps()} />
				{isDragActive ? <div>Drop the files here ...</div> : <div>Drag 'n' drop some files here, or click to select files</div>}
			</div>
		</div>
	)
}

export default Uploader
