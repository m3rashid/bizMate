import { SVGAttributes, FunctionComponent } from 'react'

declare module '*.json' {
	const content
	export default content
}

declare module '*.png' {
	const content
	export default content
}

declare module '*.jpg' {
	const content
	export default content
}

declare module '*.svg' {
	const content: FunctionComponent<SVGAttributes<SVGElement>>
	export default content
}

declare module '*.svg?component' {
	const content: FunctionComponent<SVGAttributes<SVGElement>>
	export default content
}
