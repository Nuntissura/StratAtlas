Param(
    [Parameter(Mandatory = $true)]
    [string]$ArtifactRoot,

    [Parameter(Mandatory = $true)]
    [string]$ContainerName,

    [Parameter(Mandatory = $true)]
    [string]$DatabaseName,

    [Parameter(Mandatory = $true)]
    [string]$SchemaName,

    [string]$DbUser = "postgres"
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Assert-Condition {
    Param(
        [bool]$Condition,
        [string]$Message
    )

    if (-not $Condition) {
        throw $Message
    }
}

function Invoke-DockerPsql {
    Param(
        [string]$Container,
        [string]$Database,
        [string]$User,
        [string]$Sql
    )

    $output = & docker exec $Container psql -U $User -d $Database -tAc $Sql 2>&1
    $exitCode = $LASTEXITCODE
    if ($exitCode -ne 0) {
        throw "docker exec psql failed for [$Sql]: $($output | Out-String)"
    }

    return ($output | Out-String).Trim()
}

$artifactRootAbs = (Resolve-Path $ArtifactRoot).Path
$quotedSchema = '"' + $SchemaName.Replace('"', '""') + '"'
$requiredProofFiles = @(
    "control_plane_state.json",
    "audit_head.json",
    "audit_log.jsonl",
    "recorder_state.json"
)

foreach ($phase in @("cold", "warm")) {
    $phaseDir = Join-Path $artifactRootAbs $phase
    $reportPath = Join-Path $phaseDir "runtime_smoke_report.json"
    $proofDir = Join-Path $phaseDir "runtime_proof"

    Assert-Condition (Test-Path $reportPath -PathType Leaf) "Missing runtime smoke report for $phase phase: $reportPath"
    Assert-Condition (Test-Path $proofDir -PathType Container) "Missing runtime proof directory for $phase phase: $proofDir"

    $report = Get-Content $reportPath -Raw | ConvertFrom-Json
    $failedAssertions = @($report.assertions | Where-Object { -not $_.passed })
    Assert-Condition ($failedAssertions.Count -eq 0) "$phase runtime report contains failing assertions."

    foreach ($proofFile in $requiredProofFiles) {
        $proofPath = Join-Path $proofDir $proofFile
        Assert-Condition (Test-Path $proofPath -PathType Leaf) "Missing $phase runtime proof file: $proofPath"
    }

    $controlPlaneStatePath = Join-Path $proofDir "control_plane_state.json"
    $controlPlaneState = Get-Content $controlPlaneStatePath -Raw | ConvertFrom-Json
    Assert-Condition ($controlPlaneState.storageBackend -eq "postgresql-postgis") "$phase control-plane proof did not report PostgreSQL/PostGIS storage."
    Assert-Condition ($controlPlaneState.contextStoreBackend -eq "postgresql-indexed") "$phase control-plane proof did not report PostgreSQL-backed context storage."
    Assert-Condition (@($controlPlaneState.deploymentProfiles).Count -ge 3) "$phase control-plane proof did not include governed deployment profiles."
    Assert-Condition (@($controlPlaneState.bundleRegistry).Count -ge 1) "$phase control-plane proof did not include bundle registry entries."

    $auditLogPath = Join-Path $proofDir "audit_log.jsonl"
    $auditLines = @(
        Get-Content $auditLogPath | Where-Object { $_.Trim().Length -gt 0 }
    )
    Assert-Condition ($auditLines.Count -ge 1) "$phase runtime proof audit log was empty."
}

$postgisExtension = Invoke-DockerPsql -Container $ContainerName -Database $DatabaseName -User $DbUser -Sql "SELECT extname FROM pg_extension WHERE extname = 'postgis';"
Assert-Condition ($postgisExtension -eq "postgis") "PostGIS extension was not present in the verification database."

$tableOutput = Invoke-DockerPsql -Container $ContainerName -Database $DatabaseName -User $DbUser -Sql "SELECT table_name FROM information_schema.tables WHERE table_schema = '$SchemaName' ORDER BY table_name;"
$discoveredTables = @(
    $tableOutput -split "`r?`n" | ForEach-Object { $_.Trim() } | Where-Object { $_ }
)
$requiredTables = @(
    "aoi_registry",
    "audit_events",
    "audit_head",
    "bundle_registry",
    "context_domains",
    "context_records",
    "control_plane_state",
    "correlation_links",
    "deployment_profiles",
    "recorder_state"
)
foreach ($requiredTable in $requiredTables) {
    Assert-Condition ($discoveredTables -contains $requiredTable) "Required control-plane table missing from schema ${SchemaName}: $requiredTable"
}

$deploymentProfileCount = [int](Invoke-DockerPsql -Container $ContainerName -Database $DatabaseName -User $DbUser -Sql "SELECT COUNT(*) FROM ${quotedSchema}.deployment_profiles;")
$bundleRegistryCount = [int](Invoke-DockerPsql -Container $ContainerName -Database $DatabaseName -User $DbUser -Sql "SELECT COUNT(*) FROM ${quotedSchema}.bundle_registry;")
$auditEventCount = [int](Invoke-DockerPsql -Container $ContainerName -Database $DatabaseName -User $DbUser -Sql "SELECT COUNT(*) FROM ${quotedSchema}.audit_events;")
$recorderStateCount = [int](Invoke-DockerPsql -Container $ContainerName -Database $DatabaseName -User $DbUser -Sql "SELECT COUNT(*) FROM ${quotedSchema}.recorder_state;")
$aoiCount = [int](Invoke-DockerPsql -Container $ContainerName -Database $DatabaseName -User $DbUser -Sql "SELECT COUNT(*) FROM ${quotedSchema}.aoi_registry;")

Assert-Condition ($deploymentProfileCount -ge 3) "Governed deployment profiles were not persisted to schema $SchemaName."
Assert-Condition ($bundleRegistryCount -ge 1) "Bundle registry was empty in schema $SchemaName."
Assert-Condition ($auditEventCount -ge 1) "Audit event ledger was empty in schema $SchemaName."
Assert-Condition ($recorderStateCount -ge 1) "Recorder state mirror was empty in schema $SchemaName."
Assert-Condition ($aoiCount -ge 1) "AOI registry did not receive any PostGIS-backed geometry rows."

Write-Host "WP-I0-003 runtime proof validation passed."
Write-Host "Artifact Root: $ArtifactRoot"
Write-Host "Schema Name: $SchemaName"
