'use client';

import { PropsWithChildren, useRef } from 'react';
import { RecoilRoot } from 'recoil';

export function RecoilProvider(props: Readonly<PropsWithChildren>) {
	return <RecoilRoot>{props.children}</RecoilRoot>;
}
