import { twMerge } from 'tailwind-merge'
import { AnchorHTMLAttributes, HTMLAttributes, ImgHTMLAttributes } from 'react'

export type ParagraphProps = Omit<HTMLAttributes<HTMLParagraphElement>, 'children'> & {
	text: string
}
export function Paragraph(props: ParagraphProps) {
	return <p className={props.className}>{props.text}</p>
}

export type ColumnProps = HTMLAttributes<HTMLDivElement>
export function Column(props: ColumnProps) {
	return <div className={props.className}>{props.children}</div>
}

export type ImageProps = ImgHTMLAttributes<HTMLImageElement>
export function Image(props: ImageProps) {
	return <img {...props} className={twMerge('inline-block', props.className)} />
}

export type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { text?: string }
export function Link(props: LinkProps) {
	return (
		<a
			{...props}
			className={twMerge(
				'visited:text-linkVisited hover:text-linkActive active:text-linkActive visited:active:text-linkActive visited:cursor-auto visited:underline hover:cursor-pointer active:cursor-pointer active:underline',
				props.className,
			)}
		>
			{props.text || props.children}
		</a>
	)
}

export type HeadingProps = Omit<HTMLAttributes<HTMLHeadingElement>, 'children'> & { text: string }
export function H1(props: HeadingProps) {
	return (
		<h1 {...props} className={twMerge('mx-0 mb-2 mt-2 block text-3xl font-bold', props.className)}>
			{props.text}
		</h1>
	)
}

export function H2(props: HeadingProps) {
	return (
		<h2 {...props} className={twMerge('mx-0 mb-3 mt-3 block text-2xl font-bold', props.className)}>
			{props.text}
		</h2>
	)
}

export function H3(props: HeadingProps) {
	return (
		<h3 {...props} className={twMerge('mx-0 mb-4 mt-4 block text-xl font-bold', props.className)}>
			{props.text}
		</h3>
	)
}

export function H4(props: HeadingProps) {
	return (
		<h4 {...props} className={twMerge('mx-0 mb-5 mt-5 block text-lg font-bold', props.className)}>
			{props.text}
		</h4>
	)
}

export function H5(props: HeadingProps) {
	return (
		<h5 {...props} className={twMerge('text-md mx-0 mb-6 mt-6 block font-bold', props.className)}>
			{props.text}
		</h5>
	)
}

export function H6(props: HeadingProps) {
	return (
		<h6 {...props} className={twMerge('mx-0 mb-8 mt-8 block text-sm font-bold', props.className)}>
			{props.text}
		</h6>
	)
}

export type CodeProps = {
	code: string
	className?: string
}
export function Code(props: CodeProps) {
	return (
		<pre
			className={twMerge(
				'mx-0 my-2 block whitespace-pre rounded-md bg-gray-800 p-2 font-mono text-gray-50',
				props.className,
			)}
		>
			{props.code}
		</pre>
	)
}
