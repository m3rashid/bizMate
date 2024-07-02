import Button from '@components/lib/button'
import useAddDashboardWidget from '@hooks/addDashboardWidget'
import { FormEvent } from 'react'

type SelectTypeProps = {}

function SelectType(props: SelectTypeProps) {
	const {} = useAddDashboardWidget()

	function handleAddWidget(e: FormEvent<HTMLFormElement>) {
		e.preventDefault()
		const formData = Object.fromEntries(new FormData(e.target as HTMLFormElement).entries()) as any
		console.log(formData)
	}

	return (
		<form className="h-full" onSubmit={handleAddWidget}>
			<div className="flex flex-col gap-4 p-4"></div>

			<div className="flex flex-grow-0 items-center justify-between border-t border-borderColor px-3 py-2">
				<Button variant="simple" type="reset">
					Reset
				</Button>
				<Button type="submit">Create</Button>
			</div>
		</form>
	)
}

export default SelectType
