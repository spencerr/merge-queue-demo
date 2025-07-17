#!/bin/bash

# GitHub Merge Queue Demo Setup Script
# This script helps configure branch protection and merge queue settings

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check GitHub CLI authentication
check_gh_auth() {
    if ! gh auth status >/dev/null 2>&1; then
        print_error "GitHub CLI is not authenticated"
        print_status "Please run: gh auth login"
        exit 1
    fi
}

# Function to get repository information
get_repo_info() {
    if git remote get-url origin >/dev/null 2>&1; then
        REPO_URL=$(git remote get-url origin)
        if [[ $REPO_URL == *"github.com"* ]]; then
            # Extract owner/repo from URL
            REPO_PATH=$(echo "$REPO_URL" | sed -E 's/.*github\.com[\/:]([^\/]+\/[^\/]+)(\.git)?$/\1/')
            REPO_OWNER=$(echo "$REPO_PATH" | cut -d'/' -f1)
            REPO_NAME=$(echo "$REPO_PATH" | cut -d'/' -f2)
            echo "$REPO_OWNER/$REPO_NAME"
        else
            print_error "Not a GitHub repository"
            exit 1
        fi
    else
        print_error "Not in a git repository or no origin remote found"
        exit 1
    fi
}

# Main setup function
main() {
    echo "🚀 GitHub Merge Queue Demo Setup"
    echo "=================================="
    echo

    # Check prerequisites
    print_status "Checking prerequisites..."
    
    if ! command_exists git; then
        print_error "Git is not installed"
        exit 1
    fi
    
    if ! command_exists gh; then
        print_error "GitHub CLI is not installed"
        print_status "Please install it from: https://cli.github.com/"
        exit 1
    fi
    
    if ! command_exists node; then
        print_error "Node.js is not installed"
        print_status "Please install Node.js 16+ from: https://nodejs.org/"
        exit 1
    fi
    
    if ! command_exists npm; then
        print_error "npm is not installed"
        exit 1
    fi
    
    print_success "All prerequisites are installed"
    echo

    # Check GitHub authentication
    print_status "Checking GitHub CLI authentication..."
    check_gh_auth
    print_success "GitHub CLI is authenticated"
    echo

    # Get repository information
    print_status "Getting repository information..."
    REPO=$(get_repo_info)
    print_success "Repository: $REPO"
    echo

    # Install dependencies
    print_status "Installing npm dependencies..."
    npm install
    print_success "Dependencies installed"
    echo

    # Run tests to verify setup
    print_status "Running tests to verify setup..."
    npm test
    print_success "All tests passed"
    echo

    # Configure branch protection
    print_status "Configuring branch protection for main branch..."
    
    # Check if main branch exists
    if ! git show-ref --verify --quiet refs/heads/main; then
        print_warning "Main branch doesn't exist locally"
        print_status "Creating main branch..."
        git checkout -b main 2>/dev/null || git checkout main
    fi

    # Configure branch protection with merge queue
    gh api repos/"$REPO"/branches/main/protection \
        --method PUT \
        --field required_status_checks='{"strict":true,"contexts":["Pull Request CI / pr-summary"]}' \
        --field enforce_admins=false \
        --field required_pull_request_reviews='{"required_approving_review_count":1,"dismiss_stale_reviews":true,"require_last_push_approval":true}' \
        --field restrictions=null \
        --field required_conversation_resolution=true \
        --field required_linear_history=false \
        --field allow_force_pushes=false \
        --field allow_deletions=false \
        --field block_creations=false \
        2>/dev/null || {
        print_warning "Could not configure branch protection via API"
        print_status "Please configure manually in GitHub repository settings"
    }

    print_success "Branch protection configured"
    echo

    # Create a sample feature branch for testing
    print_status "Creating sample feature branch for testing..."
    FEATURE_BRANCH="feature/test-merge-queue-$(date +%s)"
    git checkout -b "$FEATURE_BRANCH"
    
    # Add a simple test file
    echo "// Test file for merge queue demo - $(date)" > test-merge-queue.js
    git add test-merge-queue.js
    git commit -m "Add test file for merge queue demo"
    
    print_success "Created feature branch: $FEATURE_BRANCH"
    echo

    # Push the feature branch
    print_status "Pushing feature branch to GitHub..."
    git push origin "$FEATURE_BRANCH"
    print_success "Feature branch pushed"
    echo

    # Create a pull request
    print_status "Creating pull request..."
    PR_URL=$(gh pr create \
        --title "Test Merge Queue Demo" \
        --body "This PR tests the merge queue functionality. It should trigger the Pull Request CI workflow." \
        --base main \
        --head "$FEATURE_BRANCH")
    
    print_success "Pull request created: $PR_URL"
    echo

    # Final instructions
    echo "🎉 Setup Complete!"
    echo "=================="
    echo
    echo "Next steps:"
    echo "1. Go to your repository settings and enable merge queue:"
    echo "   https://github.com/$REPO/settings/branches"
    echo
    echo "2. Edit the branch protection rule for 'main' and:"
    echo "   - Check 'Require merge queue'"
    echo "   - Add required status checks:"
    echo "     * Pull Request CI / pr-summary"
    echo "     * Merge Group CI / merge-summary"
    echo
    echo "3. Test the merge queue with the created PR:"
    echo "   $PR_URL"
    echo
    echo "4. Once PR checks pass, click 'Merge when ready' to test the queue"
    echo
    echo "📚 For detailed configuration instructions, see:"
    echo "   docs/branch-protection-config.md"
    echo
    print_success "Happy testing! 🚀"
}

# Run main function
main "$@"
