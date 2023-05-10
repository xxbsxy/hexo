---
title: React18 基础
tags: React
categories: 前端
sticky: 9
---
## 1. React-Vite搭建

```shell
npm create vite@latest my-react-app -- --template react
```

## 2. 绑定class和style

### 2.1 动态绑定class

#### 2.1.1 写法一

```jsx
import React, { memo, useState } from 'react'

const App = memo(() => {
	const [isActive, setIsActive] = useState(true)
	// isActive为true时 动态添加active类名
	return (
		<div className={`title ${isActive ? 'active' : ''} `}>App</div>
	)
})

export default App
```

#### 2.1.2 写法二

```js
import React, { memo, useState } from 'react'

const App = memo(() => {
	const [isActive, setIsActive] = useState(true)
	// isActive为true时 动态添加active类名
	const classList = ['total']
	if (isActive) {
		classList.push('active')
	}
	return (
		<div className={classList.join(' ')}>App</div>
	)
})

export default App
```

#### 2.1.3 写法三使用classnames库

**安装classnames**

```
npm install classnames
```

**在jsx中使用**

```jsx
import React, { memo, useState } from 'react'
import classNames from 'classnames'

const App = memo(() => {
	const [isActive, setIsActive] = useState(true)
	// isActive为true时 动态添加active类名
	return (
		<div className={classNames('total', { active: isActive })}>App</div>
	)
})

export default App
```

### 2.2绑定style

```jsx
import React, { memo, useState } from 'react'

const App = memo(() => {
	return (
		<div style={{ color: 'red', fontSize: '28px' }}>App</div>
	)
})

export default App
```

## 3. 条件渲染

### 3.1 写法一 使用三元运算符

```jsx
import React, { memo, useState } from 'react'

const App = memo(() => {
	const [isShow, setIsShow] = useState(false)
	// isShow为true时 则渲染button
	return (
		<div className="app">
			{isShow ? <button>show</button> : <h2>show</h2>}
		</div>
	)
})

export default App
```

### 3.2 写法二 使用&&运算符

```jsx
import React, { memo, useState } from 'react'

const App = memo(() => {
	const [obj, setObj] = useState(null)

	setTimeout(() => {
		setObj({
			name: 'aaa'
		})
	}, 100)
	// 例如obj是服务器请求的数据 刚开始可能为空
	return (
		<div className="app"> {obj && obj.name} </div>
	 )
})

export default App
```

### 3.2 写法三 使用?.可选链

```jsx
import React, { memo, useState } from 'react'

const App = memo(() => {
	const [obj, setObj] = useState(null)

	setTimeout(() => {
		setObj({
			name: 'aaa'
		})
	}, 100)
	// 例如obj是服务器请求的数据 刚开始可能为空
	return (
		<div className="app"> {obj?.name} </div>
	)
})

export default App
```

 

## 4. 受控组件和非受控组件

### 4.1 受控组件

当一个表单绑定了value属性并且值来源于state，并且只能通过使用setState来更新，使 React 的 state 成为“唯一数据源”，被 React 以这种方式控制取值的表单输入元素就叫做“受控组件”。

#### 4.1.1 input标签

```jsx
import React, { memo, useState } from 'react'

const App = memo(() => {
	const [username, setUsername] = useState('aaa')

	const inputChange = (e) => {
		setUsername(e.target.value)
	}

	return (
		<div className="app">
			<input type="text" onChange={inputChange} value={username} />
		</div>
	)
})

export default App
```

#### 4.1.2 checkbox标签

