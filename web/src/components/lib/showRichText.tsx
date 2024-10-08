'use client';

import { cn } from '@/utils/helpers';
import { safeJsonParse } from '@/utils/helpers';
import { BlockNoteView } from '@blocknote/mantine';
import '@blocknote/mantine/style.css';
import { useCreateBlockNote } from '@blocknote/react';

export type ShowRichTextProps = {
	data: string;
	className?: string;
};

export function ShowRichText(props: ShowRichTextProps) {
	const editor = useCreateBlockNote({
		...(!!props.data ? { initialContent: safeJsonParse(props.data, undefined, (res) => res.length > 0) } : {}),
	});

	if (!props.data) return null;
	return (
		<BlockNoteView
			theme='light'
			editor={editor}
			editable={false}
			className={cn('my-4 block w-full rounded-md border-0 text-gray-900 shadow-md sm:text-sm sm:leading-6', props.className)}
		/>
	);
}
