(function (window) {
	let datas = [{
			id: 1,
			content: "吃饭",
			status: true
		},
		{
			id: 2,
			content: "睡觉",
			status: true
		},
		{
			id: 3,
			content: "看书",
			status: true
		},
		{
			id: 4,
			content: "敲代码",
			status: true
		}
	];

	Vue.directive('focus', {
		inserted(el) {
			el.focus()
		}
	})

	Vue.directive('todo-focus', {
		update(el, binding) {
			if (binding) {
				el.focus()
			}
		},
	})

	window.app = new Vue({
		el: ".todoapp",
		data: {
			todos: JSON.parse(window.localStorage.getItem("todos") || "[]"),
			editing: "",
			filterText: 'all',
		},

		methods: {
			// 数据添加
			handleListAdd(e) {
				console.log(this.todos)
				let value = e.target.value.trim();
				if (value.length === 0) return;
				this.todos.push({
					// 保证 ID 不会重复 如果数据是空 就设置为 1
					id: this.todos.length == 0 ? 1 : this.todos[this.todos.length - 1].id + 1,
					content: value,
					status: false
				});
				e.target.value = "";
			},

			// 删除单项任务
			handleDel(index) {
				this.todos.splice(index, 1);
			},

			// 全选与反选
			toggleCheckedAll(e) {
				this.todos.forEach(ele => {
					ele.status = e.target.checked;
				});
			},

			// 双击进入编辑状态
			handleEditing(txt) {
				this.editing = txt;
			},

			// 编辑完成处理
			handleEdit(item, index, e) {
				// console.log(item)
				// 按下回车或者失去焦点保存内容
				// 内容为空则直接删除任务项
				if (item.content.length === 0) {
					return this.todos.splice(index, 1);
				}
				item.content = e.target.value;
			},

			// esc 退出编辑
			handleEsc() {
				this.editing = null;
			},

			// 清除已完成
			clearCompleted() {
				let data = this.todos;
				for (let index = 0; index < data.length; index++) {
					if (data[index].status === true) {
						data.splice(index, 1);
						index -= 1;
					}
				}
			}

			//
		},

		computed: {
			// 未完成数量
			remainingCount: {
				get() {
					return this.todos.filter(t => !t.status).length;
				}
			},

			// 样式联动
			checkedAll: {
				get() {
					// 计算属性会依赖data数据，当数据发生改变时，会重新计算
					return this.todos.every(t => t.status);
				},
				set(e) {
					// 等价于调用 checkedAll计算属性的 get 方法 并获得值
					// 在自身的 set 方法中调用自己  就等于调用了自己的 get 方法
					let checked = this.checkedAll;
					this.todos.forEach(ele => {
						ele.status = !checked;
					});
				}
			},

			// 过滤数据
			filterTodos() {
				switch (this.filterText) {
					case 'active':
						console.log(this.todos.filter(t => !t.status))
						return this.todos.filter(t => !t.status)
						break;
					case 'completed':
						return this.todos.filter(t => t.status)
						break;
					default:
						return this.todos
						break;
				}
			},
		},

		watch: {
			todos: {
				handler() {
					window.localStorage.setItem("todos", JSON.stringify(this.todos))
				},
				deep: true
			}
		}
	})

	// 注册 hash 改变事件
	function handlehashchange() {
		app.filterText = (window.location.hash.substr(2))
	}
	window.onhashchange = handlehashchange
	// 保持路由路径状态
	handlehashchange()
})(window)
