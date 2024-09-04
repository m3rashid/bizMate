'use client';

import { PropsWithChildren } from 'react';
import { RecoilRoot } from 'recoil';

export function RecoilProvider(props: Readonly<PropsWithChildren>) {
	return <RecoilRoot>{props.children}</RecoilRoot>;
}
