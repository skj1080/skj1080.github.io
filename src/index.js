import Caver from "caver-js";
import {Spinner} from 'spin.js';

const config = {
  rpcURL: 'https://api.baobab.klaytn.net:8651'
}
const cav = new Caver(config.rpcURL);
const manageContract = new cav.klay.Contract(DEPLOYED_ABI_MANAGE, DEPLOYED_ADDRESS_MANAGE);
var walletInstance;
var agContract = new cav.klay.Contract(DEPLOYED_ABI, DEPLOYED_ADDRESS);
var candidates_display = false;
var votenum=-1;
var contracts =[]
var intervals =[]
const App = {
  auth: {
    accessType: 'keystore',
    keystore: '',
    password: ''
  },

  start: async function () {
    const walletFromSession = sessionStorage.getItem('walletInstance');
    if (walletFromSession) {
      try {
        cav.klay.accounts.wallet.add(JSON.parse(walletFromSession));
        this.changeUI(JSON.parse(walletFromSession));
      } catch (e) {
        sessionStorage.removeItem('walletInstance');
      }
    }
  },

  handleImport: async function () {
    const fileReader = new FileReader();
    fileReader.readAsText(event.target.files[0]);
    fileReader.onload = (event) => {      
      try {     
        if (!this.checkValidKeystore(event.target.result)) {
          $('#message').text('유효하지 않은 keystore 파일입니다.');
          return;
        }    
        this.auth.keystore = event.target.result;
        $('#message').text('keystore 통과. 비밀번호를 입력하세요.');
        document.querySelector('#input-password').focus();    
      } catch (event) {
        $('#message').text('유효하지 않은 keystore 파일입니다.');
        return;
      }
    }   
  },

  enroll_voter: async function(){
    agContract.methods.get_pqg().call().then(value =>{
      const walletInstance = this.getWallet();
      var privateKey = BigInt(walletInstance.privateKey); 
      var p = BigInt(value[0]);
      var q = BigInt(value[1]);
      var g = BigInt(value[2]);
      var key1 = parseInt((g**(privateKey % q)) % p);
      var key2 = parseInt((g**(q-(privateKey % q))) % p);
      agContract.methods.enroll_voter(key1, key2).send({
        from: walletInstance.address,
        gas: '250000'
      }).then(value => {
        if(value){
          alert("등록 성공");
          //$('#transaction').html("");
          //$('#transaction').append(`<p><a href='https://baobab.klaytnscope.com/tx/${value.transactionHash}' target='_blank'>클레이튼 Scope에서 트랜잭션 확인</a></p>`);
        }else{
          alert("오류 발생");
        }
      })
    })
    $('#enrollModal_voter').modal('hide');
  },

  enroll_candidate: async function(){
    const walletInstance = this.getWallet();
    await agContract.methods.enroll_candidate(this.auth.candidate).send({
      from: walletInstance.address,
      gas: '250000'
    }).then(res =>{if(res)alert("등록 성공")
    if(!res)alert("오류 발생")})
    $('#enrollModal_candidate').modal('hide');
  },  
  
  genVoting: async function(){
    const walletInstance = this.getWallet();
    await manageContract.methods.generate_contract(this.auth.votename, this.auth.votetime).send({from: walletInstance.address,
      gas: '2000000'})
    $('#genModal').modal('hide');
  },

  vote: async function(candi_value){
    const walletInstance = this.getWallet();
    var voting_value = BigInt(1);
    var privateKey = BigInt(walletInstance.privateKey); 
    await agContract.methods.get_n().call().then(n =>{
      agContract.methods.get_vote_num().call().then(my_num =>{
        agContract.methods.get_pqg().call().then(pqg =>{
          var p = BigInt(pqg[0]); 
          for(var i=0; i<my_num; i++){
            agContract.methods.get_voter(i).call().then(keys =>{
              voting_value *= BigInt(keys[0]);
              voting_value %= p;
            })
          }
          for(var i=my_num+1;i<n;i++){
            agContract.methods.get_voter(i).call().then(keys =>{
              voting_value *= BigInt(keys[1]);
              voting_value %= p;
            })
          }
          voting_value = (voting_value ** (privateKey % q)) % p
          voting_value = (voting_value * BigInt(candi_value)) % p
          agContract.methods.vote(parseInt(voting_value)).send({
            from: walletInstance.address,
            gas: '250000'
          }).then(res =>{
            if(res) alert("투표 완료");
            if(!res) alert("오류 발생")
          })  
        })
      })
    })
  },

  additional_vote: async function(){
    const walletInstance = this.getWallet();
    var voting_value = BigInt(1);
    await agContract.methods.get_n().call().then(n =>{
      agContract.methods.get_vote_num().call().then(my_num =>{
        agContract.methods.get_pqg().call().then(pqg =>{
          var p = BigInt(pqg[0]); 
          for(var i=0; i<my_num; i++){
            agContract.methods.get_voter(i).call().then(keys =>{
              if(keys[2] == false){
              voting_value *= BigInt(keys[0]);
              voting_value %= p;}
            })
          }
          for(var i=my_num+1;i<n;i++){
            agContract.methods.get_voter(i).call().then(keys =>{
              if(keys[2]==false){
              voting_value *= BigInt(keys[1]);
              voting_value %= p;}
            })
          }
          voting_value = (voting_value ** (privateKey % q)) % p
          agContract.methods.additional_vote(parseInt(voting_value)).send({
            from: walletInstance.address,
            gas: '250000'
          }).then(res =>{
            if(res) alert("투표 복원 완료");
            if(!res) alert("오류 발생")
          })  
        })
      })
    })
  },

  get_result: async function(){
    for (var i = 0 ; i < intervals.length; i++){
      clearInterval(intervals[i]);
    }
    intervals = []
    $('#tallying').hide();
    $('#result').show();
    agContract.methods.get_k().call().then(k =>{
      for(var i=0;i<k;i++){
        agContract.methods.get_candidate(i).call().then(value =>{ 
          $('#result').append('<code>Candidate '+value[0]+' wons '+value[1]+' votes!</code></br>');
        })
      }
    });
  },

  handleCandidate: async function () {
    this.auth.candidate = event.target.value;
  },

  handleVotingName: async function () {
    this.auth.votename = event.target.value;
  },
  handleVotingTime: async function () {
    this.auth.votetime = event.target.value;
  },

  handlePassword: async function () {
    this.auth.accessType = 'keystore';
    this.auth.password = event.target.value;
  },  
  handlePrivateKey: async function () {
    this.auth.accessType = 'privatekey';
    this.auth.PrivateKey = event.target.value;
  },
  handleVotingValue: async function () {
    this.auth.votingValue = event.target.value;
  },
  handleVotime: async function () {
    this.auth.votime = event.target.value;
  },

  handleLogin: async function () {
    if (this.auth.accessType === 'keystore') { 
      try {
        const privateKey = cav.klay.accounts.decrypt(this.auth.keystore, this.auth.password).privateKey;
        this.integrateWallet(privateKey);
      } catch (e) {      
        $('#message').text('비밀번호가 일치하지 않습니다.');
      }
    }
    if (this.auth.accessType === 'privatekey') { 
      try {
        this.integrateWallet(this.auth.PrivateKey);
      } catch (e) {      
        $('#message').text('개인 키가 정확하지 않습니다.');
      }
    }
  },

  handleLogout: async function () {
    this.removeWallet();
    location.reload();
  },

  changeRound1: async function(){
    const walletInstance = this.getWallet();
    await agContract.methods.enroll_round().send({
      from: walletInstance.address,
      gas: '250000'
    })
  },
  changeRound2: async function(){
    const walletInstance = this.getWallet();
    await agContract.methods.vote_round(this.auth.votime).send({
      from: walletInstance.address,
      gas: '250000'
    })
    
    $('#VotetimeModal').modal('hide');
  },

  changeRound3: async function(){
    const walletInstance = this.getWallet();
    await agContract.methods.all_vote().call().then(res =>{
      if(res == true){
        agContract.methods.tally_round().send({
        from: walletInstance.address,
        gas: '250000'
        }).then(res => {agContract.methods.tallying().send({
        from: walletInstance.address,
        gas: '250000'
        })}
        )
      }else{
        agContract.methods.additional_round().send({
          from: walletInstance.address,
          gas: '250000'
        })
      }
    }) 
  }, 
  changeRound4: async function(){
    const walletInstance = this.getWallet();
    await agContract.methods.all_add_vote().call().then(res=>{
      if(res == true){
        agContract.methods.tally_round().send({
          from: walletInstance.address,
          gas: '250000'
          }).then(res => {agContract.methods.tallying().send({
          from: walletInstance.address,
          gas: '250000'
          })}
          )
      }else{
        alert("아직 복원 투표가 끝나지 않았습니다.")
      }
    })
    
  },

  callOwner: async function () {
    return await agContract.methods.owner().call();
  },

  callpqg: async function () {
    return await agContract.methods.get_pqg().call();
  },

  getWallet: function () {
    if (cav.klay.accounts.wallet.length) {
      return cav.klay.accounts.wallet[0];
    }
  },

  checkValidKeystore: function (keystore) {
    const parsedKeystore = JSON.parse(keystore);
    const isValidKeystore = parsedKeystore.version &&
      parsedKeystore.id &&
      parsedKeystore.address &&
      parsedKeystore.keyring;  

    return isValidKeystore;
  },

  integrateWallet: function (privateKey) {
    const walletInstance = cav.klay.accounts.privateKeyToAccount(privateKey);
    cav.klay.accounts.wallet.add(walletInstance)
    sessionStorage.setItem('walletInstance', JSON.stringify(walletInstance));
    this.changeUI(walletInstance);  
  },

  reset: function () {
    this.auth = {
      keystore: '',
      password: ''
    };
  },

  selectContract: async function(select_address_num){
    var select_address = contracts[select_address_num][0];
    var voting_name = contracts[select_address_num][1];
    agContract = new cav.klay.Contract(DEPLOYED_ABI, select_address);
    walletInstance = this.getWallet();
    $('#voting_name').text('현재 투표: ' +voting_name);   
    intervals.push(setInterval(this.changeUI2, 1000)); 
  },

  listUI: async function(){
    await manageContract.methods.num().call().then(value=>{
      if(value != votenum){
        $('#contracts').text("");
        for(var i=0; i<value; i++){
          const num = i;
          manageContract.methods.get_contract(i).call().then(result=>{
            contracts[num] = [result[0],result[1]];
            $('#contracts').append(`<a style="cursor:pointer" onclick="App.selectContract(${num})">${result[1]}</a></br>`);
          })
        }
        votenum = value;
      }
    });
  },

  changeUI: async function (walletInstance) {
    $('#loginModal').modal('hide');
    $('#loginModal_key').modal('hide');
    $("#login").hide(); 
    $("#login_key").hide(); 
    $('#enrolls').hide();
    $('#votes').hide();
    $('#tallying').hide();
    $('#additional').hide();
    $('#logout').show();
    $('#list').show();
    $('#address').text("");
    $('#address').append('<br>' + '<p>' + '내 계정 주소: ' + walletInstance.address + '</p>');
    setInterval(this.listUI, 1000); 
  },

  changeUI2: async function(){
    $('#game').show();
    $('#result').hide();
    agContract.methods.get_pqg().call().then(value =>{
      $('#pqg').text("");
      $('#pqg').append('<p>' + 'p, q, g: ' + value[0] +', '+ value[1]+', '+ value[2] + '</p>');    
    })
    await agContract.methods.round().call().then(value =>{
      var rounds = ['등록 단계','투표 단계','집계 단계','복원 단계'];
      $('#enrolls').hide();
      $('#votes').hide();
      $('#tallying').hide();
      $('#candidates').hide();
      $('#additional').hide();
      if(value==0){
        $('#enrolls').show();
        agContract.methods.remain_time().call().then(value =>{
          if(value>0){
          $('#times').text("남은시간: "+value+"초");}
          else{
            $('#enrolls').text("시간이 만료되었습니다.");
          }
        })
        candidates_display = false;
      }else if(value == 1){
        $('#votes').show();
        $('#candidates').show();
        agContract.methods.remain_time().call().then(value =>{
          if(value>0){
          $('#candidates').text("남은시간: "+value+"초");}
          else{
            $('#candidates').text("시간이 만료되었습니다.");
          }
        })
        agContract.methods.get_k().call().then(k =>{
          if(candidates_display == false){
            $('#votes').text("");
            $('#votes').append("<p>투표 할 대상을 고르세요</p>");
            for(var i=0;i<k;i++){
              agContract.methods.get_candidate(i).call().then(value =>{ 
                $('#votes').append('<button type="button" style="width:150px;margin:10px" class="btn btn-default" onclick="App.vote('+value[1]+')">'+value[0]+'</button></br>');
              })
            }
            candidates_display = true;
          }
        });
      }else if(value == 2){
        $('#tallying').show();
        $('#result').text("");
        candidates_display = false;
      }else if(value == 3){
        $('#additional').show();
        candidates_display = false;
      }
      $('#round').text("");
      $('#round').append('<p> --'+rounds[value]+'--</p>');    
    })

    agContract.methods.owner().call().then(value =>{
    if (value.toLowerCase() === walletInstance.address.toLowerCase()) {
      $("#owner").show(); 
    }else{
      $("#owner").hide(); 
    }
  })
  },

  removeWallet: function () {
    cav.klay.accounts.wallet.clear();
    sessionStorage.removeItem('walletInstance');
    this.reset();
  }
};

window.App = App;

window.addEventListener("load", function () { 
  App.start();
});

var opts = {
  lines: 10, // The number of lines to draw
  length: 30, // The length of each line
  width: 17, // The line thickness
  radius: 45, // The radius of the inner circle
  scale: 1, // Scales overall size of the spinner
  corners: 1, // Corner roundness (0..1)
  color: '#5bc0de', // CSS color or array of colors
  fadeColor: 'transparent', // CSS color or array of colors
  speed: 1, // Rounds per second
  rotate: 0, // The rotation offset
  animation: 'spinner-line-fade-quick', // The CSS animation name for the lines
  direction: 1, // 1: clockwise, -1: counterclockwise
  zIndex: 2e9, // The z-index (defaults to 2000000000)
  className: 'spinner', // The CSS class to assign to the spinner
  top: '50%', // Top position relative to parent
  left: '50%', // Left position relative to parent
  shadow: '0 0 1px transparent', // Box-shadow for the lines
  position: 'absolute' // Element positioning
};