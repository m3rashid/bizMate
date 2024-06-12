const SkeletonTable = (props: { contentLength?: number }) => {
	return (
		<div className="animate-pulse">
			<div className="mb-4 flex justify-between">
				{Array(2)
					.fill(1)
					.map((_, i) => (
						<div key={`skeleton-table-header-${i}`} className="bg-skeletonDark h-12 w-1/4 rounded" />
					))}
			</div>
			<div className="bg-skeletonDark mb-4 p-6"></div>

			{Array(props.contentLength ?? 10)
				.fill(1)
				.map((_, i) => (
					<div key={`skeleton-table-contents-${i}`} className="bg-skeletonLight mb-1 py-5" />
				))}
		</div>
	)
}

export default SkeletonTable
