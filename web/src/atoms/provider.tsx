'use client';

import { RecoilRoot } from 'recoil';
import { PropsWithChildren } from 'react';

export function RecoilProvider(props: Readonly<PropsWithChildren>) {
	return <RecoilRoot>{props.children}</RecoilRoot>;
}
