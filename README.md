# ElectronETWR

## Setup

### Hue Bridge and Lights setup
1. Connect the Hue bridge to the router via ethernet cable
1a. Each room should be equip with an enthernet connection which will allow us to link router to the internet.
2. Plug in bulbs, default is on, leave bulbs on and wait 2~3 minutes to allow the bridge to connect
3. Leave bulbs on while setting up app

### Application setup
1. Download the latest release of the Electron App
2. Startup application by selecting the version applicable to the laptop OS and Architecture
3. Ensure you are on TP-Link network via wifi
4. Application will start on API token input screen
5. Access the Hue configuration window by using shortcut (ctrl + i or cmd + i)
6. Click button to search for local Hue Bridges, found bridges will be listed by IP via buttons
7. Press link button on Hue Bridge then click the button created for the bridge IP
8. Upon successful connection a notification will be displayed and a list of lights will be generated on the table
9. Buttons generated for the lights will toggle them between on/off and "All Lights" button applies the change to each light registered to the bridge (sliders are available to adjust intensity)
10. After successful connection, close hue configuration window and refresh application using "F5"


### Application reset
1. After run through, open hue config (ctrl/cmd + i) and select "load last bridge" this will provide access to light toggle buttons
2. Toggle lights off and close hue config window
3. If customer wins, module window can be closed by either escape button or by pressing F2
4. Total application reset can be done using "F5" command

### Notes
* Hue bridge settings are only required once during setup as connection data and authorization is stored locally
* In the event that lights are not functional, no application interference occurs (contact your local Dan)