```jsx
import React, { memo, useState } from 'react'

const App = memo(() => {
	const [isAgree, setIsAgree] = useState(true)
	const [hobbies, setHobbies] = useState([
		{ value: 'sing', text: '唱', checked: true },
		{ value: 'dance', text: '跳', checked: true },
		{ value: 'rap', text: 'rap', checked: true }
	])

	const agreeChange = (e) => {
		setIsAgree(e.target.checked)
	}
	const hobbyChange = (e, index) => {
		const newHobbies = [...hobbies]
		newHobbies[index].checked = e.target.checked
		setHobbies(newHobbies)
	}

	return (
		<div className="app">
			<form action="">
				{/* 单选框 */}
				<label htmlFor="agree">
					<input type="checkbox" id="agree" checked={isAgree} onChange={agreeChange} /> 同意协议
				</label>
				{/* 多选框 */}
				<div>
					您的爱好：
					{hobbies.map((item, index) => {
						return (
							<label htmlFor={item.value} key={item.value}>
								<input
									type="checkbox"
									id={item.value}
									checked={item.checked}
									onChange={(e) => hobbyChange(e, index)}
								/>
								{item.text}
							</label>
						)
					})}
				</div>
			</form>
		</div>
	)
})

export default App
```

#### 4.1.3 select标签

```jsx
import React, { memo, useState } from 'react'

const App = memo(() => {
	const [fruit, setFruit] = useState('苹果')

	const fruitChange = (e) => {
		setFruit(e.target.value)
	}

	return (
		<div className="app">
			<form action="">
				<select value={fruit} onChange={fruitChange}>
					<option value="apple">苹果</option>
					<option value="orange">橘子</option>
					<option value="banner">香蕉</option>
				</select>
			</form>
		</div>
	)
})

export default App

```



#### 4.1.4 一个函数处理多个受控组件

```jsx
import React, { memo, useState } from 'react'

const App = memo(() => {
	const [username, setUsername] = useState('aaa')
	const [password, setPassword] = useState('123456')


	const inputChange = (e) => {
		if (e.target.name === 'username') {
			setUsername(e.target.value)
		} else {
			setPassword(e.target.value)
		}
	}

	return (
		<div className="app">
			<form action="">
				<label htmlFor="username">
					<input type="text" name='username' value={username} onChange={inputChange} />
				</label>
				<label htmlFor="password">
					<input type="password" name='password' value={password} onChange={inputChange} />
				</label>
			</form>
		</div>
	)
})

export default App
```

### 4.2 非受控组件

非受控组件的表单数据将交由 DOM 节点来处理，使用ref来获取输入的值

```jsx
import React, { memo, useRef } from 'react'

const App = memo(() => {
	const inputRef = useRef()

	const getInputData = () => {
		console.log(inputRef.current.value)
	}

	return (
		<div className="app">
			<input type="text" ref={inputRef} />
			<button onClick={getInputData}>获取input数据</button>
		</div>
	)
})

export default App
```

## 5. css的写法

### 5.1 写法一 内联样式

**内联样式的优点**

- 样式之间不会有冲突
- 可以动态绑定state中的数据

**内联样式的缺点**

- 没有样式提示
- 大量的样式代码混乱
- 伪类伪元素等无法编写

```
import React, { memo, useRef, useState } from 'react'

const App = memo(() => {
	const [size, setSize] = useState(30)
	return (
		<div className="app" style={{ color: 'red', fontSize: `${size}px` }}>App</div>
	)
})

export default App
```

### 5.2 写法二 引入css文件

**缺点**

- 编写的css是全局的css，样式之间会相互影响

style.css

```
.app{ 
	color: red;
	font-size: 20px;
}
```

app.jsx

```
import React, { memo, useRef } from 'react'
import './style.css'
const App = memo(() => {
	return (
		<div className="app">App</div>
	)
})

export default App
```

### 5.3 写法三 css模块化

需要把.css/.less/.scss文件编写成.module.css/.module.less/.module.scss

style.module.css

```css
.app{ 
	color: red;
	font-size: 20px;
}
```

app.jsx

```jsx
import React, { memo } from 'react'
import appStyle from './style.module.css'
const App = memo(() => {
	return (
		<div className={appStyle.app}>App</div>
	)
})

export default App
```

### 5.4 写法四 css in js

1. 安装styled-components

