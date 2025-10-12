import { FormEvent, useState } from 'react'
import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import { AxiosFetcher } from '@/apis/configs'

/**
 * A generic hook to handle form submission.
 *
 * @typeParam TData - The shape of your form data (e.g., { name: string; avatar: File }).
 * @typeParam TResponse - The shape of the server response (e.g., { success: boolean; message: string }).
 *
 * @param submitUrl - The endpoint URL.
 * @param initialValues - Default form values.
 * @param config - Additional axios configuration options (method, headers, etc.).
 */

export type InitialOptions = {
	value: string
	validation: string
}

type InitialValueType<T> = {
	[key in keyof T]:
		| InitialOptions
		| string
		| number
		| boolean
		| File
		| null
		| readonly string[]
		| undefined
}

export function useForm<
	TData extends Record<string, any> = Record<string, any>,
	TResponse = any
>(
	submitUrl: string,
	initialValues: InitialValueType<TData> = {} as InitialValueType<TData>,
	config?: AxiosRequestConfig & { headers?: Record<string, string> }
) {
	const { method, headers = {} }: AxiosRequestConfig = config || {}

	// State for form initialValues
	const [data, setDataState] = useState<TData>(
		Object.entries(initialValues).reduce((acc, [key, value]) => {
			if (
				typeof value === 'object' &&
				value !== null &&
				'value' in value
			) {
				acc[key as keyof TData] = (value as InitialOptions).value as any
			} else {
				acc[key as keyof TData] = value as any
			}
			return acc
		}, {} as TData)
	)

	// State for errors; you can adjust the error type to suit your APIs structure
	const [errors, setErrors] = useState<Partial<Record<keyof TData, string>>>(
		{}
	)

	// Loading and server response states
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const [responseData, setResponseData] = useState<AxiosResponse | null>(null)

	function isValidate(rules: { [key: string]: string }) {
		Object.keys(rules).forEach(fieldName => {
			const validationStr = rules[fieldName].split('|')

			validationStr.forEach(rule => {
				const [ruleName, ruleValue] = rule.split(':')

				let e = null
				if (ruleName === 'required' && !data[fieldName]) {
					e = `This field is required`
				} else if (
					ruleName === 'min' &&
					data[fieldName].length < parseInt(ruleValue)
				) {
					e = `This field must be at least ${ruleValue} characters`
				} else if (
					ruleName === 'max' &&
					data[fieldName].length > parseInt(ruleValue)
				) {
					e = `This field must be at most ${ruleValue} characters`
				} else if (
					ruleName === 'email' &&
					!/^\S+@\S+\.\S+$/.test(data[fieldName])
				) {
					e = `This field must be a valid email address`
				} else if (
					ruleName === 'confirmed' &&
					data[fieldName] !== data[ruleValue]
				) {
					e = `This field must match ${ruleValue}`
				} else if (
					ruleName === 'regex' &&
					!new RegExp(ruleValue).test(data[fieldName])
				) {
					e = `This field must match ${ruleValue}`
				}

				setErrors(prev => ({
					...prev,
					[fieldName]: e
				}))
			})
		})
	}

	/**
	 * Updates a single field in the form data.
	 * Clears the error for that field if it exists.
	 * @param fieldName - The name of the form field (key of TData).
	 * @param fieldValue - The new value for that field.
	 */
	function setData<Key extends keyof TData>(
		fieldName: Key,
		fieldValue: TData[Key]
	) {
		setDataState(prev => ({
			...prev,
			[fieldName]: fieldValue
		}))

		// Optionally clear the existing error for that field
		setErrors(prev => ({
			...prev,
			[fieldName]: undefined
		}))
	}

	/**
	 * Submits the form data via AxiosFetcher.
	 * @param event - The form event (if called via onSubmit).
	 * @returns The Axios response or partial data on error.
	 */

	async function submit(
		event?:
			| React.FormEvent<HTMLFormElement>
			| {
					onSubmit?: () => void
					onCancel?: () => void
					onSuccess?: (r: AxiosResponse) => void
					onError?: (e: AxiosError) => void
			  }
	): Promise<null | TResponse> {
		// Prevent default form submission behavior
		if (event && typeof event === 'object' && 'preventDefault' in event) {
			event.preventDefault()
		}

		setIsLoading(true)
		setErrors({})
		setResponseData(null)

		// extract validation rules
		const validationRules = Object.entries(initialValues).reduce(
			(acc, [key, value]) => {
				if (
					typeof value === 'object' &&
					value !== null &&
					'validation' in value
				) {
					acc[key as keyof TData] = (
						value as InitialOptions
					).validation
				} else {
					acc[key as keyof TData] = ''
				}
				return acc
			},
			{} as Record<keyof TData, string>
		)

		isValidate(validationRules)

		if (Object.values(errors).some(e => e)) {
			setIsLoading(false)
			return null
		}

		const isMultipart = headers['Content-Type'] === 'multipart/form-data'
		let requestData: TData | FormData = data

		if (isMultipart) {
			const formData = new FormData()
			Object.keys(data).forEach(key => {
				// @ts-ignore
				formData.append(key, data[key])
			})
			requestData = formData
		}

		try {
			const response = await AxiosFetcher({
				...config,
				url: submitUrl,
				method: (method || 'POST') as 'GET' | 'POST' | 'PUT' | 'DELETE',
				data: requestData,
				headers: {
					'Content-Type':
						headers['Content-Type'] || 'application/json'
				}
			})

			setResponseData(response)
			return response as TResponse
		} catch (error: any) {
			let returnedData: TResponse | null = null

			if (error.response) {
				const { data: errorResponse } =
					error.response as AxiosResponse<TResponse>
				setResponseData(error.response)
				returnedData = errorResponse

				// If Laravel-style validation errors
				if ((errorResponse as any).errors) {
					setErrors((errorResponse as any).errors)
				}
				// If "old" data is returned, repopulate the form
				if ((errorResponse as any).old) {
					setDataState((errorResponse as any).old)
				}
			} else {
				console.error('Error submitting form:', error.message)
			}

			return returnedData
		} finally {
			setIsLoading(false)
		}
	}

	// If needed: import type { ChangeEvent } from 'react';

	const register = <K extends keyof TData>(fieldName: K) => ({
		name: String(fieldName),
		value: data[fieldName],
		onChange: (
			e: React.ChangeEvent<
				| HTMLInputElement
				| HTMLTextAreaElement
				| string
				| number
				| boolean
				| null
			>
		) => {
			const el = e.currentTarget

			// <input> cases
			if (el instanceof HTMLInputElement) {
				if (el.type === 'file') {
					// single file; use Array.from(el.files) if you need multiple
					setData(fieldName, (el.files?.[0] ?? null) as TData[K])
					return
				}
				if (el.type === 'checkbox') {
					setData(fieldName, el.checked as unknown as TData[K])
					return
				}
				// any other input type: text, email, number (value is a string)
				setData(fieldName, el.value as unknown as TData[K])
				return
			} else if (el instanceof HTMLTextAreaElement) {
				// <textarea>
				setData(fieldName, el.value as unknown as TData[K])
			} else {
				setData(fieldName, el as unknown as TData[K])
			}
		}
	})

	return {
		data,
		setData,
		submit,
		isLoading,
		errors,
		setErrors,
		response: responseData,
		register
	}
}
