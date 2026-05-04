$file = Join-Path $PSScriptRoot "styles.css"
$lines = [System.IO.File]::ReadAllLines($file)

# Find line that says "    .hero h1 {" followed by the font-size line and closing brace
# This is in the 768px media query, around line 3322
# After the closing "}" of .hero h1 block, we need to insert the full set of rules
# and then skip the corrupted lines until we hit .values-header

$insertAfterIdx = -1
$skipUntilIdx = -1

for ($i = 0; $i -lt $lines.Length; $i++) {
    $trimmed = $lines[$i].Trim()
    # Find the ".hero h1 {" inside the 768px media query (indented with 4 spaces)
    if ($trimmed -eq ".hero h1 {" -and $i -gt 3300) {
        # The closing brace should be 2 lines later
        for ($j = $i + 1; $j -lt $i + 5; $j++) {
            if ($lines[$j].Trim() -eq "}") {
                $insertAfterIdx = $j
                break
            }
        }
    }
    
    # Find .values-header which is the first clean line after the corrupted area
    if ($trimmed -eq ".values-header {" -and $i -gt 3300) {
        $skipUntilIdx = $i
        break
    }
}

if ($insertAfterIdx -eq -1 -or $skipUntilIdx -eq -1) {
    Write-Host "ERROR: Could not find insertion point ($insertAfterIdx) or skip point ($skipUntilIdx)"
    exit 1
}

Write-Host "Insert after line $($insertAfterIdx + 1), skip corrupted lines until line $($skipUntilIdx + 1)"

$newBlock = @"

    .hero-content {
        text-align: center;
        max-width: 100%;
        margin-top: 0;
        margin-bottom: 20px;
    }

    .hero-actions {
        flex-direction: row;
        justify-content: center;
        margin-bottom: 40px;
    }

    .hero-actions .btn {
        padding: 11px 24px;
        font-size: 0.95rem;
        min-width: 0;
    }

    .hero-bottom {
        display: contents;
    }

    .hero-proof {
        flex-direction: column;
        align-items: center;
        text-align: center;
        gap: 12px;
        width: 100%;
    }

    .proof-text {
        text-align: center;
    }

    .avatar-group {
        justify-content: center;
    }

    .hero-eyebrow {
        font-size: 0.7rem;
        padding: 6px 14px;
        margin-bottom: 18px;
    }

    .proof-number {
        font-size: clamp(2.25rem, 8vw, 3rem);
    }

    .avatar {
        width: 48px;
        height: 48px;
        border-width: 2px;
        margin-left: -10px;
    }

    .partner-logos {
        gap: 16px;
    }

    .events-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 20px;
    }

    .carousel-nav {
        align-self: flex-end;
    }

    .store-explode-section {
        height: auto;
        padding: 40px 0;
    }

    .store-explode-sticky {
        position: relative;
        height: auto;
        padding: 0 16px;
    }

    .store-explode-stage {
        height: auto;
        padding: 56px 24px;
        border-radius: var(--radius-xl);
        max-width: 100%;
        overflow: hidden;
    }

    .orbit-model {
        display: none;
    }

    .orbit-fallback {
        display: block;
    }

    .bento-grid {
        grid-template-columns: repeat(2, 1fr);
        grid-template-rows: auto;
    }

    .bento-a,
    .bento-b,
    .bento-c,
    .bento-d,
    .bento-e,
    .bento-f,
    .bento-g,
    .bento-h {
        grid-column: span 1;
        grid-row: span 1;
        height: 180px;
    }

    .home-footer {
        padding: 56px 0 24px;
    }

    .home-footer-grid {
        grid-template-columns: 1fr;
        gap: 40px;
    }

    .footer-col-brand {
        grid-column: span 1;
    }

    .home-footer-bottom {
        text-align: left;
    }

    .footer-container {
        padding: 0 28px 24px;
        border-radius: 40px 40px var(--radius-xl) var(--radius-xl);
    }

    .footer-cta {
        padding: 48px 16px 40px;
    }

    .footer-top {
        flex-direction: column;
        gap: 40px;
    }

    .footer-links-grid {
        gap: 40px;
    }
}

/* =========================================
   Responsive: 480px
   ========================================= */
@media (max-width: 480px) {
    .hero {
        padding: 0;
    }

    .hero-inner {
        padding: 100px 16px 190px;
    }

    .main-content {
        margin-top: 100vh;
        border-radius: 24px 24px 0 0;
    }

    .hero-actions {
        flex-direction: row;
        justify-content: center;
        width: 100%;
    }

    .hero-actions .btn {
        width: auto;
        padding: 10px 18px;
        font-size: 0.88rem;
    }

    .hero-proof {
        gap: 14px;
    }

    .proof-number {
        font-size: clamp(2rem, 7vw, 2.75rem);
    }

    .avatar {
        width: 42px;
        height: 42px;
        margin-left: -8px;
    }

    .avatar-more {
        font-size: 1.1rem;
    }

    .intro-heading {
        font-size: 1.25rem;
    }

    .event-card {
        width: 260px;
    }

    .newsletter-form {
        flex-direction: column;
        padding: 12px;
        border-radius: var(--radius-md);
    }

    .newsletter-form input {
        padding: 8px 12px;
    }

    .newsletter-form button {
        width: 100%;
        padding: 12px;
    }

    .footer-links-grid {
        flex-direction: column;
        gap: 32px;
    }
}

/* =========================================
   VALUES SECTION
   Data-driven · Hover lift · Icon bounce · Stagger reveal
   ========================================= */
.values-section {
    padding: var(--section-pad) 0;
    background: var(--bg-warm);
    position: relative;
    overflow: hidden;
}

.values-section::before {
    content: "";
    position: absolute;
    inset: 0;
    background-image:
        radial-gradient(circle at 15% 20%, rgba(0, 102, 255, 0.04) 0, transparent 40%),
        radial-gradient(circle at 85% 80%, rgba(0, 102, 255, 0.04) 0, transparent 40%);
    pointer-events: none;
}
"@

$newLines = $newBlock -split "`n"

# Build the output: lines before insert point + new block + lines from .values-header onwards
$output = New-Object System.Collections.Generic.List[string]

# Add lines up to and including the .hero h1 closing brace
for ($i = 0; $i -le $insertAfterIdx; $i++) {
    $output.Add($lines[$i])
}

# Add the new block
foreach ($line in $newLines) {
    $output.Add($line.TrimEnd("`r"))
}

# Skip corrupted lines and continue from .values-header
for ($i = $skipUntilIdx; $i -lt $lines.Length; $i++) {
    $output.Add($lines[$i])
}

[System.IO.File]::WriteAllLines($file, $output.ToArray())
Write-Host "SUCCESS: Wrote $($output.Count) lines (was $($lines.Length) lines)"
