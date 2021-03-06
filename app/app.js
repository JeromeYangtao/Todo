import bar from './bar'
import Vue from 'vue'
import AV from 'leancloud-storage'


// 初始化LeanCloud SDK
var APP_ID = 'ABfjkfJDuyHlgvMvoRs9GEhx-gzGzoHsz'
var APP_KEY = 'QjmfmAu5R4opGUOjaMHQJ92O'
AV.init({
    appId: APP_ID,
    appKey: APP_KEY
})



var app = new Vue({
    el: '#app',
    data: {
        actionType: 'signUp',
        formData: {
            username: '',
            password: ''
        },
        newTodo: '',
        todoList: [],
        currentUser: null
    },
    created: function() {
        // 窗口关闭前触发函数
        window.onbeforeunload = () => {
            // 输入框输入但未提交的内容
            window.sessionStorage.setItem('puttingTodo', this.newTodo)
        }


        // 读取待办事项的数据
        this.newTodo = window.sessionStorage.getItem('puttingTodo') || ''

        // 检查用户是否登陆
        this.currentUser = this.getCurrentUser()
        this.fetchTodos()
    },
    methods: {
        fetchTodos: function() {
            if (this.currentUser) {
                var query = new AV.Query('AllTodos')
                query.find().then((todos) => {
                    let avAllTodos = todos[0]
                    let id = avAllTodos.id
                    this.todoList = JSON.parse(avAllTodos.attributes.content)
                    this.todoList.id = id
                }, function(error) {
                    console.error(error)
                })
            }
        },
        updateTodos: function() {
            let dataString = JSON.stringify(this.todoList)
            let avTodos = AV.Object.createWithoutData('AllTodos', this.todoList.id)
            avTodos.set('content', dataString)
            avTodos.save().then(() => {
                console.log('更新成功')
            })
        },
        saveTodos: function() {
            let dataString = JSON.stringify(this.todoList)
            var AVTodos = AV.Object.extend('AllTodos');
            var avTodos = new AVTodos();
            avTodos.set('content', dataString);
            avTodos.save().then((todo) => {
                this.todoList.id = todo.id
                console.log('保存成功');
            }, function(error) {
                alert('保存失败');
            });
        },
        saveOrUpdateTodos: function() {
            if (this.todoList.id) {
                this.updateTodos()
            } else {
                this.saveTodos()
            }
        },
        addTodo: function() {
            let time = new Date()
            let addTime = time.getFullYear() + '-' + time.getMonth() + '-' + time.getDate()
            this.todoList.push({
                title: this.newTodo,
                createdAt: addTime,
                done: false // 添加一个 done 属性
            })

            this.newTodo = '' // 变成空
            this.saveOrUpdateTodos()
        },
        removeTodo: function(todo) {
            // 找到给定元素的第一个索引
            let index = this.todoList.indexOf(todo)

            // 从index开始删除1个元素
            this.todoList.splice(index, 1)
            this.saveOrUpdateTodos()
        },
        signUp: function() {
            let user = new AV.User();
            user.setUsername(this.formData.username);
            user.setPassword(this.formData.password);
            user.signUp().then((loginedUser) => {
                this.currentUser = this.getCurrentUser()
            }, function(error) {
                console.log(error)
            });
        },
        login: function() {
            AV.User.logIn(this.formData.username, this.formData.password).then((loginedUser) => {
                this.currentUser = this.getCurrentUser()
                this.fetchTodos()
            }, (error) => {
                console.log(error)
            });
        },
        logout: function() {
            AV.User.logOut()
            this.currentUser = null
            window.location.reload()
        },
        getCurrentUser: function() {
            let current = AV.User.current()
            if (current) {
                let { id, createdAt, attributes: { username } } = current
                return { id, username, createdAt }
            } else {
                return null
            }
        }
    }
})


bar();