```
npm install styled-components
```

2. 在vscode安装vscode-styled-components插件

**style.css**

```
import styled from 'styled-components'

export const AppWrapper = styled.div`
	.header {
		font-size: 26px;
		font-weight: 700;
	}
	.content {
		display: flex;
		.left {
			color: red;
		}
		.right {
			color: blue;
		}
	}
	.footer{ 
		color: purple;
	}
`.app{ 
	color: red;
	font-size: 20px;
}
```

**app.jsx**

```
import React, { memo } from 'react'
import { AppWrapper } from './style'
const App = memo(() => {
	return (
		<AppWrapper>
			<div className="header">header</div>
			<div className="content">
				<div className="left">left</div>
				<div className="right">right</div>
			</div>
			<div className="footer">footer</div>
		</AppWrapper>
	)
})

export default App
```

## 6. redux

### 6.1 在node环境中使用redux

#### 6.1.1 使用redux中的数据

1. 安装

```shell
npm install redux
```

2. 新建store/index.js

```js
const { createStore } = require('redux')

// 初始化数据
const initialState = {
  name: 'aaa'
}

// 定义一个reducer函数（纯函数）
function reducer() {
  return initialState
}

const store = createStore(reducer)

module.exports = store
```

3. 在main.js中使用

```js
const store = require('./store/index')

console.log(store.getState())
```

#### 6.1.2 修改redux中的数据

store/index.js

```js
const { createStore } = require('redux')

// 初始化数据
const initialState = {
  name: 'aaa',
  age: 18
}

// 定义一个reducer函数（纯函数）
// 接收两个参数 state和action
// 一旦派发了action reducer函数就会再次执行
// 返回值为store中存储的state

function reducer(state = initialState, action) {
  if (action.type === 'change_name') {
    // 不能直接修改state的数据，这样就不是纯函数了
    // 返回一个新的state
    return { ...state, name: action.name }
  } else if (action.type === 'change_age') {
    return { ...state, age: action.age }
  }

  return state
}

const store = createStore(reducer)

module.exports = store
```

main.js

```js
const store = require('./store/index')

// 修改state的数据 需要通过派发action
const nameAction = { type: 'change_name', name: 'bbb' }
const ageAction = { type: 'change_age', age: 20 }

//派发一个action
store.dispatch(nameAction)
store.dispatch(ageAction)
```

#### 6.1.3 订阅数据的变化

```js
const store = require('./store/index')

// 当store中的数据发生改变 会自动回调这个函数
store.subscribe(() => {
  console.log(store.getState())
})

// 修改state的数据 需要通过派发action
const nameAction = { type: 'change_name', name: 'bbb' }
const ageAction = { type: 'change_age', age: 20 }

//派发一个action
store.dispatch(nameAction)
store.dispatch(ageAction)
```

#### 6.1.4 代码优化

1. **新建store/constants.js 定义常量**

```
const CHANGE_NAME = 'change_name'
const CHANGE_AGE = 'change_age'

module.exports = {
  CHANGE_NAME,
  CHANGE_AGE
}
```

2. **新建store/actionCreatore.js 动态生成action**

```
import { CHANGE_AGE, CHANGE_NAME } from './constants'

const changeNameAction = (name) => ({
  type: CHANGE_NAME,
  name
})

const changeAgeAction = (age) => ({
  type: CHANGE_AGE,
  age
})

module.exports = {
  changeNameAction,
  changeAgeAction
}
```

3. **新建store/reducer.js存放reducer函数**

```
const { CHANGE_AGE, CHANGE_NAME } = require('./constants')

// 初始化数据
const initialState = {
  name: 'aaa',
  age: 18
}

function reducer(state = initialState, action) {
  switch (action.type) {
    case CHANGE_NAME:
      return { ...state, name: action.name }
    case CHANGE_AGE:
      return { ...state, age: action.age }
    default:
      return state
  }
}

module.exports = reducer
```

4. **store/index.js**

