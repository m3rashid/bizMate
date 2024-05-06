export type TypographyProps = {
	className?: string
	value: string
}

function Typography(props: TypographyProps) {
	return <p className={props.className}>{props.value}</p>
}

export default Typography
