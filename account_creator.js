var SteamUser = require('steam-user');
var SteamStore = require('steamstore');
var SteamTotp = require('steam-totp');
var readlineSync = require('readline-sync');
var fs = require('fs');

var client = new SteamUser();
var user = new SteamUser();
var store = new SteamStore();

var username, password;

var cookieArray = {};

console.log('---- Welcome to Steam Bot Creator ' + JSON.parse(fs.readFileSync('package.json', 'utf8')).version + ' for NodeJS ----');

client.logOn();

client.on('loggedOn', function(details) {
  console.log('>> Successfully logged onto Steam anonmyously.');
  console.log('>> Beginning process of account creation:');
  createAccount();
});

/*user.on('loggedOn', function(details) {
  console.log('>> Logged onto new account.');
  user.webLogOn();
  verifyEmail();
});*/

user.on('webSession', function(sessionID, cookies) {
  cookieArray = cookies;
});

function makeId(length) {
  var text = "";
  var letters = "abcdefghijklmnopqrstuvwxyz";
  var uppercase_letters  = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var numbers = "0123456789";
  
  //uppercase and number
  text += uppercase_letters.charAt(Math.floor(Math.random() * uppercase_letters.length));
  text += numbers.charAt(Math.floor(Math.random() * numbers.length));
  //the rest of the letters != uppercase
  for (var i = 0; i < length - 2; i++)
    text += letters.charAt(Math.floor(Math.random() * letters.length));

  return text;
}

function editFile() {
var f='combo.txt',
    fs=require('fs');

/*fs.writeFile(f,"Username" + ":" + "Password\n",function(err){
  if(err)
    console.error(err);
  console.log('Written!');
});*/

fs.appendFile(f,"\n"+username +":"+password,function(err){
  if(err)
    console.error(err);
  console.log(username +' logged to file!');
  //initClient();
  purify();
});
}

function createAccount() {
  //username = readlineSync.question('Username: ');
  username = makeId(25);
  //password = readlineSync.question('Password: ');
  password = makeId(25);
  var email = readlineSync.question('Email: ');
  client.createAccount(username, password, email, function (result) {
    if (result == SteamUser.Steam.EResult.OK) {
      console.log('>> Account created successfully.');
      editFile();
      //initClient();
    } else if (result == SteamUser.Steam.EResult.DuplicateName) {
      console.log('>> There is already an account with the username ' + username + '. Please reload the application.');
      process.exit(1);
    } else if (result == SteamUser.Steam.EResult.IllegalPassword) {
      console.log('>> Problem with password (greater than 8 chars, too common, etc). Please reload the application.');
      process.exit(1);
    } else {
      console.log('Error while creating the account. Error code: ' + result);
      process.exit(1);
    }
  });
}

function purify(){

  createAccount();

}

/*function initClient() {
  client.logOff();
  client = null;
  user.logOn({
    'accountName': username,
    'password': password
  });
}*/

/*function verifyEmail() {
  console.log('>> Please complete verification by email sent by Steam.');
  user.requestValidationEmail(function(result) {
    if (result == SteamUser.Steam.EResult.OK) {
      var ignore = readlineSync.question('Enter done when verified: ');
      addPhoneNumber();
    } else {
      console.log('>> Error while sending verification email. Closing application.');
      process.exit(1);
    }
  });
}

function addPhoneNumber() {
  console.log('>> Beginning phone verification...');
  if (typeof cookieArray == 'undefined' || cookieArray.length < 3) {
    console.log('>> ERROR! Unable to receive cookies from Steam. Waiting 5 seconds to retry.');
    setTimeout(function() {
        addPhoneNumber();
    }, 5000);
  } else {
    store.setCookies(cookieArray);
  }
  console.log('>> WARNING: Phone number must have a leading plus and country code!');
  console.log('>> Example: +18885550123');
  var phone = readlineSync.question('Enter phone #: ');
  store.addPhoneNumber(phone, function(err) {
    if (err) {
      console.log('>> Error with processing phone number: ' + err.message);
      console.log('>> Exiting application.');
      process.exit(1);
    } else {
      console.log('>> Sent confirmation to phone.');
      verifyPhone();
    }
  });
}

function verifyPhone() {
  console.log('>> Enter SMS verification code sent to phone.');
  var code = readlineSync.question('Code: ');
  store.verifyPhoneNumber(code, function(err) {
    if (err) {
      console.log(err);
      console.log('>> Error while confirming code: ' + err.message);
      console.log('>> Exiting application.');
      process.exit(1);
    } else {
      console.log('>> Verified phone number successfully.');
      enableTwoFactor();
    }
  });
}

function enableTwoFactor() {
  console.log('>> In order to enable two-factor authentication, please run the 2fa_enable node file.');
  process.exit(1);
}*/
