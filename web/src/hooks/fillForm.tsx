import { usePopups } from './popups'
import apiClient from '@api/client'
import { ApiResponse, Form, FormBodyDocument } from '@mytypes'
import { useMutation, useQuery } from '@tanstack/react-query'
import { atom, useRecoilState } from 'recoil'

export type FillFormData = {
	currentFormPageNumber: number
	data: Array<Record<string, any>>
}

export const defaultFillFormData: FillFormData = {
	currentFormPageNumber: 0,
	data: [],
}

const fillFormDataAtom = atom<FillFormData>({
	key: 'fillFormDataAtom',
	default: defaultFillFormData,
})

type UseFillFormProps = {
	formId: string
	workspaceId: string
}

function useFillForm(props: UseFillFormProps) {
	const { addMessagePopup } = usePopups()
	const [{ currentFormPageNumber }, setFillForm] = useRecoilState(fillFormDataAtom)

	const { data: res, isPending } = useQuery<ApiResponse<{ form: Form; formBody: FormBodyDocument }>>({
		queryKey: ['getForm', props.formId, props.workspaceId],
		queryFn: () => apiClient(`/${props.workspaceId}/forms/one/${props.formId}`),
		select: (res) => {
			const formLabelsArr: Array<Record<string, any>> = []
			for (let i = 0; i < res.data.formBody.form_inner_body.length; i++) {
				const formParams = res.data.formBody.form_inner_body[i].meta.reduce((acc, el) => (el.props.name ? { ...acc, [el.props.name]: '' } : acc), {})
				formLabelsArr.push(formParams)
			}
			setFillForm((prev) => ({ ...prev, data: formLabelsArr }))
			return res
		},
	})

	const { mutate } = useMutation({
		mutationKey: ['sumitFormResponse'],
		onError: (error) => console.error(error),
		onSuccess: () => {},
		mutationFn: (data: { response: Record<string, any>; pageNumber: number; formBodyId: string }) => {
			return apiClient(`/${props.workspaceId}/forms/response/${props.formId}/submit`, { method: 'POST', body: JSON.stringify(data) })
		},
	})

	function submitResponse() {}

	function goNext() {
		setFillForm((prev) => {
			if (false) return prev
			return { ...prev, currentFormPageNumber: prev.currentFormPageNumber + 1 }
		})
	}

	function goPrevious() {
		setFillForm((prev) => {
			if (prev.currentFormPageNumber <= 0) return prev
			return { ...prev, currentFormPageNumber: prev.currentFormPageNumber - 1 }
		})
	}

	return {
		next: goNext,
		submitResponse,
		previous: goPrevious,
		form: res?.data.form,
		currentFormPageNumber,
		isFetchingForm: isPending,
		formInnerBody: res?.data.formBody.form_inner_body,
	}
}

export default useFillForm
