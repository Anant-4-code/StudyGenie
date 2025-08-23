# Start-Process with -NoNewWindow to see the output
Write-Host "Starting StudyGenie Server with debug output..." -ForegroundColor Cyan

# Create a timestamp for the log file
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$logFile = "debug_$timestamp.log"

Write-Host "Logging output to $logFile" -ForegroundColor Yellow

# Start the Node.js process with output redirection
$process = Start-Process -FilePath "node.exe" -ArgumentList "debug.js" `
    -NoNewWindow `
    -PassThru `
    -RedirectStandardOutput $logFile `
    -RedirectStandardError "error_$logFile"

# Give it a moment to start
Start-Sleep -Seconds 2

# Check if the process is still running
if (-not $process.HasExited) {
    Write-Host "Server started successfully with PID $($process.Id)" -ForegroundColor Green
    Write-Host "Output is being logged to $logFile" -ForegroundColor Yellow
    
    # Tail the log file
    Get-Content -Path $logFile -Tail 20 -Wait
} else {
    Write-Host "Failed to start server. Check error_$logFile for details." -ForegroundColor Red
    Get-Content -Path "error_$logFile" -Tail 20
}

# Keep the window open
Write-Host "`nPress any key to stop the server..." -ForegroundColor Cyan
$null = $Host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown')

# Stop the server if it's still running
if (-not $process.HasExited) {
    Write-Host "`nStopping server..." -ForegroundColor Yellow
    Stop-Process -Id $process.Id -Force
    Write-Host "Server stopped." -ForegroundColor Green
}

Write-Host "Log files:" -ForegroundColor Cyan
Get-Item -Path $logFile, "error_$logFile" -ErrorAction SilentlyContinue | 
    Select-Object Name, Length, LastWriteTime | Format-Table -AutoSize
