function SkeletonCardList(props: { contentLength?: number }) {
	return (
		<div className="animate-pulse">
			<div className="mb-4 flex justify-between">
				{Array(2)
					.fill(1)
					.map((_, i) => (
						<div key={`skeleton-cardlist-header-${i}`} className="h-12 w-1/4 rounded bg-skeletonDark" />
					))}
			</div>

			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				{Array(props.contentLength ?? 10)
					.fill(1)
					.map((_, i) => (
						<div key={`skeleton-cardlist-contents-${i}`} className="mb-1 h-16 rounded-lg bg-skeletonLight py-5 sm:h-24 md:h-28" />
					))}
			</div>
		</div>
	)
}

export default SkeletonCardList
