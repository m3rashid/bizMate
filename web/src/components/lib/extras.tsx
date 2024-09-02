import { cn } from '@/utils/helpers';
import { AnchorHTMLAttributes, FC, HTMLAttributes, ImgHTMLAttributes, createElement } from 'react';

export type ParagraphProps = Omit<HTMLAttributes<HTMLParagraphElement>, 'children'> & {
	text: string;
};
export function Paragraph(props: ParagraphProps) {
	return <p className={props.className}>{props.text}</p>;
}

export type ImageProps = ImgHTMLAttributes<HTMLImageElement>;
export function Image(props: ImageProps) {
	// eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
	return <img {...props} className={cn('inline-block', props.className)} />;
}

export type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { text?: string };
export function Link(props: LinkProps) {
	return (
		<a
			{...props}
			className={cn(
				'visited:cursor-auto visited:text-linkVisited visited:underline hover:cursor-pointer hover:text-linkActive active:cursor-pointer active:text-linkActive active:underline visited:active:text-linkActive',
				props.className
			)}
		>
			{props.text || props.children}
		</a>
	);
}

export const headingTypes = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const;
type HeadingType = (typeof headingTypes)[number];

export const headingVariants: Record<HeadingType, string> = {
	h1: 'my-2 text-4xl',
	h2: 'my-2 text-3xl',
	h3: 'my-2 text-2xl',
	h4: 'my-1 text-xl',
	h5: 'my-1 text-lg',
	h6: 'my-1 text-md ',
} as const;
export type HeadingProps = Omit<HTMLAttributes<HTMLHeadingElement>, 'children'> & { text: string; type?: HeadingType };
export const Heading: FC<HeadingProps> = ({ text, type, className, ...props }) => {
	const _type = type && headingTypes.includes(type) ? type : headingTypes[0];

	return createElement(_type, {
		...props,
		className: cn('mx-0 block font-bold', headingVariants[_type], className),
		...{ ...props, children: text },
	});
};

export type CodeProps = { code: string; className?: string };
export function Code(props: CodeProps) {
	return (
		<pre className={cn('mx-0 my-2 block overflow-auto whitespace-pre rounded-md bg-gray-800 p-2 font-mono text-gray-50', props.className)}>
			{props.code}
		</pre>
	);
}
