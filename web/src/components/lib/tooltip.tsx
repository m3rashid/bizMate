import { CSSProperties, PropsWithChildren, ReactNode, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

export type TooltipProps = PropsWithChildren & {
	label: ReactNode
}
function Tooltip(props: TooltipProps) {
	const domRef = useRef<HTMLDivElement>(null)
	const [show, setShow] = useState(false)

	function getTooltipStyles(): CSSProperties {
		const defaultStyles: CSSProperties = { maxWidth: Math.min(window.innerWidth - 10, 350) }
		if (!domRef.current) return defaultStyles
		const bounds = domRef.current.getBoundingClientRect()
		return {
			...defaultStyles,
			left: bounds.left,
			top: bounds.top + bounds.height + 10,
		}
	}

	return (
		<div onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
			<div ref={domRef} className="cursor-pointer">
				{props.children}
			</div>
			{createPortal(
				show ? (
					<div
						style={getTooltipStyles()}
						className="absolute z-50 rounded-lg border-[1px] border-gray-200 bg-white px-4 py-2 shadow-md"
					>
						{props.label}
					</div>
				) : null,
				document.body,
			)}
		</div>
	)
}

export default Tooltip
