<template>
  <div class="container">
    <div class="messaging">
      <div class="inbox_msg">
        <div class="mesgs">
          <div class="msg_history">
            <div v-for="message in messages">
              <div :class="[(message.author)===authUser.displayName?'outgoing_msg':'incoming_msg']">
                <div :class="[(message.author)===authUser.displayName?'sent_msg':'received_msg']">
                  <div :class="[(message.author)===authUser.displayName?'n':'received_withd_msg']">
                    <p>{{decrypt( message.message)}}</p>
                    <span class="time_date">{{message.createdAt.toDate()}} | {{message.author}}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="type_msg">
            <div class="input_msg_write">
              <input @keyup.enter="saveMessage" v-model="message" type="text" class="write_msg" placeholder="Type a message"/>
              <button @click="saveMessage" class="msg_send_btn" type="button">
                <i class="fa fa-paper-plane-o" aria-hidden="true"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import firebase from "firebase";
var bigInt = require("big-integer");
export default {
  name: "PrivateChat",
  data() {
    return {
      message: null,
      messages: [],
	  authUser: {},
	  p: "239",
	  q: "499",
	  n: "0",
	  d: "0",
    e: "691",
    id: ""
    };
  },

  methods: {
	scrollToBottom(){
		let box = document.querySelector('.msg_history');
			box.scrollTop = box.scrollHeight;
	},

    saveMessage() {
	  //	Enviar a firestore

	  //	ENCRIPTACION ANTES DE ENVIAR
   
	  var temp = ""
	  for(var i = 0; i < this.message.length; i++){
		  var ascii = this.message.charCodeAt(i);
		  var encr = this.encrypt(ascii)
		  //console.log(encr)
		  if(encr < 10){
			temp = temp + "0" + encr + ":";
		  }else{
			  temp = temp + encr + ":";
		  }
	  }
    /*	var userEncrypted = ""
	  for(var i = 0; i < this.authUser.displayName.length; i++){
		  var ascii = this.authUser.displayName.charCodeAt(i);
		  var encr = this.encrypt(ascii)
		  if(encr < 10){
			userEncrypted = userEncrypted + "0" + encr;
		  }else{
			  userEncrypted = userEncrypted + encr;
		  }
		  //console.log(encr);
	  }
	  */

      db.collection("chat").add({
		  //message: this.message,
		  message: temp,
		  author: this.authUser.displayName,
		  //author: userEncrypted,
        createdAt: new Date()
      }).then(()=>{
		  this.scrollToBottom();
	  })

      this.message = null;
    },

    fetchMessages() {
      db.collection("chat")
        .orderBy("createdAt")
        .onSnapshot(querySnapshot => {
          let allMessages = [];
          querySnapshot.forEach(doc => {

			  //	DESENCRIPTANDO
			  var mes = doc.data().author;
            allMessages.push(doc.data());
          });
      this.messages = allMessages;
      
        
		  setTimeout(()=>{
			  this.scrollToBottom();
		  }, 1000)
        });
      
  },
  
  fetchUsers(){
    db.collection("users")
        .onSnapshot(querySnapshot => {
          let allMessages = [];
          querySnapshot.forEach(doc => {
            
            //	DESENCRIPTANDO
            var nombre = doc.data().name;
            
            if(this.authUser.displayName === (nombre)){              
              console.log("SOY YO " + doc.id)
              db.collection("users").doc(doc.id).update({privada: 'asddd'});              
            }
          });
          });
      // console.log("asf "+ this.id)
      // db.collection("users").doc(id).set({privada: 'asddd'});
	  
  },
	
	generatePrivateKey(){
    this.p = BigInt(this.p)
    this.q = BigInt(this.q)
    this.n = BigInt(this.n)
    this.e = BigInt(this.e)
    this.d = BigInt(this.d)
		var p = this.p;
		var q = this.q;
    this.n = p * q;
    var uno = BigInt("1")
		var fi = ((p-uno)*(q-uno));
		var i;
		for( i = uno; i <= fi; i++){
			var z
			z = ((i * this.e) % fi)
			if(z==1){
				this.d = i;
				break;
			}
    }
      
		console.log(this.p);
		console.log(this.q);
		console.log(this.d);
    console.log(this.n);
		console.log(this.e);
    console.log(fi);
	},

	encrypt(ascii2){
    var m = bigInt(ascii2)
    var e = bigInt(this.e)
    var n = bigInt(this.n)
    var encr = bigInt(m.toString()).modPow(e, n)
    //var encr = this.exponenteEncryo(ascii);
    //var encr = (ascii ** this.e) % this.n
		return BigInt(encr)
	},

	decrypt(mes){
		var algo = mes.split(":");
			var des = "";
				for(var i = 0; i < algo.length-1; i++){
          var c = bigInt(algo[i])
          var d = bigInt(this.d)
          var n = bigInt(this.n)
          //console.log("c: " + c)
          var asc = bigInt(c.toString()).modPow(d, n)
          //console.log("ASC " + bigInt(asc.toString()))
          des = des + String.fromCharCode(Number(asc)) 
          
          //var asc = (BigInt.modPow("2", )) % this.n
          //console.log(actual)
          //des = des + asc
				  //des = des + (this.exponente(algo[i]));
            
			  }
		console.log(des)
		return des;
	},

  exponentePow(base, potencia){
    var i
    var res = base
    for( i = BigInt("0"); i < potencia-BigInt("1"); i++){
      res = res * base
    }
    //console.log(res)
    return res
  },

	exponente(base){
    console.log("---------------------------")
    //  BigInts
    var exp = BigInt(this.d);
    var temp = BigInt(base);
    var uno = BigInt("1");
    var dos = BigInt("2");
    var n = this.n
    base = BigInt(base)
    
    
    while(exp != uno){
			temp = (temp*temp) % n;
			if(exp%dos == uno){
				// impar
				temp = (temp * base) % n;
      }
      exp = exp/dos;
		}
    
    return String.fromCharCode(Number(temp));
	},

	exponenteEncryo(base){
		var exp = BigInt(this.e);
    var temp = BigInt(base);
    var uno = BigInt("1");
    var dos = BigInt("2");
    var n = BigInt(this.n)

		while(exp != uno){
			temp = (temp*temp) % n;
			if(exp%dos){
				// impar
				temp = (temp * base) % n;
			}
			exp = exp/dos;
		}
		//console.log(temp);

		return temp;
	}
  },

  created() {  	
    
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.authUser = user;
      } else {
        this.authUser = {};
        document.location.href = "/login"
      }
    });
    this.generatePrivateKey();
    this.fetchMessages();
    //this.fetchUsers();
  },

  beforeRouterEnter(to, from, next) {
    
    next(vm => {
      firebase.auth().onAuthStateChanged(user => {
        if (user) {
          next();
        } else {
          document.location.href = "/login"
        }
      });
    });
  }
};
</script>


