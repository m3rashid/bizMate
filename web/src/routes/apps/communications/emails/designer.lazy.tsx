import { useRef, useState } from 'react'
import { createLazyFileRoute } from '@tanstack/react-router'
import EmailEditor, { EditorRef, EmailEditorProps } from 'react-email-editor'

import PageContainer from '../../../../components/pageContainer'
import EmailEditorTopBar from '../../../../components/emailDesigner/topBar'

export const Route = createLazyFileRoute('/apps/communications/emails/designer')({
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
				style={{ height: 'calc(100vh - 125px)' }}
			/>
		</PageContainer>
	)
}
