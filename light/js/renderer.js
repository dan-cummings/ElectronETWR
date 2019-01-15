const $ = require('jquery');
const HueController = require('./js/huecontrol.js')
const Store = require('electron-store')
const notify = require('node-notifier')
let store = new Store()
let hue = new HueController()

let lastBridge = store.get('lastBridge')

var find = function findBridges() {
  hue.discover().then((bridges) => {
    for (let bridge of bridges) {
      buildBridge(bridge)
    }
  })
}

function buildBridge(bridge) {
  var tempButton = $('<button class="mdl-button mdl-js-button mdl-button--raised mdl-button--accent"></button>').html(bridge.ip).click(() => {
    connect(bridge.ip)
  })
  $('#bridges').append($('<li class="mdl-list__item"></li>')
    .append($('<span class="mdl-list__item-primary-content"></span>')
      .append(tempButton)))
}

var connect = function connectToBridge(ip) {
  hue.connect(ip)
  hue.createUser()
}

$('#load-config').click(() => {
  if (lastBridge) {
    console.log(`ip: ${lastBridge.ip}, username: ${lastBridge.username}`)
    hue = new HueController({ip: lastBridge.ip, username: lastBridge.username})
    hue.getUsername(lastBridge.username)
    hue.getAllLights().then(lights => {
      for (let light of lights) {
        $('#lights-table').append($(`<tr id=${light.id}></tr>`))
        $(`#${light.id}`).append($(`<td></td>`)
          .append(`<button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent">
            ${light.name}
          </button>`))
      }
      $('#lights-table').append(
        $(`<tr id="all-lights></tr>`).append(
          $(`<td></td>`).append(
            $(`<button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent">All Lights</button>`)
            .click(() => {
              hue.resetLights()
            }))))
    }).catch(error => {
      console.log(error.stack)
    })
  } else {
    notify.notify({title: "Connection", message: "No previous bridges found. Please connect."})
  }})

$("#search").click(find)
