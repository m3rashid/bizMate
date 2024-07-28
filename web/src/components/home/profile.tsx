import { User } from '@/utils/types';
import Image from 'next/image';

export function Profile(props: { user: User | null }) {
	return <>{props.user?.avatar ? <Image height={28} width={28} alt='Avatar' className='h-7 w-7 rounded-full' src={props.user.avatar} /> : null}</>;
}
