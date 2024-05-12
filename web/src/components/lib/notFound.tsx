export type NotFoundProps = {
	//
}

export function NotFound({}: NotFoundProps) {
	return (
		<div>
			<h1>Not Found</h1>
		</div>
	)
}

export function PageNotFound(props: NotFoundProps) {
	return (
		<div className="flex h-full min-h-96 items-center justify-center">
			<NotFound {...props} />
		</div>
	)
}
