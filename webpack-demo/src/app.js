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
  //   window.onbeforeunload = () => {
  //     let dataString = JSON.stringify(this.todoList)
  //   //   window.localStorage.setItem('myTodos', dataString)
  //   // }
  //   // let oldDataString = window.localStorage.getItem('myTodos')
  //   // let oldData = JSON.parse(oldDataString)
  //   // this.todoList = oldData || []
  //   var AVTodos = AV.Object.extend('AllToddos')
  //   var avTodos = new AVTodos()
  //   avTodos.set('content',datastring)
  //   avTodos.save().then(function(todo){
  //     console.log('success')
  //   },function(error){
  //     console.log('wrong')
  //   });
  //   debugger
  // }
    //一开始就要检查用户是否登陆

    this.currentUser = this.getCurrentUser();
    if(this.currentUser){
      var query = new AV.Query('AllTodos')
      query.find()
      .then((todos)=>{
        let avAllTodos = todos[0]
        let id = avAllTodos.id
        this.todoList = JSON.parse(avAllTodos.attributes.content)
        this.todoList.id = id
      },function(error){
           console.error(error)
         })
    }
  },
  methods: {
    updateTodos:function(){
      let dataString = JSON.stringify(this.todoList)
      console.log(dataString)
      let avTodos = AV.Object.createWithoutData('AllTodos',this.todoList.id)
      avTodos.set('content',dataString)//修改属性
      avTodos.save().then(()=>{        //保存到云端
        console.log('update success')
      })
    },
    saveOrUpdateTodos:function(){
      if(this.todoList.id){
        this.updateTodos()
      }else{
        this.saveTodos()
      }
    },
    saveTodos:function(){
      var dataString = JSON.stringify(this.todoList)
      var AllTodos = AV.Object.extend('AllTodos')
      var allTodos = new AllTodos()
      var acl = new AV.ACL()
      acl.setReadAccess(AV.User.current(),true)//只有这个用户可以读写
      acl.setWriteAccess(AV.User.current(),true)
      allTodos.set('content' , dataString);
      allTodos.setACL(acl) //设置访问控制
      allTodos.save().then((todo)=>{
        this.todoList.id = todo.id
        alert('保存成功')
      },function(error){
        alert('失败了')
      })
    },
    addTodo: function () {
      this.todoList.push({
        title: this.newTodo,
        createdAt: new Date(),
        done: false  //添加一个done属性
      })
      this.newTodo = '' //写完清空
      this.saveOrUpdateTodos()
    },
    removeTodo: function (todo) {
      let index = this.todoList.indexOf(todo)
      this.todoList.splice(index, 1)
      this.saveOrUpdateTodos()
    },
    signUp: function () {
      let user = new AV.User();
      user.setUsername(this.formData.username);
      user.setPassword(this.formData.password);
      user.signUp().then( (loginedUser)=> {
       this.currentUser = this.getCurrentUser()
      },  (error)=> {
        alert('wrong')
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