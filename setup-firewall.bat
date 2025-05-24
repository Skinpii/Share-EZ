@echo off
echo Setting up Windows Firewall for File Share App...
echo.

REM Allow Node.js through Windows Firewall
netsh advfirewall firewall add rule name="File Share App - Node.js" dir=in action=allow program="C:\Program Files\nodejs\node.exe" enable=yes
netsh advfirewall firewall add rule name="File Share App - Port 3000" dir=in action=allow protocol=TCP localport=3000

echo.
echo Firewall rules added successfully!
echo Your file sharing app should now be accessible from other devices on your network.
echo.
echo To start your app, run: npm start
echo Then share the network URL shown in the console.
echo.
pause