```
const { createStore } = require('redux')
const reducer = require('./reducer')

const store = createStore(reducer)

module.exports = store
```

5. **main.js**

```
const store = require('./store/index')
const { changeNameAction, changeAgeAction } = require('./store/actionCreatore')

// 当store中的数据发生改变 会自动回调这个函数
store.subscribe(() => {
  console.log(store.getState())
})

//派发一个action
store.dispatch(changeNameAction('bbb'))
store.dispatch(changeAgeAction(20))
```

### 6.2 在react中使用Redux Toolkit

#### 6.2.1 基本使用

1. 安装

```
npm install @reduxjs/toolkit react-redux
```

2. 新建store/index.js

```jsx
import { configureStore } from '@reduxjs/toolkit'

import counterReducer from './features/counter'

const store = configureStore({
  // 合并多个Slice
  reducer: {
    counter: counterReducer
  }
  // 是否开启插件 默认为true
  // devTools: true
  // 中间件
  // middleware: {}
})

export default store
```

3. 新建store/features/counter.js

```jsx
import { createSlice } from '@reduxjs/toolkit'
import { createGlobalStyle } from 'styled-components'

const counterSlice = createSlice({
  // 用户标记slice的名称 会在redux-devtool显示
  name: 'counter',
  // 初始化值
  initialState: {
    counter: 666
  },
  reducers: {
    addNumberAction(state, { payload }) {
      state.counter = state.counter + payload
    },
    subNumberAction(state, { payload }) {
      state.counter = state.counter - payload
    }
  }
})

// 导出action
export const { addNumberAction, subNumberAction } = counterSlice.actions

export default counterSlice.reducer
```

4. src/main.js

```js
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { Provider } from 'react-redux'
import store from '../src/store'

ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<Provider store={store}>
			<App />
		</Provider>
	</React.StrictMode>
)
```

5. src/App.jsx

```jsx
import React, { memo } from 'react'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { addNumberAction, subNumberAction } from './store/features/counter'
const App = memo(() => {
	// memo包裹的高阶组件只有在props发生改变才会重新渲染
	// 由于useSelector监听的是整个state中的数据，如果父组件和子组件都使用了state数据
	// 当父组件派发了一个action修改了state的数据，那么子组件也会重新渲染，这显然是不合理的
	// 所以需要传入shallowEqual参数可以进行浅层比较，进行性能的优化

	// 获取store中的数据
	const { counter } = useSelector((state) => ({
		counter: state.counter.counter
	}), shallowEqual)

	// 派发action
	const dispatch = useDispatch()
	const addCounter = (num) => {
		dispatch(addNumberAction(num))
	}
	const subCounter = (num) => {
		dispatch(subNumberAction(num))
	}

	return (
		<div className="app">
			<h2>Counter: {counter} </h2>
			<button onClick={e => addCounter(1)}>+1</button>
			<button onClick={e => subCounter(1)}>-1</button>
		</div>
	)
})

export default App
```

#### 6.3.2 异步操作方式一 

在useEffect中发送网络请求

```jsx
import { memo, useEffect } from 'react'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { changeBannersAction } from './store/features/home'
const Home = memo(() => {
	const { banners } = useSelector((state) => ({
		banners: state.home.banners
	}), shallowEqual)

	const dispatch = useDispatch()
	useEffect(() => {
    // 获取数据派发action
		axios.get('http://43.143.0.76:3000/banner').then(res => {
			dispatch(changeBannersAction(res.data.banners))
		})
	}, [])

	return (
		<div className="home">
			{banners.map(item => {
				return (
					<div key={item.targetId}>
						<img src={item.imageUrl} alt="" />
					</div>
				)
			})}
		</div>
	)
})

export default Home
```

#### 6.3.3 异步操作方式二

使用createAsyncThunk和extraReducers进行异步操作

**store/features/home.js**

