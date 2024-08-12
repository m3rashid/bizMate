'use client';

import { Modal } from '@/components/lib/modal';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';

export function Search() {
	const { t } = useTranslation();
	const [open, setOpen] = useState(false);

	return (
		<div>
			<div
				onClick={() => setOpen(true)}
				className={twMerge(
					'w-9 cursor-pointer select-none overflow-hidden rounded-full border-[1px] px-3 py-[6px] text-sm text-disabledLight hover:border-primary hover:text-primary sm:w-80 md:rounded-md'
				)}
			>
				{t('Search Anything')}
			</div>

			<Modal open={open} setOpen={setOpen} title='Search Anything'>
				<div className=''>hello</div>
			</Modal>
		</div>
	);
}
