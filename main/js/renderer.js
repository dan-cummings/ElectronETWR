const $ = require('jquery')
const player = require('play-sound')(opts = {})
const HueController = require(`${__dirname}/light/js/huecontrol.js`)
const { ipcRenderer } = require('electron')
const Store = require('electron-store')
const Typed = require('typed.js')

let token1 = false
let token2 = false
let token3 = false

let dragOrigin
let dragText

let store = new Store()
let hue
let typing
let stringArray = ['curl -X GET hiu91451.dev.dynatracelabs.com/api/v1/userSessionQueryLanguage/table?query=SELECT userId FROM usersession WHERE startTime 201540998501185 & Api-Token=',
'PRODAPM1-VESPER-NAT1962<br /><br />&nbsp;^1000Poking the API monkeys.^1000.^1000.^1000.<br />&nbsp;Sending bananas and query.^1000.^1000.^1000.<br />&nbsp;Formatting unintelligible response from monkeys.^1000.^1000.^1000.<br /><br />Response:`<br />&nbsp;{<br />&nbsp;&nbsp;"extrapolationLevel" : 1,<br />&nbsp;&nbsp;"columnNames":["userId"], <br /> &nbsp; "values":[[<span style="color: #2ab06f">"GENERAL FANNY RIDEWELL"</span>]]<br/>&nbsp;}`']

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
            $('#token1').css('border-bottom-color','#17ba0c')
            $('#token1').css('color','#17ba0c')
            var token2 = $('#token2')
            token2.focus()
            token1 = true
            playsound()
            activateLight(1)
            if (token1 & token2 & token3) {
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
            $('#token2').css('border-bottom-color','#17ba0c')
            $('#token2').css('color','#17ba0c')
            var token3 = $('#token3')
            token3.focus()
            token2 = true
            playsound()
            activateLight(2)
            if (token1 & token2 & token3) {
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
            $('#token3').css('border-bottom-color','#17ba0c')
            $('#token3').css('color','#17ba0c')
            token3 = true
            playsound()
            activateLight(3)
            if (token1 & token2 & token3) {
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
                var typing1 = new Typed('#type1', {strings: [stringArray[0]], typeSpeed: 10})
                function positionCheck() {
                    if ($('.place-1').text() === 'PRODAPM1' && $('.place-2').text() === 'VESPER' && $('.place-3').text() === 'NAT1962') {
                        playsound()
                        $('span.typed-cursor').remove()
                        var typing2 = new Typed('#type2', {strings: [stringArray[1]], typeSpeed: 10})
                        activateLight(4)
                        setTimeout(() => {
                            winner()
                        }, 16000);
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

$('#tab1').click((event) => {
    event.preventDefault()
    $('#fixed-tab-2').slideUp('slow',() => {
        $('#fixed-tab-1').slideDown('slow')
    })
})

$('#tab2').click((event) => {
    event.preventDefault()
    $('#fixed-tab-1').slideUp('slow',() => {
        $('#fixed-tab-2').slideDown('slow')
    })
})