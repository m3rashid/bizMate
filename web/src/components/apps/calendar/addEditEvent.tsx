import { Button } from '@/components/lib/button';
import { DatePicker } from '@/components/lib/datePicker';
import { Input } from '@/components/lib/input';
import { Modal } from '@/components/lib/modal';
import { TextAreaInput } from '@/components/lib/textAreaInput';
import { TogglerInput } from '@/components/lib/toggle';
import { useCalendar } from '@/hooks/calendar';
import { FormEvent } from 'react';

export type CreateEditEventProps = {};

export function AddEditEvent(props: CreateEditEventProps) {
	const { calendar, closeAddEditModal, getActiveDate } = useCalendar();

	function handleCreateEditEvent(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const formData = Object.fromEntries(new FormData(e.target as HTMLFormElement).entries()) as any;
		console.log(formData);

		if (calendar.editEvent) {
			// edit event
		} else {
		}
	}

	return (
		<Modal
			setOpen={closeAddEditModal}
			open={calendar.addEditModalOpen}
			title={calendar.editEvent ? `Update event: ${calendar.editEvent.name}` : 'Create a new event'}
		>
			<form className='flex flex-col gap-4' onSubmit={handleCreateEditEvent}>
				<div className='flex flex-col gap-4 p-4'>
					<Input name='name' required type='text' label='Event Name' placeholder='Market fit discussion' />
					<TextAreaInput name='description' placeholder='Analysis for product-market fit' />
					<TogglerInput name='is_private' label='Is this event private on your calendar?' />

					<div className='flex flex-col gap-4 sm:flex-row'>
						<DatePicker defaultValue={getActiveDate()} hour24Clock showTime required name='start_time' label='Start time' className='flex-grow' />
						<DatePicker defaultValue={getActiveDate()} showTime required name='end_time' label='End time' className='flex-grow' />
					</div>
				</div>

				<div className='flex items-center justify-between border-t border-borderColor p-2'>
					<Button variant='simple' size='small' type='button'>
						Cancel
					</Button>
					<Button variant='primary' size='small' type='submit'>
						Save
					</Button>
				</div>
			</form>
		</Modal>
	);
}
