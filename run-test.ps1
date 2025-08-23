# Run the test script and capture output
$outputFile = "test-script-output-$(Get-Date -Format 'yyyyMMdd_HHmmss').log"
$testScript = ".\test-output.js"

Write-Host "Running test script: $testScript" -ForegroundColor Cyan
Write-Host "Output will be saved to: $outputFile" -ForegroundColor Yellow

# Run the script and capture all output
$output = @"
=== Test Script Execution ===
Start Time: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')
Current Directory: $(Get-Location)
Node.js Version: $(node -v)

"@

# Run the script and capture output
$scriptOutput = node $testScript 2>&1 | Out-String
$output += $scriptOutput

# Add timestamp
$output += "`nEnd Time: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"

# Save to file
$output | Out-File -FilePath $outputFile -Encoding utf8

# Show the output
Write-Host "`n=== Script Output ===" -ForegroundColor Green
$scriptOutput
Write-Host "`nOutput saved to: $outputFile" -ForegroundColor Cyan
