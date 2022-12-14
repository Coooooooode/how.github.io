import Web3 from "web3";
import GuestbookArtifact from "../../build/contracts/Guestbook.json";

const App = {
  web3: null,
  account: null,
  meta: null,

  start: async function() {
    const { web3 } = this;

    try {
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = GuestbookArtifact.networks[networkId];
      this.meta = new web3.eth.Contract(
        GuestbookArtifact.abi,
        deployedNetwork.address,
      );

      const accounts = await web3.eth.getAccounts();
      this.account = accounts[0];

      this.loadRandomWords();
    } catch (error) {
      console.error("Could not connect to contract or chain.");
    }
  },

  loadRandomWords: async function(number) {
    const { queryGuestbook, getSize } = this.meta.methods;
    const count  = await getSize().call()
    const msgEl = document.getElementById("msg")
    if (count == 0){
      msgEl.innerHTML = "沒有內容"
    }else{
      let random_num = Math.random() * count
      const word  = await queryGuestbook(parseInt(random_num)).call();
      const msg = "內容:"+word[0]
          +" <br /> 來源:"+word[1]
          +" <br /> 時間:"+ formatTime(word[2])
      msgEl.innerHTML = msg
    }
  },

  saveWord: async function() {
    const msg = document.getElementById("wordArea").value;
    if (msg.length == 0){
      alert("請留下文字喔")
      return
    }

    let timestamp = new Date().getTime()
    const { save } = this.meta.methods;
    await save(msg, parseInt(timestamp / 1000)).send({ from: this.account });

    this.loadRandomWords();
  },
};
function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function formatTime(timestamp) {
  let date = new Date(Number(timestamp * 1000))
  let year = date.getFullYear()
  let month = date.getMonth() + 1
  let day = date.getDate()
  let hour = date.getHours()
  let minute = date.getMinutes()
  let second = date.getSeconds()
  let fDate = [year, month, day, ].map(formatNumber)
  return fDate[0] + '年' + fDate[1] + '月' + fDate[2] + '日' + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
window.App = App;

window.addEventListener("load", function() {
  if (window.ethereum) {
    // use MetaMask's provider
    App.web3 = new Web3(window.ethereum);
    window.ethereum.enable(); // get permission to access accounts
  } else {
    console.warn(
      "No web3 detected. Falling back to http://127.0.0.1:7545. You should remove this fallback when you deploy live",
    );
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    App.web3 = new Web3(
      new Web3.providers.HttpProvider("http://127.0.0.1:7545"),
    );
  }

  App.start();
});