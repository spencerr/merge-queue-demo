# Branch Protection and Merge Queue Configuration

This document provides step-by-step instructions and example configurations for setting up branch protection rules and merge queue settings for the merge queue demo.

## 📋 Table of Contents

- [Branch Protection Rules](#branch-protection-rules)
- [Merge Queue Configuration](#merge-queue-configuration)
- [Required Status Checks](#required-status-checks)
- [API Configuration](#api-configuration)
- [Troubleshooting](#troubleshooting)

## 🛡️ Branch Protection Rules

### Step 1: Navigate to Branch Protection Settings

1. Go to your repository on GitHub
2. Click **Settings** tab
3. Click **Branches** in the left sidebar
4. Click **Add rule** or edit existing rule for `main` branch

### Step 2: Basic Protection Settings

Configure the following settings:

#### Branch Name Pattern
```
main
```

#### Protect Matching Branches
- ✅ **Require a pull request before merging**
  - ✅ Require approvals: `1`
  - ✅ Dismiss stale PR approvals when new commits are pushed
  - ✅ Require review from code owners (if CODEOWNERS file exists)
  - ✅ Restrict pushes that create files that change the code owner approval requirements
  - ✅ Require approval of the most recent reviewable push

#### Status Checks
- ✅ **Require status checks to pass before merging**
  - ✅ Require branches to be up to date before merging
  - **Required status checks:**
    - `Pull Request CI / pr-summary`
    - `Pull Request CI / lint`
    - `Pull Request CI / build`
    - `Pull Request CI / test-unit`
    - `Pull Request CI / test-integration`
    - `Pull Request CI / security`

#### Additional Restrictions
- ✅ **Require conversation resolution before merging**
- ✅ **Require signed commits** (optional, for enhanced security)
- ✅ **Require linear history** (optional, for clean git history)
- ✅ **Require merge queue** (this enables the merge queue feature)

#### Administrative Settings
- ✅ **Include administrators** (applies rules to repository administrators)
- ✅ **Restrict pushes that create files that change the code owner approval requirements**
- ✅ **Allow force pushes** → **Everyone** (set to disabled for production)
- ✅ **Allow deletions** (set to disabled for production)

## 🔄 Merge Queue Configuration

### Step 3: Configure Merge Queue Settings

When you enable "Require merge queue" in branch protection, additional settings become available:

#### Merge Method
Choose one of:
- **Merge commit** (recommended for this demo)
- **Squash and merge**
- **Rebase and merge**

#### Queue Settings
- **Maximum number of pull requests to build**: `5`
  - This determines how many PRs can be in the queue simultaneously
  - Higher numbers = more parallel processing but more resource usage
  
- **Minimum number of pull requests to merge**: `1`
  - PRs will be merged individually as they pass validation
  - Set to higher numbers to batch merges together

- **Maximum time a pull request can stay in the queue**: `60 minutes`
  - PRs that take longer than this will be removed from the queue
  - Adjust based on your CI/CD pipeline duration

#### Merge Queue Status Checks
The merge queue will run these required checks:
- `Merge Group CI / merge-summary`
- `Merge Group CI / quick-checks`
- `Merge Group CI / build-verification`
- `Merge Group CI / comprehensive-tests`
- `Merge Group CI / security-compliance`
- `Merge Group CI / performance-validation`
- `Merge Group CI / merge-validation`

## ✅ Required Status Checks

### Pull Request Status Checks

Add these status checks to the branch protection rule:

```
Pull Request CI / lint
Pull Request CI / build  
Pull Request CI / test-unit
Pull Request CI / test-integration
Pull Request CI / security
Pull Request CI / pr-summary
```

### Merge Group Status Checks

These are automatically required when merge queue is enabled:

```
Merge Group CI / quick-checks
Merge Group CI / build-verification
Merge Group CI / comprehensive-tests
Merge Group CI / security-compliance
Merge Group CI / performance-validation
Merge Group CI / merge-validation
Merge Group CI / merge-summary
```

## 🔧 API Configuration

### Using GitHub CLI

You can also configure branch protection using the GitHub CLI:

```bash
# Install GitHub CLI if not already installed
# https://cli.github.com/

# Configure branch protection with merge queue
gh api repos/:owner/:repo/branches/main/protection \
  --method PUT \
  --field required_status_checks='{"strict":true,"contexts":["Pull Request CI / pr-summary","Merge Group CI / merge-summary"]}' \
  --field enforce_admins=true \
  --field required_pull_request_reviews='{"required_approving_review_count":1,"dismiss_stale_reviews":true}' \
  --field restrictions=null \
  --field required_conversation_resolution=true \
  --field required_linear_history=false \
  --field allow_force_pushes=false \
  --field allow_deletions=false \
  --field block_creations=false \
  --field required_merge_queue=true
```

### Using REST API

Example configuration using GitHub's REST API:

```json
{
  "required_status_checks": {
    "strict": true,
    "contexts": [
      "Pull Request CI / pr-summary",
      "Merge Group CI / merge-summary"
    ]
  },
  "enforce_admins": true,
  "required_pull_request_reviews": {
    "required_approving_review_count": 1,
    "dismiss_stale_reviews": true,
    "require_code_owner_reviews": false,
    "require_last_push_approval": true
  },
  "restrictions": null,
  "required_conversation_resolution": true,
  "required_linear_history": false,
  "allow_force_pushes": false,
  "allow_deletions": false,
  "block_creations": false,
  "required_merge_queue": true,
  "merge_queue_config": {
    "maximum_entries_to_build": 5,
    "minimum_entries_to_merge": 1,
    "maximum_time_in_queue": 3600
  }
}
```

## 🔍 Troubleshooting

### Common Issues and Solutions

#### 1. Status Checks Not Appearing
**Problem**: Required status checks don't appear in the dropdown

**Solution**: 
- Ensure workflows have run at least once on a PR
- Check workflow names and job names match exactly
- Verify workflows are in `.github/workflows/` directory

#### 2. Merge Queue Not Working
**Problem**: "Merge when ready" button doesn't appear

**Solution**:
- Verify "Require merge queue" is enabled in branch protection
- Ensure all required status checks are passing
- Check that PR has required approvals

#### 3. Workflows Failing in Merge Queue
**Problem**: Workflows pass on PR but fail in merge queue

**Solution**:
- Check merge group workflow uses correct checkout reference
- Verify environment variables and secrets are available
- Ensure merge group has access to required resources

#### 4. Long Queue Times
**Problem**: PRs stay in queue too long

**Solution**:
- Increase "Maximum number of pull requests to build"
- Optimize workflow performance
- Consider parallel job execution
- Review "Maximum time in queue" setting

### Verification Steps

1. **Test Branch Protection**:
   ```bash
   # Try to push directly to main (should fail)
   git push origin main
   ```

2. **Test Merge Queue**:
   - Create a test PR
   - Ensure all checks pass
   - Click "Merge when ready"
   - Verify PR enters queue and processes correctly

3. **Monitor Queue Status**:
   - Check repository insights for merge queue metrics
   - Review workflow run times and success rates
   - Monitor for any stuck or failed queue entries

## 📚 Additional Resources

- [GitHub Branch Protection Documentation](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/defining-the-mergeability-of-pull-requests/about-protected-branches)
- [GitHub Merge Queue Documentation](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/managing-a-merge-queue)
- [GitHub REST API - Branch Protection](https://docs.github.com/en/rest/branches/branch-protection)
- [GitHub CLI Documentation](https://cli.github.com/manual/)