<style scoped="">
.container {
  max-width: 1170px;
  margin: auto;
}
img {
  max-width: 100%;
}
.inbox_people {
  background: #f8f8f8 none repeat scroll 0 0;
  float: left;
  overflow: hidden;
  width: 40%;
  border-right: 1px solid #c4c4c4;
}
.inbox_msg {
  clear: both;
  overflow: hidden;
}
.top_spac {
  margin: 20px 0 0;
}

.recent_heading {
  float: left;
  width: 40%;
}
.srch_bar {
  display: inline-block;
  text-align: right;
  width: 60%;
  padding: ;
}
.headind_srch {
  padding: 10px 29px 10px 20px;
  overflow: hidden;
  border-bottom: 1px solid #c4c4c4;
}

.recent_heading h4 {
  color: #05728f;
  font-size: 21px;
  margin: auto;
}
.srch_bar input {
  border: 1px solid #cdcdcd;
  border-width: 0 0 1px 0;
  width: 80%;
  padding: 2px 0 4px 6px;
  background: none;
}
.srch_bar .input-group-addon button {
  background: rgba(0, 0, 0, 0) none repeat scroll 0 0;
  border: medium none;
  padding: 0;
  color: #707070;
  font-size: 18px;
}
.srch_bar .input-group-addon {
  margin: 0 0 0 -27px;
}

.chat_ib h5 {
  font-size: 15px;
  color: #464646;
  margin: 0 0 8px 0;
}
.chat_ib h5 span {
  font-size: 13px;
  float: right;
}
.chat_ib p {
  font-size: 14px;
  color: #989898;
  margin: auto;
}
.chat_img {
  float: left;
  width: 11%;
}
.chat_ib {
  float: left;
  padding: 0 0 0 15px;
  width: 88%;
}

.chat_people {
  overflow: hidden;
  clear: both;
}
.chat_list {
  border-bottom: 1px solid #c4c4c4;
  margin: 0;
  padding: 18px 16px 10px;
}
.inbox_chat {
  height: 550px;
  overflow-y: scroll;
}

.active_chat {
  background: #ebebeb;
}

.incoming_msg_img {
  display: inline-block;
  width: 6%;
}
.received_msg {
  display: inline-block;
  padding: 0 0 0 10px;
  vertical-align: top;
  width: 92%;
}
.received_withd_msg p {
  background: #ebebeb none repeat scroll 0 0;
  border-radius: 3px;
  color: #646464;
  font-size: 14px;
  margin: 0;
  padding: 5px 10px 5px 12px;
  width: 100%;
}
.time_date {
  color: #747474;
  display: block;
  font-size: 12px;
  margin: 8px 0 0;
}
.received_withd_msg {
  width: 57%;
}
.mesgs {
  float: left;
  padding: 30px 15px 0 25px;
  width: 100%;
}

.sent_msg p {
  background: #05728f none repeat scroll 0 0;
  border-radius: 3px;
  font-size: 14px;
  margin: 0;
  color: #fff;
  padding: 5px 10px 5px 12px;
  width: 100%;
}
.outgoing_msg {
  overflow: hidden;
  margin: 26px 0 26px;
}
.sent_msg {
  float: right;
  width: 46%;
}
.input_msg_write input {
  background: rgba(0, 0, 0, 0) none repeat scroll 0 0;
  border: medium none;
  color: #4c4c4c;
  font-size: 15px;
  min-height: 48px;
  width: 100%;
}

.type_msg {
  border-top: 1px solid #c4c4c4;
  position: relative;
}
.msg_send_btn {
  background: #05728f none repeat scroll 0 0;
  border: medium none;
  border-radius: 50%;
  color: #fff;
  cursor: pointer;
  font-size: 17px;
  height: 33px;
  position: absolute;
  right: 0;
  top: 11px;
  width: 33px;
}
.messaging {
  padding: 0 0 50px 0;
}
.msg_history {
  height: 516px;
  overflow-y: auto;
}
</style>