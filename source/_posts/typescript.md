---
title: Typescript类型体操
tags: Typescript
categories: 前端
---
# 实现TypeScript内置工具类

## 实现Partial<T>

```ts
// 将所有属性变为可选 浅层
type MyPartial<T> = {
	[P in keyof T]?: T[P]
}

// 将所有属性变为可选 深层
type  DeepPartial<T> = {
	 [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> :  T[P]
}

type message = {
	name: string;
	age: number;
	address: {
		province: string;
		city: string;
	};
}
type m1 = MyPartial<message>
type m2 = DeepPartial<message>
```

## 实现Required<T>

```ts
// 将所有属性变为必选 浅层
type MyRequired<T> = {
	[P in keyof T]-?: T[P]
}
// 将所有属性变为必选 深层
type  DeepRequired<T> = {
	 [P in keyof T]-?: T[P] extends object ? DeepRequired<T[P]> :  T[P]
}


type message = {
	name?: string;
	age: number;
	address: {
		province?: string;
		city: string;
	};
}
type m1 = MyRequired<message>
type m2 = DeepRequired<message>
```

## 实现Readonly<T>

```ts
// 将所有属性变为只读 浅层
type MyReadonly<T> = {
	readonly [P in keyof T]: T[P]
}
// 将所有属性变为只读 深层
type  DeepReadonly<T> = {
	readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> :  T[P]
}


type message = {
	name?: string;
	age: number;
	address: {
		province?: string;
		city: string;
	};
}
type m1 = MyReadonly<message>
type m2 = DeepReadonly<message>
```

## 实现Pick<T>

```ts
// 从某个类型中挑出一些属性出来
type myPick<T, K extends keyof T> = {
	[P in K]: T[P]
}

interface Foo {
  title: string;
  description: string;
  completed: boolean;
}

type f = myPick<Foo, "title" | "completed">;
```

## 实现Record<T>

```ts
//将 T 中所有的属性的值转化为 K 类型
type MyRecord<T extends keyof any, K> = {
	[P in T] :  K
}

interface PageInfo {
  title: string;
	name: string
}

type Page = "home" | "about" | "contact";


const x: MyRecord<Page, PageInfo> = {
  about: { title: "about", name:"aaa" },
  contact: { title: "contact",name:"bbb" },
  home: { title: "home",name:"ccc" },
};
```

## 实现ReturnType<T>

```ts
// 获取返回值参数类型
type MyReturnType<T extends (...args: any[]) => any> = T extends (...args: any[]) => infer R ? R : any

// 获取传入值参数类型
type MyPassType<T extends (...args: any[]) => any> = T extends (...args: infer R) => any ? R : any

// 获取传入值参数第一项类型
type MyPassTypeOne<T extends (...args: any[]) => any> = T extends (...args: infer R) => any ? R[0] : any

type Func = (value1: number, value2: number) => string;

type f1 = MyReturnType<Func> // string
type f2 = MyPassType<Func> // [number, number]
type f3 = MyPassTypeOne<Func> // number
```

## 实现Exclude<T, U>

```ts
// 将某个类型中属于另一个的类型移除掉。
type MyExclude<T, U> = T extends U ? never : T

// 当条件类型作用于泛型类型时，联合类型会被拆分使用。
// <'a' | 'b' | 'c', 'a'> 会被拆分为 'a' extends 'a'、'b' extends 'a'、'c' extends 'a'
type bar = MyExclude<"a" | "b" | "c", "a"> // "b" | "c"
```

## 实现Extract<T, U>

```ts
// Extract<T, U> 的作用是从 T 中提取出 U。
type MyExtract<T, U> = T extends U ? T : never

type T3 = MyExtract<"a" | "b" | "c", "a" | "f">; // "a"
type T4 = MyExtract<string | number | (() => void), Function> // () =>void
```

## 实现Omit<T, U >

```ts
// T 类型中除了 U 类型的所有属性，来构造一个新的类型。
type MyOmit<T, U extends keyof T> = {
	[P in keyof T as P extends U ? never : P]: T[P]
}

interface Todo {
	title: string;
	description: string;
	completed: boolean;
}

type TodoPreview = MyOmit<Todo, "description">;

const todo: TodoPreview = {
	title: "Clean room",
	completed: false,
};
```

## 实现NonNullable<T>

```ts
// 过滤类型中的 null 及 undefined 类型。
type MyNonNullable<T> = T extends undefined | null ? never : T

type T3 = MyNonNullable<string | number | undefined>; // string | number
type T1 = MyNonNullable<string[] | null | undefined>; // string[]
```

## 实现Parameters<T>

```ts
// 获得函数的参数类型组成的元组类型。
type MyParameters<T extends (...args: any) => any> = T extends (...args: infer P) => any ? P : never

type A = MyParameters<(a: number, b: string) => void>; // [number, string]

type B = MyParameters<typeof Math.max>; // number[]
```

