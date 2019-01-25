const $ = require('jquery');
const HueController = require('./js/huecontrol.js')
const Store = require('electron-store')
const notify = require('node-notifier')
let store = new Store()
let hue = new HueController()

let lastBridge = store.get('lastBridge')

var find = function findBridges() {
  $('#bridges').empty()
  hue.discover().then((bridges) => {
    for (let bridge of bridges) {
      buildBridge(bridge)
      console.log(bridge.ip)
    }
  })
}

function buildBridge(bridge) {
  var tempButton = $('<button class="mdl-button mdl-js-button mdl-button--raised mdl-button--accent"></button>').html(bridge.ip).click(() => {
    connect(bridge.ip)
    console.log(bridge.ip)
  })
  $('#bridges').append($('<li class="mdl-list__item"></li>')
    .append($('<span class="mdl-list__item-primary-content"></span>')
      .append(tempButton)))
}

function buildLights(lights) {
  for (let light of lights) {
    $('#lights-table').append($(`<tr id=${light.id}></tr>`))
    $(`#${light.id}`).append($(`<td></td>`)
      .append(`<button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent">
        ${light.name}
      </button>`).click(() => {
        hue.lightSwitch(light.id)
      }))
    $(`#${light.id}`).append($('<td></td>').append($(`
    <input class="mdl-slider mdl-js-slider" type="range"
      min="0" max="255" value=${light.brightness} tabindex="0">
    `).change((event) => {
      var val = event.target.value
      console.log(val)
      hue.changeBrightness(light.id, val)
    })))
  }
  $('#lights-table').append(
    $(`<tr id="all-lights"></tr>`).append(
      $(`<td></td>`).append(
        $(`<button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent">Reset Lights</button>`)
        .click(() => {
          hue.resetLights()
        }))))
}

var connect = function connectToBridge(ip) {
  hue.connect(ip)
  hue.createUser()
  $('#load-lights').prop('disabled', false)
}

$('#load-config').click(() => {
  if (lastBridge) {
    $('#lights-table').empty()
    $('#load-lights').prop('disabled', false)
    console.log(`ip: ${lastBridge.ip}, username: ${lastBridge.username}`)
    hue = new HueController({ip: lastBridge.ip, username: lastBridge.username})
    hue.getUsername(lastBridge.username)
    hue.getAllLights().then(lights => {
      buildLights(lights)
      notify.notify({title: 'Success!', message: `You have been connected to ${lastBridge.ip}.`})
    }).catch(error => {
      console.log(error.stack)
    })
  } else {
    notify.notify({title: "Connection", message: "No previous bridges found. Please connect."})
  }})

$("#search").click(find)
