'use client';

import { RenderApp } from '@/components/home/apps';
import { apps, sideApp } from '@/components/home/appsList';
import { Drawer } from '@/components/lib/drawer';
import Squares2X2Icon from '@heroicons/react/24/outline/Squares2X2Icon';
import { useState } from 'react';

export function AppDrawer() {
	const [open, setOpen] = useState(false);
	return (
		<>
			<Squares2X2Icon onClick={() => setOpen(true)} className='h-10 w-10 cursor-pointer rounded-md p-2 hover:bg-gray-200' />
			<Drawer className='max-w-80' from='left' title='Apps and Services' open={open} setOpen={setOpen}>
				<div className='flex flex-col gap-6 p-3'>
					{apps.map((app) => (
						<RenderApp key={app.name} {...app} />
					))}
					<RenderApp {...sideApp} />
				</div>
			</Drawer>
		</>
	);
}
