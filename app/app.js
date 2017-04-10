import bar from './bar';
import Vue from 'vue'

var app = new Vue({
    el: '#app',
    data: {
        newTodo: '',
        todoList: []
    },
    created: function() {
        // 窗口关闭前触发函数
        window.onbeforeunload = () => {
            let dataString = JSON.stringify(this.todoList)
            window.localStorage.setItem('myTodos', dataString)
        }

        let oldDataString = window.localStorage.getItem('myTodos')
        let oldData = JSON.parse(oldDataString)
        this.todoList = oldData || []
    },
    methods: {
        addTodo: function() {
            this.todoList.push({
                title: this.newTodo,
                createdAt: new Date(),
                done: false // 添加一个 done 属性
            })

            this.newTodo = '' // 变成空
        },
        removeTodo: function(todo) {
            // 找到给定元素的第一个索引
            let index = this.todoList.indexOf(todo)

            // 从index开始删除1个元素
            this.todoList.splice(index, 1)
        }

    }
})


bar();