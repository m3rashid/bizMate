import remarkGfm from 'remark-gfm'
import createMDX from '@next/mdx'
import rehypePrettyCode from 'rehype-pretty-code'

/** @type {import('next').NextConfig} */
const nextConfig = {};

const withMdx = createMDX({
	options: {
		remarkPlugins: [remarkGfm],
		rehypePlugins: [rehypePrettyCode],
	}
})

export default withMdx(nextConfig);
