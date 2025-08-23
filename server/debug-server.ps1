# Debug Server Script
Write-Host "=== StudyGenie Server Debug ===" -ForegroundColor Cyan
Write-Host "Gathering system information..."

# System Information
Write-Host "`n[System Information]" -ForegroundColor Green
$os = Get-WmiObject -Class Win32_OperatingSystem
$cpu = Get-WmiObject -Class Win32_Processor | Select-Object -First 1
$ram = [math]::Round((Get-WmiObject -Class Win32_ComputerSystem).TotalPhysicalMemory / 1GB, 2)

Write-Host "OS: $($os.Caption) ($($os.OSArchitecture))"
Write-Host "CPU: $($cpu.Name)"
Write-Host "RAM: $ram GB"
Write-Host "Node.js: $(node -v)"
Write-Host "npm: $(npm -v)"

# Check port 5001
Write-Host "`n[Port 5001 Status]" -ForegroundColor Green
$portInUse = Test-NetConnection -ComputerName localhost -Port 5001 -InformationLevel Quiet
if ($portInUse) {
    Write-Host "Port 5001 is in use by the following process:" -ForegroundColor Yellow
    Get-NetTCPConnection -LocalPort 5001 -ErrorAction SilentlyContinue | 
        Select-Object OwningProcess, @{Name="ProcessName";Expression={(Get-Process -Id $_.OwningProcess).ProcessName}} | 
        Format-Table -AutoSize
} else {
    Write-Host "Port 5001 is available" -ForegroundColor Green
}

# Check Node.js processes
Write-Host "`n[Node.js Processes]" -ForegroundColor Green
Get-Process -Name "node" -ErrorAction SilentlyContinue | 
    Select-Object Id, ProcessName, Path | 
    Format-Table -AutoSize

# Start the server with detailed logging
Write-Host "`n[Starting Server]" -ForegroundColor Green
$env:NODE_OPTIONS = "--trace-warnings"
$env:DEBUG = "*"

# Create a log file with timestamp
$logFile = "server-debug-$((Get-Date).ToString('yyyyMMdd-HHmmss')).log"
Write-Host "Logging to: $logFile"

# Start the server in a new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "node index.js 2>&1 | Tee-Object -FilePath $logFile"

Write-Host "`nServer started in a new window. Check the log file for details." -ForegroundColor Cyan
