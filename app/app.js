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
            // 待办事项的数据
            let dataString = JSON.stringify(this.todoList)
            window.localStorage.setItem('myTodos', dataString)

            // 输入框输入但未提交的内容
            window.sessionStorage.setItem('puttingTodo', this.newTodo)
        }

        // 读取待办事项的数据
        let oldDataString = window.localStorage.getItem('myTodos')
        let oldData = JSON.parse(oldDataString)
        this.todoList = oldData || []

        // 读取待办事项的数据
        this.newTodo = window.sessionStorage.getItem('puttingTodo') || ''

        // 检查用户是否登陆
        this.currentUser = this.getCurrentUser()
    },
    methods: {
        addTodo: function() {
            let time = new Date()
            let addTime = time.getFullYear() + '-' + time.getMonth() + '-' + time.getDate()
            this.todoList.push({
                title: this.newTodo,
                createdAt: addTime,
                done: false // 添加一个 done 属性
            })

            this.newTodo = '' // 变成空
        },
        removeTodo: function(todo) {
            // 找到给定元素的第一个索引
            let index = this.todoList.indexOf(todo)

            // 从index开始删除1个元素
            this.todoList.splice(index, 1)
        },
        signUp: function() {
            let user = new AV.User();
            user.setUsername(this.formData.username);
            user.setPassword(this.formData.password);
            user.signUp().then((loginedUser) => {
                this.currentUser = this.getCurrentUser()
            }, function(error) {
                alert('注册失败')
            });
        },
        login: function() {
            AV.User.logIn(this.formData.username, this.formData.password).then((loginedUser) => {
                this.currentUser = this.getCurrentUser()
            }, (error) => {
                alert('登录失败')
            });
        },
        getCurrentUser: function() {
            let current = AV.User.current()
            if (current) {
                let { id, createdAt, attributes: { username } } = current
                return { id, username, createdAt }
            } else {
                return null
            }
        },
        logout: function() {
            AV.User.logOut()
            this.currentUser = null
            window.location.reload()
        }
    }
})


bar();