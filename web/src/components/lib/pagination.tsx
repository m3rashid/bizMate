import Button from '@components/lib/button'
import Chip from '@components/lib/chip'
import { PaginationType } from '@mytypes'

type PaginationProps = PaginationType & {
	onPreviousClick: () => void
	onNextClick: () => void
}

function Pagination(props: PaginationProps) {
	return (
		<nav className="flex items-center justify-between border-b-2 border-pageBg bg-white p-2" aria-label="Pagination">
			<div className="hidden sm:block">
				<p className="text-sm text-gray-700">
					Showing <span className="font-semibold">{Math.min(props.page * props.limit, props.count)}</span> of&nbsp;
					<span className="font-semibold">{props.totalDocs}</span> results
				</p>
			</div>
			<div className="flex flex-1 justify-between gap-4 sm:justify-end">
				<Button size="small" variant="simple" disabled={!props.hasPreviousPage} onClick={props.onPreviousClick}>
					Previous
				</Button>

				<Chip variant="simple" className="h-full">
					{props.page}
				</Chip>

				<Button size="small" variant="simple" disabled={!props.hasNextPage} onClick={props.onNextClick}>
					Next
				</Button>
			</div>
		</nav>
	)
}

export default Pagination
