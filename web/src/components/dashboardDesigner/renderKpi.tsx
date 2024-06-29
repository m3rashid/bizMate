import Tooltip from '../lib/tooltip'
import { InformationCircleIcon } from '@heroicons/react/24/outline'

type RenderKpiProps = {
	title: string
	description: string
	data: number
}

function RenderKpi({ data, description, title }: RenderKpiProps) {
	return (
		<div className="h-min w-64 select-none rounded-lg border-2 border-white bg-white p-2.5 shadow-lg hover:border-primary">
			<div className="flex items-center gap-2 text-disabled">
				<h3 className="mb-1 font-semibold">{title}</h3>
				{description ? (
					<Tooltip label={description} show="right">
						<InformationCircleIcon className="h-4 w-4" />
					</Tooltip>
				) : null}
			</div>
			<div className="my-4 mt-6 h-10 text-center text-5xl font-bold">{data}</div>
		</div>
	)
}

export default RenderKpi
