var UserRegistration = require("./code/controllers/userRegistration.js");
var UserLogin = require("./code/controllers/userLogin.js");
var fs = require("fs"); 

var homeLayout = fs.readFileSync( __dirname + "/code/views/homeLayout.html")
var loginLayout = fs.readFileSync( __dirname + "/code/views/loginLayout.html")
var signUpLayout = fs.readFileSync( __dirname + "/code/views/signUpLayout.html")
var mapLayout = fs.readFileSync( __dirname + "/code/views/mapLayout.html")

var container = document.querySelector("._3vot")
var homeLogContainer;
var loginCard;
var signupCard;


 //Load Home Layout
 container.innerHTML = homeLayout;
 var homeLogContainer = document.getElementById("home-log-container");
 goLogin();

// goLogin()

function goRegister(){

  var loginCard = document.getElementById("login-card");
  
  if (loginCard) {
    loginCard.classList.remove("is-shown")
    setTimeout(function() {
      changeViewtoRegister();
      setViewRegister();
    }, 500);  
  }else{
    changeViewtoRegister();
    setViewRegister();
  };

  function changeViewtoRegister(){
    homeLogContainer.innerHTML = signUpLayout;
    var signupCard = document.getElementById("signup-card");
    signupCard.classList.add("is-shown");
  }
 
}

function setViewRegister(){
    btnToLogin = document.getElementById("toLoginBtn");
    btnToLogin.onclick = function(e){
      mixpanel.track("Btn To Login");
      e.preventDefault();
      goLogin()
    }
  
    btnRegistration = document.getElementById("registrationBtn");
    btnRegistration.onclick = function(e){
      mixpanel.track("Btn Registration");
      e.preventDefault();
      var username = document.getElementById("registerUserName").value;
      var email = document.getElementById("registerEmail").value;
      var password = document.getElementById("registerPassword").value;
  
      if (username != "" && email != "" && password != "") {
      var params = [username, email, password];
      registration(params)  
      } else {
        alert("Todos los campos son requeridos");
      }
    }
  }

function goLogin(){
  // For production
  var signupCard = document.getElementById("signup-card");

  if (signupCard) {
    signupCard.classList.remove("is-shown");
    setTimeout(function() {
      changeViewtoLogin();
      setViewLogin()
    }, 500);
  }else{
    changeViewtoLogin();
    setViewLogin()
  };

  function changeViewtoLogin(){
    homeLogContainer.innerHTML = loginLayout;
    var loginCard = document.getElementById("login-card");
    loginCard.classList.add("is-shown");
  }
 
}

function setViewLogin(){
  var btnLogin = document.getElementById("loginBtn");


  //If there was a previous succesfull login, use the same
  //data and log automatically
  var localEmail = sessionStorage.email;
  var localPass = sessionStorage.password;  

  if (localEmail != undefined && localPass != undefined) {
    //console.log(localEmail + " " + localPass);
    var params = [localEmail,localPass]
    login(params);
  };    

  //If there is no previous login data saved, 
  //login normally filling the form and submitting it
  
  btnLogin.onclick = function(e){
    mixpanel.track("Btn Login");
    e.preventDefault(); 
    var email = document.getElementById("loginEmail").value;
    var password = document.getElementById("loginPassword").value;
    if (email != "" && password != "") {
      var params = [email, password];
      login(params);
      //If there is a succesfull login, save session data in sessionStorage
      sessionStorage.email = email;
      sessionStorage.password = password; 
    } else {
      alert("Todos los campos son requeridos");
      sessionStorage.clear();
    }    
  }


  var btnToRegister = document.getElementById("toRegisterBtn");
  btnToRegister.onclick = function(e){
    mixpanel.track("Btn To Register");
    e.preventDefault();
    goRegister();
  }

}

function registration(params){
  UserRegistration.emit("registration", params);
}

function login(params){
  UserLogin.emit("login", params);
}
///
