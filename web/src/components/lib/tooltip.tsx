import { createPortal } from 'react-dom'
import { CSSProperties, PropsWithChildren, ReactNode, useRef, useState } from 'react'

export type TooltipProps = PropsWithChildren & {
	label: ReactNode
	show?: 'left' | 'right'
}

function Tooltip(props: TooltipProps) {
	const domRef = useRef<HTMLDivElement>(null)
	const [show, setShow] = useState(false)

	function getTooltipStyles(): CSSProperties {
		const defaultStyles = { maxWidth: Math.min(window.innerWidth - 10, 250) }
		if (!domRef.current) return defaultStyles
		const bounds = domRef.current.getBoundingClientRect()
		return {
			...defaultStyles,
			top: bounds.top + bounds.height + 5,
			...(props.show === 'right' ? { left: bounds.left } : { left: bounds.right - defaultStyles.maxWidth }),
		}
	}

	return (
		<div onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
			<div ref={domRef} className="cursor-pointer">
				{props.children}
			</div>
			{createPortal(
				show ? (
					<div style={getTooltipStyles()} className="absolute z-50 rounded-lg border-[1px] border-gray-200 bg-white px-2 py-1 text-sm shadow-md">
						{props.label}
					</div>
				) : null,
				document.body,
			)}
		</div>
	)
}

export default Tooltip
