'use client';

import { CSSProperties, PropsWithChildren, ReactNode, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

export type TooltipProps = PropsWithChildren & {
	label: ReactNode;
	position?: 'left' | 'right';
};

export function Tooltip(props: TooltipProps) {
	const domRef = useRef<HTMLDivElement>(null);
	const [show, setShow] = useState(false);

	function getTooltipStyles(): CSSProperties {
		const defaultStyles = { maxWidth: Math.min(window.innerWidth - 10, 250) };
		if (!domRef.current) return defaultStyles;
		const bounds = domRef.current.getBoundingClientRect();
		return {
			...defaultStyles,
			top: bounds.bottom + 5,
			...(props.position === 'right' ? { left: bounds.left } : { left: bounds.right, transform: 'translateX(-100%)' }),
		};
	}

	return (
		<div onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)} onClick={() => setShow(false)}>
			<div ref={domRef} className='cursor-pointer'>
				{props.children}
			</div>

			{createPortal(
				show ? (
					<div style={getTooltipStyles()} className='absolute z-30 rounded-md border border-gray-200 bg-white px-2 py-1 text-sm shadow-md'>
						{props.label}
					</div>
				) : null,
				document.body
			)}
		</div>
	);
}
