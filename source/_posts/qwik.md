---
title: Qwik
---
## Qwik官方文档

https://qwik.builder.io

安装

```shell
npm create qwik@latest
pnpm create qwik@latest
yarn create qwik@latest
```

## useSignal()

`useSignal()` 返回的数据由一个具有单个属性 `.value` 的对象组成。如果您更改数据的 `value` 属性，任何依赖它的组件都会自动更新。 类似Vue3的ref。

### 实现计数器

```tsx
import { component$, useSignal } from '@builder.io/qwik';
export default component$(() => {
	const count = useSignal<number>(0)

	return (
		<div>
			<h2>{count}</h2>
			<button onClick$={() => count.value++}>+1</button>
		</div>
	);
});
```

### 获取Dom元素

```tsx
import { $, component$, useSignal } from '@builder.io/qwik';

export default component$(() => {
	const divRef = useSignal<HTMLDivElement>()
	const handleClick = $(() => {
		console.log(divRef.value?.innerText);
	})
	return (
		<div>
			<div ref={divRef} onClick$={handleClick}>123</div>
			<Child name="aaa" age={18} />
		</div>
	);
});
```

## useStore()

使用 useStore() 创建一个反应对象。它接受一个初始对象（或工厂函数）并返回一个反应对象。类似Vue3的reactive。

```tsx
import { component$, useStore } from '@builder.io/qwik';
export default component$(() => {
	const state = useStore({ count: 0 })

	return (
		<div>
			<h2>{state.count}</h2>
			<button onClick$={() => state.count++}>+1</button>
		</div>
	);
});
```

`useStore()` 要跟踪所有嵌套属性，需要分配大量 Proxy 对象。如果您有很多嵌套属性，这可能是一个性能问题。在这种情况下，您可以使用 `deep: false` 选项仅跟踪顶级属性

```tsx
import { component$, useStore } from '@builder.io/qwik';
export default component$(() => {
	const state = useStore({
		count: 0,
		foo: {
			bar: {
				num: 66
			}
		}
	}, {deep: false})

	return (
		<div>
			<h2>{state.count}</h2>
			<button onClick$={() => state.count++}>+1</button>
		</div>
	);
});
```

## useComputed()

计算属性值，类似与vue中的computed，具有缓存属性，它只会在其中一个输入信号发生变化时重新计算值。

useComputed()的返回值是signal类型，需要使用.value属性获取，但在HTML中可以不使用.value来获取，类似vue3。

```tsx
import { component$, useComputed$, useSignal } from '@builder.io/qwik';
export default component$(() => {
	const firstName = useSignal('Jock')
	const lastName = useSignal('Doe')
	
	const fullName = useComputed$(() => {
		return firstName.value + "" + lastName.value
	})

	return (
		<div>
			<h2>{fullName}</h2>
		</div>
	);
});
```

## useContext()

Qwik 提供了 context API，解决了 props 钻取的问题，和 React 的函数式 `useContext()` 非常相似

Qwik 的上下文 API 由 3 个方法组成，可从 `@builder.io/qwik` 导入：

- createContextId(contextName: string): ContextId
- useContextProvider(ctx: ContextId, value: VALUE): void
- useContext(ctx: ContextId): VALUE

```tsx
import {  useContext} from '@builder.io/qwik';
import { useContextProvider} from '@builder.io/qwik';
import { component$, createContextId, useStore } from '@builder.io/qwik';

interface Theme {
	color: string
}

// 生成唯一的ContextId
const ThemeContext = createContextId<Theme>("qwik-theme")

export default component$(() => {
	const theme = useStore({ color:"red" })
	useContextProvider(ThemeContext, theme) // 给对应的ContextId提供数据
	return (
		<div>
			<Child/>
		</div>
	);
});

const Child = component$(() => {
  const theme = useContext(ThemeContext); // 传入ContextId获取数据
  return <div>Theme is {theme.color}</div>;
});
```



## 向子组件传递数据

### 使用 props 传递

```tsx
import { component$ } from '@builder.io/qwik';

interface ChildProps {
	name: string
	age: number
}

const Child = component$<ChildProps>(({ name, age }) => {
	return (
		<div>
			{name} - {age}
		</div>
	)
})

export default component$(() => {
	return (
		<div>
			<Child name='aaa' age={18}/>
		</div>
	);
});
```

### 使用context传递数据

