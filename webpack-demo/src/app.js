import bar from './bar';
import Vue from 'vue';
import AV from 'leancloud-storage'
var APP_ID = 'P7c1ltO2q571ijFpt1PHbymJ-gzGzoHsz';
var APP_KEY = '8hCLDm2kfbqzXQY1KOfUmxdU';

AV.init({
  appId: APP_ID,
  appKey: APP_KEY
});
// var TestObject = AV.Object.extend('TestObject');
// var testObject = new TestObject();
// testObject.save({
//   words: 'Hello World!'
// }).then(function (object) {
//   alert('LeanCloud Rocks!');
// })


var app = new Vue({
  el: '#app',
  data: {
    newTodo: '',
    todoList: [],
    actionType: 'signUp',
    formData: {
      username: '',
      password: ''
    },
    currentUser:null,
  },

  created: function () {
    window.onbeforeunload = () => {
      let dataString = JSON.stringify(this.todoList)
      window.localStorage.setItem('myTodos', dataString)
    }
    let oldDataString = window.localStorage.getItem('myTodos')
    let oldData = JSON.parse(oldDataString)
    this.todoList = oldData || []
    //一开始就要检查用户是否登陆
    this.currentUser = this.getCurrentUser();
  },
  methods: {
    addTodo: function () {
      this.todoList.push({
        title: this.newTodo,
        createdAt: new Date(),
        done: false  //添加一个done属性
      })
      this.newTodo = '' //写完清空
    },
    removeTodo: function (todo) {
      let index = this.todoList.indexOf(todo)
      this.todoList.splice(index, 1)
    },
    signUp: function () {
      let user = new AV.User();
      user.setUsername(this.formData.username);
      user.setPassword(this.formData.password);
      user.signUp().then( (loginedUser)=> {
       this.currentUser = this.getCurrentUser()
      },  (error)=> {
        alert('wwrong')
      });
    },
    login: function () {
      AV.User.logIn(this.formData.username, this.formData.password).then( (loginedUser)=> {
        this.currentUser = this.getCurrentUser()
      }, (error)=> {
        alert('wrong')
      });
    },
    getCurrentUser:function(){
     
      let current = AV.User.current()
      if(current){
        let{id ,createdAt,attributes:{username}}=current
        return {id,username,createdAt}
      }else{
        return null
      }
    },
    logout:function(){
      AV.User.logOut()
      this.currentUser = null
      window.location.reload()
    }
  }
})