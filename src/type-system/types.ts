import type {
	Kind,
	ObjectOptions,
	SchemaOptions,
	StaticDecode,
	TObject,
	TProperties,
	TransformKind,
	TSchema,
	TUnsafe
} from '@sinclair/typebox'
import { ValueError } from '@sinclair/typebox/errors'
import type { TypeCheck } from '@sinclair/typebox/compiler'

import { ElysiaFormData } from '../utils'
import type { CookieOptions } from '../cookies'
import type { MaybeArray } from '../types'

export type FileUnit = number | `${number}${'k' | 'm'}`

export type StrictFileType =
	| 'image'
	| 'image/*'
	| 'image/jpeg'
	| 'image/png'
	| 'image/gif'
	| 'image/tiff'
	| 'image/x-icon'
	| 'image/svg'
	| 'image/webp'
	| 'image/avif'
	| 'audio'
	| 'audio/*'
	| 'audio/aac'
	| 'audio/mpeg'
	| 'audio/x-ms-wma'
	| 'audio/vnd.rn-realaudio'
	| 'audio/x-wav'
	| 'video'
	| 'video/*'
	| 'video/mpeg'
	| 'video/mp4'
	| 'video/quicktime'
	| 'video/x-ms-wmv'
	| 'video/x-msvideo'
	| 'video/x-flv'
	| 'video/webm'
	| 'text'
	| 'text/*'
	| 'text/css'
	| 'text/csv'
	| 'text/html'
	| 'text/javascript'
	| 'text/plain'
	| 'text/xml'
	| 'application'
	| 'application/*'
	| 'application/graphql'
	| 'application/graphql-response+json'
	| 'application/ogg'
	| 'application/pdf'
	| 'application/xhtml'
	| 'application/xhtml+html'
	| 'application/xml-dtd'
	| 'application/html'
	| 'application/json'
	| 'application/ld+json'
	| 'application/xml'
	| 'application/zip'
	| 'font'
	| 'font/*'
	| 'font/woff2'
	| 'font/woff'
	| 'font/ttf'
	| 'font/otf'

export type FileType = (string & {}) | StrictFileType

export interface FileOptions extends SchemaOptions {
	type?: MaybeArray<FileType>
	minSize?: FileUnit
	maxSize?: FileUnit
}

export interface FilesOptions extends FileOptions {
	minItems?: number
	maxItems?: number
}

export interface CookieValidatorOptions<T extends Object = {}>
	extends ObjectOptions,
		CookieOptions {
	/**
	 * Secret key for signing cookie
	 *
	 * If array is passed, will use Key Rotation.
	 *
	 * Key rotation is when an encryption key is retired
	 * and replaced by generating a new cryptographic key.
	 */
	secrets?: string | string[]
	/**
	 * Specified cookie name to be signed globally
	 */
	sign?: Readonly<(keyof T | (string & {}))[]>
}

export type TFile = (
	options?: Partial<FileOptions> | undefined
) => TUnsafe<File>

export type TFiles = (
	options?: Partial<FilesOptions> | undefined
) => TUnsafe<File[]>

export type NonEmptyArray<T> = [T, ...T[]]

export type TEnumValue = number | string | null

export interface TUnionEnum<
	T extends
		| NonEmptyArray<TEnumValue>
		| Readonly<NonEmptyArray<TEnumValue>> = [TEnumValue]
> extends TSchema {
	type?: 'number' | 'string' | 'null'
	[Kind]: 'UnionEnum'
	static: T[number]
	enum: T
}

export type TForm<T extends TProperties = TProperties> = TUnsafe<
	ElysiaFormData<TObject<T>['static']>
>

declare module '@sinclair/typebox' {
	interface SchemaOptions {
		error?:
			| string
			| boolean
			| number
			| Object
			| ((validation: {
					errors: ValueError[]
					type: string
					validator: TypeCheck<any>
					value: unknown
			  }) => string | boolean | number | Object | void)
	}
}

export declare class ElysiaTransformDecodeBuilder<T extends TSchema> {
	private readonly schema
	constructor(schema: T)
	Decode<U extends unknown, D extends TransformFunction<StaticDecode<T>, U>>(
		decode: D
	): ElysiaTransformEncodeBuilder<T, D>
}
export declare class ElysiaTransformEncodeBuilder<
	T extends TSchema,
	D extends TransformFunction
> {
	private readonly schema
	private readonly decode
	constructor(schema: T, decode: D)
	private EncodeTransform
	private EncodeSchema
	Encode<E extends TransformFunction<ReturnType<D>, StaticDecode<T>>>(
		encode: E
	): TTransform<T, ReturnType<D>>
}
export type TransformFunction<T = any, U = any> = (value: T) => U
export interface TransformOptions<
	I extends TSchema = TSchema,
	O extends unknown = unknown
> {
	Decode: TransformFunction<StaticDecode<I>, O>
	Encode: TransformFunction<O, StaticDecode<I>>
}
export interface TTransform<
	I extends TSchema = TSchema,
	O extends unknown = unknown
> extends TSchema {
	static: O
	[TransformKind]: TransformOptions<I, O>
	[key: string]: any
}
