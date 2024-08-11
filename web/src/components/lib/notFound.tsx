export type NotFoundProps = {
	title?: string;
};

export function NotFound(props: NotFoundProps) {
	return (
		<div>
			<h1>{props.title}</h1>
		</div>
	);
}

export function PageNotFound(props: NotFoundProps) {
	return (
		<div className='flex h-full min-h-96 items-center justify-center'>
			<NotFound title='Page not found' {...props} />
		</div>
	);
}

export function WorkspaceNotFound(props: NotFoundProps) {
	return (
		<div className='flex h-full min-h-96 items-center justify-center'>
			<NotFound title='Workspace not found' {...props} />
		</div>
	);
}
