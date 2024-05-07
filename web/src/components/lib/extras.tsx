import { PropsWithChildren } from 'react'

export type TypographyProps = { className?: string; value: string }
export function Typography(props: TypographyProps) {
	return <p className={props.className}>{props.value}</p>
}

export type ColumnProps = PropsWithChildren & { className?: string }
export function Column(props: ColumnProps) {
	return <div className={props.className}>{props.children}</div>
}