```tsx
import {  useContext} from '@builder.io/qwik';
import { useContextProvider} from '@builder.io/qwik';
import { component$, createContextId, useStore } from '@builder.io/qwik';

interface Theme {
	color: string
}

// 生成唯一的ContextId
const ThemeContext = createContextId<Theme>("qwik-theme")

export default component$(() => {
	const theme = useStore({ color:"red" })
	useContextProvider(ThemeContext, theme) // 给对应的ContextId提供数据
	return (
		<div>
			<Child/>
		</div>
	);
});

const Child = component$(() => {
  const theme = useContext(ThemeContext); // 传入ContextId获取数据
  return <div>Theme is {theme.color}</div>;
});
```

## 事件处理

### 基本点击事件

请注意， `onClick$` 以 `$` 结尾。这是对优化器和开发人员的提示，表明在此位置发生了特殊转换。 `$` 后缀的存在意味着这里有一个延迟加载的边界。在用户触发 `click` 事件之前，与 `click` 处理程序关联的代码将不会加载到JavaScript VM 中，但是，它将被急切地加载到浏览器缓存中，以免导致首次交互延迟。

```tsx
import { component$, useSignal } from '@builder.io/qwik';
 
export default component$(() => {
  const count = useSignal(0);
 
  return (
    <button onClick$={() => count.value++}>
      Increment {count.value}
    </button>
  );
});
```

如果我们想为多个元素或事件重用相同的事件处理程序，我们需要从 `@builder.io/qwik` 导入 `$` 并将事件处理程序包装在其中。

使用 `$` ，Qwik 可以对点击监听器后面的所有代码进行 tree-shaking 并延迟其加载，直到用户点击按钮。

```tsx
import { component$, useSignal, $ } from '@builder.io/qwik';
 
export default component$(() => {
  const count = useSignal(0);
  const increment = $(() => count.value++);
  return (
    <>
      <button onClick$={increment}>Increment</button>
      <p>Count: {count.value}</p>
    </>
  );
});
```

### preventdefault

因为事件处理是异步的，所以不能使用 `event.preventDefault()` 。为了解决这个问题，Qwik 引入了一种通过 `preventdefault:{eventName}` 属性来防止默认的声明方式。

```tsx
import { component$, useSignal, $ } from '@builder.io/qwik';
 
export default component$(() => {
  const count = useSignal(0);
  const increment = $(() => count.value++);
  return (
    <>
      <button onClick$={increment} preventdefault:click >Increment</button>
      <p>Count: {count.value}</p>
    </>
  );
});
```

### currentTarget

因为事件处理是异步的，所以不能使用 `event.currentTarget` 。为了解决这个问题，Qwik 处理程序提供了一个 `currentTarget` 作为第二个参数。

```tsx
import type { QwikMouseEvent } from '@builder.io/qwik';
import { component$, useSignal, $ } from '@builder.io/qwik';
 
export default component$(() => {
  const count = useSignal(0);
  const increment = $((event:QwikMouseEvent<HTMLButtonElement>, currentTarget:HTMLElement) => {
		console.log(event, currentTarget);
	});
  return (
    <>
      <button onClick$={increment} preventdefault:click >Increment</button>
      <p>Count: {count.value}</p>
    </>
  );
});
```

## 双向数据绑定

bind属性，它是一种方便的 API，用于将 `<input>` 的值绑定到 `Signal` 的双向数据。类似vue的v-model

```tsx
import { component$, useSignal } from '@builder.io/qwik';
 
export default component$(() => {
  const name = useSignal('');
	
  return (
    <div>
		<input type="text" bind:value={name}/>
    </div>
  );
});
```

## 插槽

`<Slot>` 组件是组件子组件的占位符。 `<Slot>` 组件将在渲染期间被该组件的子组件替换。类似于vue的slot组件。

### 默认插槽

```
import { Slot, component$ } from '@builder.io/qwik';
 
const Child = component$(() => {
  return (
    <div>
      Content: <Slot />
    </div>
  );
});
 
export default component$(() => {
  return (
    <Child>
      This goes inside {'<Button>'} component marked by{`<Slot>`}
    </Child>
  );
});
```

### 具名插槽

`Slot` 组件可以在同一组件中多次使用，只要它具有不同的 `name` 属性即可：

```tsx
import { Slot, component$ } from '@builder.io/qwik';
 
const Tab = component$(() => {
  return (
    <section>
      <h2>
        <Slot name="title" />
      </h2>
      <div>
        <Slot /> {/* default slot */}
        <div>
          <Slot name="footer" />
        </div>
      </div>
    </section>
  );
});
 
export default component$(() => {
  return (
    <Tab>
      <div q:slot="title">Qwik</div>
      <div>A resumable framework for building instant web applications</div>
      <span q:slot="footer">made with ❤️ by </span>
      <a q:slot="footer" href="https://builder.io">
        builder.io
      </a>
    </Tab>
  );
});
```

