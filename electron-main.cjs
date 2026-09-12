const { app, BrowserWindow, shell } = require('electron');
const path = require('path');
function createWindow(){
 const win = new BrowserWindow({width:1280,height:800,minWidth:900,minHeight:620,backgroundColor:'#060711',title:'MYRAA',webPreferences:{contextIsolation:true,nodeIntegration:false}});
 win.loadFile(path.join(__dirname,'dist','index.html'));
 win.webContents.setWindowOpenHandler(({url})=>{shell.openExternal(url);return {action:'deny'};});
}
app.whenReady().then(createWindow);app.on('window-all-closed',()=>{if(process.platform!=='darwin')app.quit()});
