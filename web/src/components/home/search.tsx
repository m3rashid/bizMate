'use client';

import { Modal } from '@/components/lib/modal';
import { cn } from '@/utils/helpers';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export function Search() {
	const { t } = useTranslation();
	const [open, setOpen] = useState(false);

	return (
		<div>
			<div
				onClick={() => setOpen(true)}
				className={cn(
					'w-full cursor-pointer select-none overflow-hidden rounded-full border-[1px] px-3 py-[6px] text-sm text-disabledLight hover:border-primary hover:text-primary sm:w-80 md:rounded-md'
				)}
			>
				{t('Search ...')}
			</div>

			<Modal open={open} setOpen={setOpen} title='Search Anything'>
				<div className=''>hello</div>
			</Modal>
		</div>
	);
}
