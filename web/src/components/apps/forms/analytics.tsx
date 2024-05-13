export type FormAnalyticsProps = {
	formId: number
}

function FormAnalytics(_: FormAnalyticsProps) {
	return (
		<div className="flex h-72 w-full flex-col items-center justify-center gap-4 rounded-md border-2 border-gray-200">
			<div className="text-center">
				<h3 className="text-lg font-semibold text-gray-800">Form Analytics</h3>
				<p className="text-sm text-gray-500">Form Analytics are coming soon, please be patient</p>
			</div>
		</div>
	)
}

export default FormAnalytics
