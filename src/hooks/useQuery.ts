import useSWR, { SWRResponse } from 'swr'
import { AxiosFetcher } from '@/apis/configs'
import { ApiRequestConfig, SWRConfig } from '@/types/configs'

/**
 * Fetch data from the API using SWR.
 *
 * @typeParam TData - The expected shape of the data returned by the AxiosFetcher.
 * @typeParam TError - The expected error shape if the request fails.
 *
 * @param urlOrConfig - Either a string representing the endpoint URL or a config object.
 * @param config - An optional SWR configuration object (or extended custom config).
 *
 * @returns SWRResponse<TData, TError> - The standard response object from SWR, typed with the given generics.
 */
export function useQuery<TData = any, TError = any>(
	urlOrConfig: string | ApiRequestConfig,
	config?: SWRConfig
): SWRResponse<TData, TError> {
	return useSWR<TData, TError>(urlOrConfig, AxiosFetcher, config || {})
}
