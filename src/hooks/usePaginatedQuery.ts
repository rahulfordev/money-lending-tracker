import { SWRConfig } from '@/types/configs'
import { useQuery } from '@/hooks/useQuery'
import { useCallback, useMemo, useState } from 'react'

interface PaginatedResponse<T> {
	data: T[]
	current_page: number
	last_page: number
	// ... plus anything else your server returns
}

// Options type
interface PaginatedOptions {
	initialPage?: number
	initialPerPage?: number
	initialClassId?: number | null
	initialQ?: string
	initialCategory?: string
	swrConfig?: SWRConfig
}

export function usePaginatedQuery<T>(
	url: string,
	{
		initialPage = 1,
		initialPerPage = 20,
		initialClassId = null,
		initialQ = '',
		initialCategory = '',
		swrConfig
	}: PaginatedOptions = {}
) {
	// Track pagination + filters in state
	const [page, setPage] = useState(initialPage)
	const [perPage, setPerPage] = useState(initialPerPage)
	const [classId, setClassId] = useState<number | null>(initialClassId)
	const [search, setSearch] = useState<string>(initialQ)
	const [category, setCategory] = useState<string>(initialCategory)

	// Build the final URL with query params
	const paginatedUrl = useMemo(() => {
		let urlWithParams = `${url}?page=${page}&per_page=${perPage}`

		if (classId) {
			urlWithParams += `&filter_by_class_id=${classId}`
		}
		if (search) {
			urlWithParams += `&search=${encodeURIComponent(search)}`
		}
		if (category) {
			urlWithParams += `&category=${category}`
		}

		return urlWithParams
	}, [url, page, perPage, classId, search, category])

	// Fetch with existing useQuery
	const { data, error, isLoading, mutate } = useQuery<PaginatedResponse<T>>(
		paginatedUrl,
		swrConfig
	)

	// Extract paginated fields
	const paginatedData = data?.data || []
	const currentPage = data?.current_page || 1
	const lastPage = data?.last_page || 1

	// Navigation helpers
	const nextPage = useCallback(() => {
		if (currentPage < lastPage) setPage(p => p + 1)
	}, [currentPage, lastPage])

	const prevPage = useCallback(() => {
		if (currentPage > 1) setPage(p => p - 1)
	}, [currentPage])

	const goToPage = useCallback(
		(pageNum: number) => {
			if (pageNum >= 1 && pageNum <= lastPage) {
				setPage(pageNum)
			}
		},
		[lastPage]
	)

	const setPageSize = useCallback((newPerPage: number) => {
		setPerPage(newPerPage)
		setPage(1)
	}, [])

	return {
		data: paginatedData,
		isLoading,
		error,
		currentPage,
		lastPage,
		setPage,
		setPageSize,
		nextPage,
		prevPage,
		goToPage,
		mutate,
		// expose filters
		setClassId,
		setSearch,
		classId,
		search,
		setCategory
	}
}
