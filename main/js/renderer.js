const $ = require('jquery')
const player = require('play-sound')(opts = {})
const { ipcRenderer } = require('electron')

let token1 = false
let token2 = false
let token3 = false

let dragOrigin
let dragText

function playsound() {
    player.play("./main/resources/correct.wav")
}

function winner() {
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
        $('#fixed-tab-1').empty()
        $('#fixed-tab-1').load('./main/pages/puzzle-order.html', () => {
            function positionCheck() {
                if ($('.place-1').text() === 'PRODAPM1' && $('.place-2').text() === 'VESPER' && $('.place-3').text() === 'NAT1962') {
                    winner()
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
                console.log(dragOrigin)
                console.log(dragText)
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

$('#tab1').click(event => {
    $('#tab1').show('slow')
})

$('#tab2').click(event => {
    $('#tab2').show('slow')
})