```js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
//createAsyncThunk函数第一个参数是名称会在redux插件中 显示第二个参数是一个回调函数
export const fetchChangeBannersAction = createAsyncThunk('home/homeBanners', async () => {
  const res = await axios.get('http://43.143.0.76:3000/banner')
  // 返回结果变为fulfilled状态
  return res.data.banners
})

const homeSlice = createSlice({
  name: 'home',
  initialState: {
    banners: []
  },
  reducers: {
  },
  // 针对异步操作
  extraReducers(builder) {
    // pending状态
    builder.addCase(fetchChangeBannersAction.pending, (state, action) => {})
    // fulfilled状态
    builder.addCase(fetchChangeBannersAction.fulfilled, (state, { payload }) => {
      state.banners = payload
    })
    // rejected状态
    builder.addCase(fetchChangeBannersAction.rejected, (state, action) => {})
  }
})

export default homeSlice.reducer
```

**Home.jsx**

```jsx
import { memo, useEffect } from 'react'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { fetchChangeBannersAction } from './store/features/home'
const Home = memo(() => {
	const { banners } = useSelector((state) => ({
		banners: state.home.banners
	}), shallowEqual)

	const dispatch = useDispatch()
	useEffect(() => {
		dispatch(fetchChangeBannersAction())
	}, [])

	return (
		<div className="home">
			{banners.map(item => {
				return (
					<div key={item.targetId}>
						<img src={item.imageUrl} alt="" />
					</div>
				)
			})}
		</div>
	)
})

export default Home
```

#### 6.3.3 异步操作方式三

使用createAsyncThunk但不使用extraReducers

**store/features/home.js**

```jsx
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
// createAsyncThunk函数第一个参数是名称会在redux插件中 显示第二个参数是一个回调函数
// 回调函数中第一个参数是派发action时传递的参数，第二个参数是store
export const fetchChangeBannersAction = createAsyncThunk(
  'home/homeBanners',
  async (data, { dispatch }) => {
    const res = await axios.get('http://43.143.0.76:3000/banner')
    dispatch(changeBannersAction(res.data.banners))
  }
)

const homeSlice = createSlice({
  name: 'home',
  initialState: {
    banners: []
  },
  reducers: {
    changeBannersAction(state, { payload }) {
      state.banners = payload
    }
  }
})

export const { changeBannersAction } = homeSlice.actions

export default homeSlice.reducer
```

## 7 react router 6

### 7.1 基本使用

1. 安装

```
npm install react-router-dom
```

2. 配置路由模式

- BrowserRouter为history模式
- HashRouter为hash模式

```
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { HashRouter } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<HashRouter>
			<App />
		</HashRouter>
	</React.StrictMode>,
)
```

3. 配置路由映射和跳转

```jsx
import React, { memo } from 'react'
import { Link, Navigate, NavLink, Route, Routes } from 'react-router-dom'
import About from './pages/About'
import Home from './pages/Home'

const App = memo(() => {

	return (
		<div className='app'>
			<div className="header">
				<div className="nav">
					{/* 路由跳转 */}
					<Link to='/home'>首页</Link>
					<Link to='/about'>关于</Link>
					{/* <NavLink to='/about'></NavLink> 选中的会自动加一个.active类名 */}
				</div>
			</div>
			<div className="content">
				{/* 配置映射关系 */}
				<Routes>
					<Route path='/home' element={<Home />}/ >
					<Route path='/about' element={<About />} />
					{/* Navigate 用于路由重定向 */}
					<Route path='/' element={<Navigate to='/home' />}></Route>
				</Routes>
			</div>
			<div className="footer">footer</div>
		</div>
	)
})

export default App
```

### 7.2 嵌套路由

```
<div className='content'>
  {/* 配置映射关系 */}
  <Routes>
    {/* 嵌套路由 */}
    <Route path='/home' element={<Home />}>
      <Route path='/home/recommend' element={<HomeReacommend />} />
    </Route>
    <Route path='/about' element={<About />} />
    {/* Navigate 用于路由重定向 */}
    <Route path='/' element={<Navigate to='/home' />}></Route>
  </Routes>
</div>
```

