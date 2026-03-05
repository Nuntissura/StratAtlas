Param(
    [string]$CodeRoot = ".product/Worktrees/wt_main",
    [string]$OutputJsonPath = ""
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$scriptDirectory = Split-Path -Parent $MyInvocation.MyCommand.Path
$repoRoot = Resolve-Path (Join-Path $scriptDirectory "..\..")
$codeRootAbs = Join-Path $repoRoot $CodeRoot

if (-not (Test-Path $codeRootAbs -PathType Container)) {
    throw "Code root not found: $codeRootAbs"
}

$sourceFolders = @(
    (Join-Path $codeRootAbs "src"),
    (Join-Path $codeRootAbs "src-tauri/src")
) | Where-Object { Test-Path $_ -PathType Container }

$forbiddenPatterns = @(
    [PSCustomObject]@{ Id = "RT-001"; Regex = "(?i)alert\s+when\s+asset"; Reason = "Entity pursuit alert workflow language is forbidden." },
    [PSCustomObject]@{ Id = "RT-002"; Regex = "(?i)covert\s+affiliation"; Reason = "Covert affiliation inference language is forbidden." },
    [PSCustomObject]@{ Id = "RT-003"; Regex = "(?i)scrap(e|ing).{0,30}social\s+media"; Reason = "Social-media scraping workflow language is forbidden." },
    [PSCustomObject]@{ Id = "RT-004"; Regex = "(?i)(trading\s+signal|portfolio\s+optimizer|market\s+prediction)"; Reason = "Financial trading/prediction workflow language is forbidden." },
    [PSCustomObject]@{ Id = "RT-005"; Regex = "(?i)\b(stalk(ing)?|track\s+individual)\b"; Reason = "Individual targeting/stalking language is forbidden." }
)

$violations = New-Object System.Collections.Generic.List[object]

foreach ($folder in $sourceFolders) {
    $files = Get-ChildItem -Path $folder -Recurse -File -Include *.ts,*.tsx,*.js,*.jsx,*.rs |
        Where-Object {
            $_.Name -notlike "*.test.*" -and
            $_.Name -notlike "*.spec.*" -and
            $_.FullName -notmatch "\\__tests__\\"
        }

    foreach ($file in $files) {
        $content = Get-Content -Raw $file.FullName
        foreach ($pattern in $forbiddenPatterns) {
            $matches = [regex]::Matches($content, $pattern.Regex)
            foreach ($match in $matches) {
                $relative = $file.FullName.Substring($repoRoot.Path.Length + 1).Replace("\", "/")
                $violations.Add([PSCustomObject]@{
                    RuleId   = $pattern.Id
                    File     = $relative
                    Snippet  = $match.Value
                    Reason   = $pattern.Reason
                }) | Out-Null
            }
        }
    }
}

$requiredGuardrailTests = @(
    ".product/Worktrees/wt_main/src/features/i6/i6.test.ts",
    ".product/Worktrees/wt_main/src/features/i9/i9.test.ts",
    ".product/Worktrees/wt_main/src/features/i10/i10.test.ts"
)

$missingTests = New-Object System.Collections.Generic.List[string]
foreach ($testPath in $requiredGuardrailTests) {
    if (-not (Test-Path (Join-Path $repoRoot $testPath) -PathType Leaf)) {
        $missingTests.Add($testPath) | Out-Null
    }
}

$passed = ($violations.Count -eq 0) -and ($missingTests.Count -eq 0)
$missingTestsArray = @($missingTests | ForEach-Object { $_ })
$violationsArray = @($violations | ForEach-Object { $_ })

$result = [PSCustomObject]@{
    TimestampUtc         = (Get-Date).ToUniversalTime().ToString("o")
    CodeRoot             = $CodeRoot.Replace("\", "/")
    Passed               = $passed
    ViolationCount       = $violations.Count
    MissingGuardrailTest = $missingTestsArray
    Violations           = $violationsArray
}

if (-not [string]::IsNullOrWhiteSpace($OutputJsonPath)) {
    $outputAbs = Join-Path $repoRoot $OutputJsonPath
    $outputDir = Split-Path -Parent $outputAbs
    if (-not (Test-Path $outputDir -PathType Container)) {
        New-Item -Path $outputDir -ItemType Directory -Force | Out-Null
    }
    $result | ConvertTo-Json -Depth 8 | Set-Content -Path $outputAbs -Encoding UTF8
}

if (-not $passed) {
    Write-Host "Red-team guardrail check failed."
    if ($violations.Count -gt 0) {
        Write-Host "Forbidden pattern matches:"
        foreach ($v in $violations) {
            Write-Host " - [$($v.RuleId)] $($v.File): '$($v.Snippet)' ($($v.Reason))"
        }
    }
    if ($missingTests.Count -gt 0) {
        Write-Host "Missing required guardrail test files:"
        foreach ($m in $missingTests) {
            Write-Host " - $m"
        }
    }
    exit 1
}

Write-Host "Red-team guardrail check passed."
exit 0
