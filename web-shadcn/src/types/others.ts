import { ReactNode } from 'react'

export type Option = { value: string | number; label: ReactNode }

export type StringBoolean = 'on' | 'off'
export type ExplicitAndAll<Universe, Partical> = Partical & Exclude<Universe, Partical>
export type ExplicitAndAllObject<Partical> = Record<ExplicitAndAll<string, Partical>, any>

export type DbRow = ExplicitAndAllObject<'id'>

export type UnionOfObject<T> = T[keyof T]
export type PageSearchParams = { page: number }