配置Outlet作为子路由出口

```
import React, { memo } from 'react'
import { Outlet } from 'react-router-dom'

const Home = memo(() => {
	return (
		<div>
			<Outlet />
		</div>
	)
})

export default Home
```

### 7.3 编程式路由导航

`useNavigate()` 返回一个函数，调用该函数实现编程式路由导航。函数有两种参数传递方式。

- 第一种方式传递两个参数：路由和相关参数。参数只能设置 `replace` 和 `state`。想要传递 `params` 和 `search` 参数直接在路由带上。
- 第二种方式传递数字，代表前进或后退几步。

```
const navigate = useNavigate()
const toHome = () => {
	navigate('/home')
}
const toAbout = () => {
	navigate('/about', {
		replace: true
	})
}
const forword = () => {
	navigate(1)
}
const back = () => {
	navigate(-1)
}
```

### 7.4 路由传参

#### 7.4.1 传递 params参数

**传递参数**

```
const [id, setId] = useState(100)
const toAbout = () => {
	navigate(`/about/${id}`)
}
<Route path='/about/:id' element={<About />} />
```

**获取参数**

```
const {id} = useParams()
console.log(id) // {id: 100}
```

#### 7.4.2 传递 search参数

**传递参数**

```
const [id, setId] = useState(100)
const [name, setName] = useState('aaa')
const toAbout = () => {
	navigate(`/about?id=${id}&name=${name}`)
}
<Route path='/about' element={<About />} />
```

**获取参数**

```
// 数组的解构赋值
const [searchParams, setSearchParams] = useSearchParams()
// 需要调用 get() 方法获取对应的参数值
const id = searchParams.get('id')
const name = searchParams.get('name')
```

#### 7.4.3 传递 state 参数

**传递参数**

```
const toAbout = () => {
	navigate('/about', {
		state: {
			id: 100,
			name: 'aaa'
		}
	})
}
<Route path='/about' element={<About />} />
```

**获取参数**

```
const { state } = useLocation()

console.log(state.id)
console.log(state.name)
```

### 7.5 路由表

新建router/index.js

```
import { Navigate } from 'react-router-dom'
import About from '../pages/About'
import Home from '../pages/Home'
import HomeReacommend from '../pages/HomeReacommend'

const routes = [
  {
    path: '/',
    element: <Navigate to='/home' />
  },
  {
    path: '/home',
    element: <Home />,
    children: [
      {
        path: '/home',
        element: <Navigate to='/home/recommend' />
      },
      {
        path: '/home/recommend',
        element: <HomeReacommend />
      }
    ]
  },
  {
    path: '/about',
    element: <About />
  }
]

export default routes
```

App.jsx导入配置

```jsx
import routes from './router'
import { useRoutes } from 'react-router-dom'
<div className="content">
 {useRoutes(routes)}
</div>
```

### 7.6 路由懒加载

**router/index.js**

```
import React from 'react'
import { Navigate } from 'react-router-dom'

const About = React.lazy(() => import('../pages/About'))
const Home = React.lazy(() => import('../pages/Home'))
const HomeReacommend = React.lazy(() => import('../pages/HomeReacommend'))

const routes = [
  {
    path: '/',
    element: <Navigate to='/home' />
  },
  {
    path: '/home',
    element: <Home />,
    children: [
      {
        path: '/home',
        element: <Navigate to='/home/recommend' />
      },
      {
        path: '/home/recommend',
        element: <HomeReacommend />
      }
    ]
  },
  {
    path: '/about',
    element: <About />
  }
]

export default routes
```

**src/main.js**

```
import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { HashRouter, BrowserRouter } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<HashRouter>
			<Suspense fallback='loading'>
				<App />
			</Suspense>
		</HashRouter>
	</React.StrictMode>,
)
```

## 8 hooks
