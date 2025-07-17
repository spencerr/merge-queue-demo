# GitHub Merge Queue Demo Setup Script (PowerShell)
# This script helps configure branch protection and merge queue settings

param(
    [switch]$SkipTests = $false
)

# Function to write colored output
function Write-Status {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor Blue
}

function Write-Success {
    param([string]$Message)
    Write-Host "[SUCCESS] $Message" -ForegroundColor Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[WARNING] $Message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor Red
}

# Function to check if command exists
function Test-Command {
    param([string]$Command)
    try {
        Get-Command $Command -ErrorAction Stop | Out-Null
        return $true
    }
    catch {
        return $false
    }
}

# Function to check GitHub CLI authentication
function Test-GitHubAuth {
    try {
        gh auth status 2>$null | Out-Null
        return $true
    }
    catch {
        return $false
    }
}

# Function to get repository information
function Get-RepoInfo {
    try {
        $remoteUrl = git remote get-url origin 2>$null
        if ($remoteUrl -match "github\.com[/:]([^/]+/[^/]+)(\.git)?$") {
            return $matches[1] -replace "\.git$", ""
        }
        else {
            throw "Not a GitHub repository"
        }
    }
    catch {
        throw "Not in a git repository or no origin remote found"
    }
}

# Main setup function
function Main {
    Write-Host "🚀 GitHub Merge Queue Demo Setup" -ForegroundColor Cyan
    Write-Host "==================================" -ForegroundColor Cyan
    Write-Host ""

    # Check prerequisites
    Write-Status "Checking prerequisites..."
    
    if (-not (Test-Command "git")) {
        Write-Error "Git is not installed"
        exit 1
    }
    
    if (-not (Test-Command "gh")) {
        Write-Error "GitHub CLI is not installed"
        Write-Status "Please install it from: https://cli.github.com/"
        exit 1
    }
    
    if (-not (Test-Command "node")) {
        Write-Error "Node.js is not installed"
        Write-Status "Please install Node.js 16+ from: https://nodejs.org/"
        exit 1
    }
    
    if (-not (Test-Command "npm")) {
        Write-Error "npm is not installed"
        exit 1
    }
    
    Write-Success "All prerequisites are installed"
    Write-Host ""

    # Check GitHub authentication
    Write-Status "Checking GitHub CLI authentication..."
    if (-not (Test-GitHubAuth)) {
        Write-Error "GitHub CLI is not authenticated"
        Write-Status "Please run: gh auth login"
        exit 1
    }
    Write-Success "GitHub CLI is authenticated"
    Write-Host ""

    # Get repository information
    Write-Status "Getting repository information..."
    try {
        $repo = Get-RepoInfo
        Write-Success "Repository: $repo"
    }
    catch {
        Write-Error $_.Exception.Message
        exit 1
    }
    Write-Host ""

    # Install dependencies
    Write-Status "Installing npm dependencies..."
    try {
        npm install
        Write-Success "Dependencies installed"
    }
    catch {
        Write-Error "Failed to install dependencies"
        exit 1
    }
    Write-Host ""

    # Run tests to verify setup (unless skipped)
    if (-not $SkipTests) {
        Write-Status "Running tests to verify setup..."
        try {
            npm test
            Write-Success "All tests passed"
        }
        catch {
            Write-Error "Tests failed"
            exit 1
        }
        Write-Host ""
    }

    # Check if main branch exists
    Write-Status "Checking main branch..."
    try {
        git show-ref --verify --quiet refs/heads/main 2>$null
    }
    catch {
        Write-Warning "Main branch doesn't exist locally"
        Write-Status "Creating main branch..."
        try {
            git checkout -b main 2>$null
        }
        catch {
            git checkout main 2>$null
        }
    }

    # Configure branch protection
    Write-Status "Configuring branch protection for main branch..."
    try {
        $protectionConfig = @{
            required_status_checks = @{
                strict = $true
                contexts = @("Pull Request CI / pr-summary")
            }
            enforce_admins = $false
            required_pull_request_reviews = @{
                required_approving_review_count = 1
                dismiss_stale_reviews = $true
                require_last_push_approval = $true
            }
            restrictions = $null
            required_conversation_resolution = $true
            required_linear_history = $false
            allow_force_pushes = $false
            allow_deletions = $false
            block_creations = $false
        } | ConvertTo-Json -Depth 10

        # Note: This is a simplified version. Full API configuration would require more complex JSON handling
        Write-Warning "Branch protection configuration via PowerShell is limited"
        Write-Status "Please configure manually in GitHub repository settings"
    }
    catch {
        Write-Warning "Could not configure branch protection via API"
        Write-Status "Please configure manually in GitHub repository settings"
    }
    Write-Host ""

    # Create a sample feature branch for testing
    Write-Status "Creating sample feature branch for testing..."
    $timestamp = [int][double]::Parse((Get-Date -UFormat %s))
    $featureBranch = "feature/test-merge-queue-$timestamp"
    
    try {
        git checkout -b $featureBranch
        
        # Add a simple test file
        $testContent = "// Test file for merge queue demo - $(Get-Date)"
        $testContent | Out-File -FilePath "test-merge-queue.js" -Encoding UTF8
        git add test-merge-queue.js
        git commit -m "Add test file for merge queue demo"
        
        Write-Success "Created feature branch: $featureBranch"
    }
    catch {
        Write-Error "Failed to create feature branch"
        exit 1
    }
    Write-Host ""

    # Push the feature branch
    Write-Status "Pushing feature branch to GitHub..."
    try {
        git push origin $featureBranch
        Write-Success "Feature branch pushed"
    }
    catch {
        Write-Error "Failed to push feature branch"
        exit 1
    }
    Write-Host ""

    # Create a pull request
    Write-Status "Creating pull request..."
    try {
        $prUrl = gh pr create --title "Test Merge Queue Demo" --body "This PR tests the merge queue functionality. It should trigger the Pull Request CI workflow." --base main --head $featureBranch
        Write-Success "Pull request created: $prUrl"
    }
    catch {
        Write-Error "Failed to create pull request"
        exit 1
    }
    Write-Host ""

    # Final instructions
    Write-Host "🎉 Setup Complete!" -ForegroundColor Green
    Write-Host "=================="
    Write-Host ""
    Write-Host "Next steps:"
    Write-Host "1. Go to your repository settings and enable merge queue:"
    Write-Host "   https://github.com/$repo/settings/branches"
    Write-Host ""
    Write-Host "2. Edit the branch protection rule for 'main' and:"
    Write-Host "   - Check 'Require merge queue'"
    Write-Host "   - Add required status checks:"
    Write-Host "     * Pull Request CI / pr-summary"
    Write-Host "     * Merge Group CI / merge-summary"
    Write-Host ""
    Write-Host "3. Test the merge queue with the created PR:"
    Write-Host "   $prUrl"
    Write-Host ""
    Write-Host "4. Once PR checks pass, click 'Merge when ready' to test the queue"
    Write-Host ""
    Write-Host "📚 For detailed configuration instructions, see:"
    Write-Host "   docs/branch-protection-config.md"
    Write-Host ""
    Write-Success "Happy testing! 🚀"
}

# Run main function
try {
    Main
}
catch {
    Write-Error "Setup failed: $($_.Exception.Message)"
    exit 1
}
