const { app, BrowserWindow, globalShortcut } = require('electron');
const fs = require('fs');
const readline = require('readline');

// TRACK KILLS OF:
// const trackKillsOf = "Cardinal Sanctus Vox";
// const trackKillsOf = "Aukuna, the Black Sekhema";
// const trackKillsOf = "Viper Napuatzi";
// const trackKillsOf = "Queen Hyrri Ngamaku";
// const trackKillsOf = "General Marceus Lioneye";

// RESET ON VOICELINE OF:
// const resetOnVoicelineOf = "Cardinal Sanctus Vox";
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
    
    countLinesInitial();
}

app.whenReady().then(() => {
    createWindow();

    // Register a 'CommandOrControl+X' shortcut listener.
    // const ret = globalShortcut.register('CommandOrControl+X', () => {
        
    const ret = globalShortcut.register('Ctrl+X', () => {
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
    document.getElementById('killCounter').innerHTML = 'T: 0';
    document.getElementById('killCounterGeneric').innerHTML = 'All: 0';
    
    document.getElementById('templarBody').style.backgroundColor = '#eeeeee'
    document.getElementById('templarText').innerHTML = "25";
    `;
    win.webContents.executeJavaScript(code);
    killCounter = 0;
    genericKillCounter = 0;
}

function startAukunaTimer()
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
                document.getElementById('killCounter').innerHTML = 'T: 0';
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
        }, 985);
    });
    `;
    win.webContents.executeJavaScript(code);
    
    Resolve();
}

function startVoxTimer()
{
    let code = `
    new Promise((resolve, reject) => {
        let counter = 24;
        templarThreads = templarThreads + 1;
        throttle = false;

        document.getElementById('templarText').innerHTML = "25";
        document.getElementById('templarBody').style.backgroundColor = '#eeeeee'

        let changedTime = Date.now();

        const intervalId = setInterval(() => {

            if (throttle)
            {
                document.getElementById('templarBody').style.backgroundColor = '#eeeeee'
                document.getElementById('templarText').innerHTML = "25";
                document.getElementById('killCounter').innerHTML = 'T: 0';
                clearInterval();
                return;
            }

            document.getElementById('templarBody').style.backgroundColor = '#eeeeee'
            if (counter <= 2)
            {
                document.getElementById('templarBody').style.backgroundColor = '#96FF62'
            }
            if (counter === 0 || templarThreads > 1)
            {
                if (templarThreads === 1) document.getElementById('templarText').innerHTML = '0';
                clearInterval(intervalId);
                templarThreads = templarThreads - 1;

                let detectedLastLineTime = Date.now();
                let difference = detectedLastLineTime - changedTime;
                // console.log("Elapsed: " + difference);
            }
            else
            {
                document.getElementById('templarText').innerHTML = counter;
                counter = counter - 1;
            }
        }, 985);
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
    
    if (line.indexOf(MARAKETH) !== -1)
    {
        try {
            startAukunaTimer();

        }
        catch (error) {}
    }

    if (line.indexOf(ETERNAL) !== -1)
    {
        try {
            updateKillCounter();
            startVoxTimer();


        }
        catch (error) {}
    }

    if (line.indexOf(TEMPLAR) !== -1 || line.indexOf(ETERNAL) !== -1 || line.indexOf(KARUI) !== -1 || line.indexOf(VAAL) !== -1 || line.indexOf(MARAKETH) !== -1)
    {
        updateGenericKillCounter(line);
    }
};

let executingArr = new Array(5).fill(false);
let genericKillCounter = 0;
function updateGenericKillCounter(line)
{
    if (line.indexOf(TEMPLAR) !== -1) {
        if (executingArr[0]) return;
        executingArr[0] = true;
        genericKillCounter++;
        let code = `document.getElementById('killCounterGeneric').innerHTML = 'All: ${genericKillCounter}';`;
        win.webContents.executeJavaScript(code);
        setTimeout(() => {executingArr[0] = false; }, 10000);
    }
    else if (line.indexOf(ETERNAL) !== -1) {
        if (executingArr[1]) return;
        executingArr[1] = true;
        genericKillCounter++;
        let code = `document.getElementById('killCounterGeneric').innerHTML = 'All: ${genericKillCounter}';`;
        win.webContents.executeJavaScript(code);
        setTimeout(() => {executingArr[1] = false; }, 10000);

    }
    else if (line.indexOf(KARUI) !== -1) {
        if (executingArr[2]) return;
        executingArr[2] = true;
        genericKillCounter++;
        let code = `document.getElementById('killCounterGeneric').innerHTML = 'All: ${genericKillCounter}';`;
        win.webContents.executeJavaScript(code);
        setTimeout(() => {executingArr[2] = false; }, 10000);

    }
    else if (line.indexOf(VAAL) !== -1) {
        if (executingArr[3]) return;
        executingArr[3] = true;
        genericKillCounter++;
        let code = `document.getElementById('killCounterGeneric').innerHTML = 'All: ${genericKillCounter}';`;
        win.webContents.executeJavaScript(code);
        setTimeout(() => {executingArr[3] = false; }, 10000);

    }
    else if (line.indexOf(MARAKETH) !== -1) {
        if (executingArr[4]) return;
        executingArr[4] = true;
        genericKillCounter++;
        let code = `document.getElementById('killCounterGeneric').innerHTML = 'All: ${genericKillCounter}';`;
        win.webContents.executeJavaScript(code);
        setTimeout(() => {executingArr[4] = false; }, 20000);

    }
}

let isExecuting = false;
function updateKillCounter()
{
    if (!isExecuting) {
        // Set the flag to indicate that the method is currently being executed
        isExecuting = true;
    
        // Your code block that you want to throttle
        // For example:
        // console.log("Executing...");

        killCounter++;
        let code = `document.getElementById('killCounter').innerHTML = 'T: ${killCounter}';`;
        win.webContents.executeJavaScript(code);
    
        // Reset the flag after 10 seconds
        setTimeout(() => {
          isExecuting = false;
        }, 10000); // 10 seconds in milliseconds
      } else {
        // Method is already executing, throttle the call
        // console.log("Throttling...");
        // Optionally, you can add logic here to handle the throttled call
      }
}

let lineCounterSaved = 0;
let lineCounter = 0;

function countLinesInitial()
{
    // Read the file synchronously
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    // Split the content by newline characters
    const lines = fileContent.split('\n');
    
    // Count the number of lines
    lineCounterSaved = lines.length-1;
}

// Listen for changes to the file
fs.watch(filePath, (eventType, filename) => {
if (eventType === 'change') {
    
    const fileStream = fs.createReadStream(filePath);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    lineCounter = 0;

    rl.on('line', (line) => {
        lineCounter++;

        if (lineCounter > lineCounterSaved)
        {
            processLatestLine(line);
        }
    });

    rl.on('close', () => {
        // detectedLastLineTime = Date.now();
        // processLatestLine(lastLine);

        lineCounterSaved = lineCounter;
    });
}});