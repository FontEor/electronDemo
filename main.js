const { app, BrowserWindow, ipcMain, dialog, Menu } = require("electron/main");
const path = require("node:path");
// require("update-electron-app")();
try {
  require("electron-reloader")(module);
} catch (_) {}

async function handleFileOpen() {
  const { canceled, filePaths } = await dialog.showOpenDialog();
  if (!canceled) {
    return filePaths[0];
  }
}
const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });
  ipcMain.on("set-title", (event, title) => {
    const webContents = event.sender;
    const win = BrowserWindow.fromWebContents(webContents);
    win.setTitle(title);
  });
  const menu = Menu.buildFromTemplate([
    {
      label: app.name,
      submenu: [
        {
          click: () => win.webContents.send("update-counter", 1),
          label: "Increment",
        },
        {
          click: () => win.webContents.send("update-counter", -1),
          label: "Decrement",
        },
      ],
    },
  ]);
  Menu.setApplicationMenu(menu);
  win.loadFile("index.html");
  //   win.loadURL("https://github.com");
  win.webContents.openDevTools();
};

app.whenReady().then(() => {
  ipcMain.handle("dialog:openFile", handleFileOpen);
  ipcMain.handle("ping", () => "pong");
  ipcMain.on("counter-value", (_event, value) => {
    console.log(_event);
    console.log(value); // will print value to Node console
  });
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
