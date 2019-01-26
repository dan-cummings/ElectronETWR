const $ = require('jquery')
const player = require('play-sound')(opts = {})
const HueController = require(`${__dirname}/light/js/huecontrol.js`)
const { ipcRenderer } = require('electron')
const Store = require('electron-store')

let token1 = false
let token2 = false
let token3 = false

let dragOrigin
let dragText

let store = new Store()
let hue

let lastBridge = store.get('lastBridge')

if (lastBridge) {
    hue = new HueController({ ip: lastBridge.ip, username: lastBridge.username })
    hue.getUsername(lastBridge.username)
}

function activateLight(lightid) {
    if (hue) {
        hue.lightSwitch(lightid)
    }
}

function playsound() {
    player.play("./main/resources/correct.wav")
}

function winner() {
    player.play("./main/resources/etwr-outro-winners-audioonly.m4a")
    ipcRenderer.send('create-window', 'winner')
}

$('#fixed-tab-1').load('./main/pages/puzzle-entry.html', () => {

    $('#token1').keyup((event) => {
        var input = event.target.value
        if (input.toUpperCase() === "nat1962".toUpperCase()) {
            $('#token1').prop('disabled', true)
            var token2 = $('#token2')
            token2.focus()
            token1 = true
            playsound()
            // activateLight(1)
            if (token1 & token2 & token3) {
                console.log('done')
                $('#submit').show('slow')
            }
        }
        if (event.keyCode == 13) {
            event.preventDefault();
        }
    })

    $('#token2').keyup((event) => {
        var input = event.target.value
        if (input.toUpperCase() === "prodapm1".toUpperCase()) {
            $('#token2').prop('disabled', true)
            var token3 = $('#token3')
            token3.focus()
            token2 = true
            playsound()
            // activateLight(2)
            if (token1 & token2 & token3) {
                console.log('done')
                $('#submit').show('slow')
            }
        }
        if (event.keyCode == 13) {
            event.preventDefault();
        }
    })

    $('#token3').keyup((event) => {
        var input = event.target.value
        if (input.toUpperCase() === "vesper".toUpperCase()) {
            $('#token3').prop('disabled', true)
            token3 = true
            playsound()
            // activateLight(3)
            if (token1 & token2 & token3) {
                console.log('done')
                $('#submit').show('slow')
            }
        }
        if (event.keyCode == 13) {
            event.preventDefault();
        }
    })
    $('#submit').click(event => {
        $('#fixed-tab-1').fadeOut('slow', () => {
            $('#fixed-tab-1').empty()
            $('#fixed-tab-1').load('./main/pages/puzzle-order.html', () => {
                $('#fixed-tab-1').fadeIn('slow')
                function positionCheck() {
                    if ($('.place-1').text() === 'PRODAPM1' && $('.place-2').text() === 'VESPER' && $('.place-3').text() === 'NAT1962') {
                        playsound()
                        hue.lightSwitch(4)
                        setTimeout(() => {
                            winner()
                        }, 3000);
                    }
                }

                function allowDrop(ev) {
                    ev.preventDefault();
                }

                function drag(ev) {
                    dragOrigin = $(ev.target)
                    dragText = $(ev.target).text()
                }

                function drop(ev) {
                    ev.preventDefault();
                    dragOrigin.text($(ev.target).text())
                    $(ev.target).text(dragText)
                    positionCheck()
                }

                $('.place-1').on('drag', (event) => drag(event))
                $('.place-2').on('drag', (event) => drag(event))
                $('.place-3').on('drag', (event) => drag(event))

                $('.place-1').on('drop', (event) => drop(event))
                $('.place-2').on('drop', (event) => drop(event))
                $('.place-3').on('drop', (event) => drop(event))

                $('.place-1').on('dragover', (event) => allowDrop(event))
                $('.place-2').on('dragover', (event) => allowDrop(event))
                $('.place-3').on('dragover', (event) => allowDrop(event))

            })
        })
    })

})