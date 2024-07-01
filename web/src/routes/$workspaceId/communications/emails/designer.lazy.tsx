import EmailEditorTopBar from '@components/communications/emailEditorTopBar'
import PageContainer from '@components/pageContainer'
import { createLazyFileRoute } from '@tanstack/react-router'
import { useRef, useState } from 'react'
import EmailEditor, { EditorRef, EmailEditorProps } from 'react-email-editor'

export const Route = createLazyFileRoute('/$workspaceId/communications/emails/designer')({
	component: EmailDesigner,
})

function EmailDesigner() {
	const emailEditorRef = useRef<EditorRef>(null)
	const [editorReady, setEditorReady] = useState(false)

	const onReady: EmailEditorProps['onReady'] = (unlayer) => {
		setEditorReady(true)
		// editor is ready
		// you can load your template here;
		// the design json can be obtained by calling
		// unlayer.loadDesign(callback) or unlayer.exportHtml(callback)
		// const templateJson = { DESIGN JSON GOES HERE };
		// unlayer.loadDesign(templateJson);
	}

	return (
		<PageContainer>
			{editorReady ? <EmailEditorTopBar emailEditorRef={emailEditorRef} /> : null}

			<EmailEditor
				ref={emailEditorRef}
				onReady={onReady}
				options={{
					appearance: {},
				}}
				style={{ height: 'calc(100vh - 120px)' }}
			/>
		</PageContainer>
	)
}
