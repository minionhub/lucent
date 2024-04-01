// main.js
const {
  app,
  BrowserWindow,
  ipcMain
} = require('electron');
import {
  usb,
  getDeviceList,
  webusb
} from 'usb';
const fs = require('fs');
const path = require('path');
const os = require('os');
import {
  resolveHtmlPath
} from './util';
import MenuBuilder from './menu';
import {
  fetchMessages, fetchCalls
} from './database'

// Global reference to the main window to prevent garbage collection
let mainWindow;

let messageLogPath;
let callLogPath;

// Define a global object to keep track of downloads
global.downloads = {};


// Function to create the main application window
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 1000,
    minWidth: 360, // Set minimum width
    minHeight: 640, // Set minimum height
    webPreferences: {
      preload: app.isPackaged ?
        path.join(__dirname, 'preload.js') : path.join(__dirname, '../../.erb/dll/preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  mainWindow.loadURL(resolveHtmlPath('index.html'));


  mainWindow.on('closed', function () {
    mainWindow = null;
  })
}

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  // If we don't get the lock, terminate the new instance
  app.quit();
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    // Someone tried to run a second instance, we should focus our window.
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  // Event handling when the application is ready
  app.whenReady().then(() => {
    createWindow();
  });
}

ipcMain.handle('fetch-messages', async (event) => {
  try {
    const messages = await fetchMessages(messageLogPath);
    messages.forEach(message => {
      const messageDate = convertAppleTimestampToDate(message.date);
      message.stringDate = messageDate;
      const phoneNumber = message.account.replace(/[^+]*\+/, '+');
      message.account = phoneNumber;
    })
    console.log("messages:", messages); // Log the processed calls
    return messages;
  } catch (error) {
    console.error('Failed to fetch messages:', error);
    return []; // Return an empty array or handle the error as needed
  }
});

ipcMain.handle('fetch-calls', async (event) => {
  try {
    const calls = await fetchCalls(callLogPath); // Await the resolution of fetchCalls
    
    // Once fetchCalls resolves, proceed to process the calls
    calls.forEach(call => {
      const stringAddress = call.ZADDRESS.toString('utf8');
      call.stringAddress = stringAddress; // Add the string representation of ZADDRESS
      call.stringDate = convertAppleTimestampToDate(call.ZDATE);
    });

    console.log("calls:", calls); // Log the processed calls
    return calls; // Now correctly returning the processed calls after they're updated
  } catch (error) {
    console.error('Failed to fetch calls:', error);
    return []; // Return an empty array or handle the error as needed
  }
});

function convertAppleTimestampToDate(secondsSinceReference) {
  // Reference date for iOS (January 1, 2001, UTC)
  const referenceDate = new Date(Date.UTC(2001, 0, 1, 0, 0, 0));
  
  // Convert seconds to milliseconds and add to the reference date
  const dateTime = new Date(referenceDate.getTime() + secondsSinceReference * 1000);
  
  // Return as ISO string or customize as needed
  return dateTime.toISOString();
}


// Helper functions

function findLatestFile(startPath, filter, callback) {
  let latestFile = {
    path: null,
    mtime: 0
  };

  function searchDirectory(directory) {
    const files = fs.readdirSync(directory);

    files.forEach((file) => {
      const filePath = path.join(directory, file);
      const stat = fs.lstatSync(filePath);

      if (stat.isDirectory()) {
        searchDirectory(filePath);
      } else if (filePath.endsWith(filter) && stat.mtimeMs > latestFile.mtime) {
        latestFile = {
          path: filePath,
          mtime: stat.mtimeMs
        };
      }
    });
  }

  searchDirectory(startPath);

  if (latestFile.path) {
    callback(latestFile.path);
  }
}

function getBackupDirectory() {
  switch (os.platform()) {
    case 'darwin': // macOS
      return path.join(os.homedir(), 'Library', 'Application Support', 'MobileSync', 'Backup');
    case 'win32': // Windows
      return path.join(os.homedir(), 'AppData', 'Roaming', 'Apple Computer', 'MobileSync', 'Backup');
    default:
      console.error('Unsupported platform');
      return null;
  }
}

const backupDir = getBackupDirectory();
if (backupDir) {
  findLatestFile(backupDir, '3d0d7e5fb2ce288813306e4d4636395e047a3d28', (latestFilePath) => {
    messageLogPath = latestFilePath;
    console.log('messageLogPath:', messageLogPath);
  });
  findLatestFile(backupDir, '5a4935c78a5255723f707230a451d79c540d2741', (latestFilePath) => {
    callLogPath = latestFilePath;
    console.log('callLogPath:', callLogPath);
  });
} else {
  console.log('Backup directory not found.');
}
(async () => {
  // Returns first matching device
  const findAppleDevices = () => {
    // Get the list of USB devices connected to the system.
    const devices = usb.getDeviceList();

    // Filter devices to find ones with the vendorId corresponding to Apple (0x05ac).
    const appleDevices = devices.filter(device => device.deviceDescriptor.idVendor === 0x05ac);

    return appleDevices;
  };

  // Find Apple devices immediately
  const appleDevices = findAppleDevices();
  console.log('Apple devices:', appleDevices);
})();