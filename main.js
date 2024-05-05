const { app, BrowserWindow, globalShortcut } = require('electron');
const fs = require('fs');
const readline = require('readline');

// TRACK KILLS OF:
// const trackKillsOf = "Cardinal Sanctus Vox";
const trackKillsOf = "Aukuna, the Black Sekhema";
// const trackKillsOf = "Viper Napuatzi";
// const trackKillsOf = "Queen Hyrri Ngamaku";
// const trackKillsOf = "General Marceus Lioneye";

// RESET ON VOICELINE OF:
const resetOnVoicelineOf = "Cardinal Sanctus Vox";
// const resetOnVoicelineOf = "Aukuna, the Black Sekhema";
// const resetOnVoicelineOf = "Viper Napuatzi";
// const resetOnVoicelineOf = "Queen Hyrri Ngamaku";
// const resetOnVoicelineOf = "General Marceus Lioneye";






let win;

function createWindow() {
    win = new BrowserWindow({
        width: 128,
        height: 72,
        frame: false, // Remove window frame
        webPreferences: {
            nodeIntegration: true
        },
        
    });

    // win.setIgnoreMouseEvents(true);

    // win.setPosition(1400, 930);
    win.setPosition(1238, 980);

    win.loadFile('index.html');

    win.webContents.on('did-finish-load', () => {
        win.webContents.setAudioMuted(true);
    });
}

app.whenReady().then(() => {
    createWindow();

    // Register a 'CommandOrControl+X' shortcut listener.
    // const ret = globalShortcut.register('CommandOrControl+X', () => {
        
    const ret = globalShortcut.register('X', () => {
        try {
            resetWindow();

        }
        catch (error) {}
    })

    // if (!ret) {
    //     console.log('registration failed')
    // }

    // Check whether a shortcut is registered.
    // console.log(globalShortcut.isRegistered('X'))
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

app.on('will-quit', () => {
    // Unregister all shortcuts.
    globalShortcut.unregisterAll()
  })

function resetWindow()
{
    let code = `
    throttle = true;
    document.getElementById('body').style.backgroundColor = '#eeeeee'
    document.getElementById('text').innerHTML = "25";
    document.getElementById('killCounter').innerHTML = 0;
    `;
    win.webContents.executeJavaScript(code);
    killCounter = 0;
}

function startTimer()
{
    let code = `
    new Promise((resolve, reject) => {
        let counter = 24;
        threads = threads + 1;
        throttle = false;

        document.getElementById('text').innerHTML = "25";
        document.getElementById('body').style.backgroundColor = '#eeeeee'

        let changedTime = Date.now();

        const intervalId = setInterval(() => {

            if (throttle)
            {
                document.getElementById('body').style.backgroundColor = '#eeeeee'
                document.getElementById('text').innerHTML = "25";
                document.getElementById('killCounter').innerHTML = 0;
                clearInterval();
                return;
            }

            document.getElementById('body').style.backgroundColor = '#eeeeee'
            if (counter <= 2)
            {
                document.getElementById('body').style.backgroundColor = '#96FF62'
            }
            if (counter === 0 || threads > 1)
            {
                if (threads === 1) document.getElementById('text').innerHTML = '0';
                clearInterval(intervalId);
                threads = threads - 1;

                let detectedLastLineTime = Date.now();
                let difference = detectedLastLineTime - changedTime;
                // console.log("Elapsed: " + difference);
            }
            else
            {
                document.getElementById('text').innerHTML = counter;
                counter = counter - 1;
            }
        }, 1000);
    });
    `;
    win.webContents.executeJavaScript(code);
    
    Resolve();
}

const filePath = "C:\\Program Files (x86)\\Grinding Gear Games\\Path of Exile\\logs\\Client.txt";

let changedTime;
let detectedLastLineTime;

const TEMPLAR = "Cardinal Sanctus Vox";
const MARAKETH = "Aukuna, the Black Sekhema";
const VAAL = "Viper Napuatzi";
const KARUI = "Queen Hyrri Ngamaku";
const ETERNAL = "General Marceus Lioneye";

let killCounter = 0;
const processLatestLine = (line) => {
    let difference = detectedLastLineTime - changedTime;
    // console.log("Elapsed: " + difference);
    
    if (line.indexOf(trackKillsOf) !== -1)
    {
        try {
            startTimer();

        }
        catch (error) {}
    }
    else if (line.indexOf("Timeless Conflict") !== -1)
    {
        killCounter = 0;
        let code = `document.getElementById('killCounter').innerHTML = ${killCounter};`;
        win.webContents.executeJavaScript(code);
    }

    if (line.indexOf(resetOnVoicelineOf) !== -1)
    {
        killCounter++;

        let code = `document.getElementById('killCounter').innerHTML = ${killCounter};`;
        win.webContents.executeJavaScript(code);
    }

    // if (line.indexOf(TEMPLAR) !== -1 || line.indexOf(ETERNAL) !== -1 || line.indexOf(KARUI) !== -1 || line.indexOf(VAAL) !== -1)
    // {
    //     killCounter++;

    //     let code = `document.getElementById('killCounter').innerHTML = ${killCounter};`;
    //     win.webContents.executeJavaScript(code);
    // }

    // if (line.indexOf(MARAKETH) !== -1)
    // {
    //     killCounter++;

    //     let code = `document.getElementById('killCounter').innerHTML = ${killCounter};`;
    //     win.webContents.executeJavaScript(code);
    // }
};

// Listen for changes to the file
fs.watch(filePath, (eventType, filename) => {
if (eventType === 'change') {

    changedTime = Date.now();
    
    const fileStream = fs.createReadStream(filePath);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    let lastLine = '';
    rl.on('line', (line) => {
        lastLine = line;
    });

    rl.on('close', () => {
        detectedLastLineTime = Date.now();
        processLatestLine(lastLine);
    });
}});