import { useState } from 'react'
import { twMerge } from 'tailwind-merge'

import Modal from './lib/modal'

function Search() {
	const [open, setOpen] = useState(false)

	return (
		<div>
			<div
				onClick={() => setOpen(true)}
				className={twMerge(
					'w-9 cursor-pointer select-none overflow-hidden rounded-full border-[1px] px-3 py-[6px] text-sm text-disabledLight hover:border-primary hover:text-primary sm:w-80 md:rounded-md',
				)}
			>
				Search Anything
			</div>

			<Modal open={open} setOpen={setOpen} title="Search Anything">
				<div className="">hello</div>
			</Modal>
		</div>
	)
}

export default Search
