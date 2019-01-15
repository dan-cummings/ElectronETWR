const huejay = require('huejay')

class HueController {

    constructor(state) {
        this.user
        this.client
        if (state) {
            this.connect(state.ip, state.username)
        }
    }

    discover() {
        return huejay.discover({ strategy: 'upnp' })
    }

    connect(ip, name = 'bridgeusername') {
        this.client = new huejay.Client({
            host: ip,
            port: 80,               // Optional
            username: name,
            timeout: 15000,            // Optional, timeout in milliseconds (15000 is the default)
        });
    }

    createUser() {
        this.user = new this.client.users.User
        this.client.users.create(this.user).then((user) => {
            console.log(`New user created - Username: ${user.username}`);
            this.client.username = user.username
            this.client.bridge.isAuthenticated().then(() => {
                notify.notify({title: 'Success!', message: `You have been connected to ${this.client.bridge.ip}.`})
                store.set('lastBridge', {ip: this.client.host, username: this.client.username})
            }).catch(error => {
                notify.notify({title: 'Failure!', message: `Could not authenticate.`})
            })
        }).catch(error => {
            if (error instanceof huejay.Error && error.type === 101) {
              notify.notify({title: 'Connection Failed', message: 'Link button not pressed. Please press button.'})
            }
            console.log(error.stack);
        });
    }

    getAllLights() {
        return this.client.lights.getAll()
    }

    resetLights() {
        this.client.lights.getAll().then(lights => {
            for(let light of lights) {
                light.on = false
                this.client.lights.save(light)
            }
        }).catch(error => {
            console.log(error.stack)
        })
    }

    lightSwitch(id, on) {
        this.client.lights.getById(id).then(light =>{
            light.on = on
            return client.lights.save(light)
        }).then(light => {
            console.log('Light updated')
        }).catch(error => {
            console.log('Something went wrong')
        })
    }

    getUsername(name) {
        this.user = new this.client.users.User
        this.client.users.getByUsername(name).then(user => {
            this.client.username = user.username
        }).catch(error => {
            console.log(error.stack)
        })
    }

    ping() {
        this.client.bridge.ping()
        .then(() => {
            console.log('Successful connection');
        })
        .catch(error => {
            console.log('Could not connect');
        });
    }
}

module.exports = HueController