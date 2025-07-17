# GitHub Merge Queue Demo

A comprehensive demonstration of GitHub's merge queue functionality with automated CI/CD workflows for pull requests and merge groups.

## 🚀 Overview

This project showcases how to implement and use GitHub's merge queue feature with a sample Node.js Express application. It demonstrates:

- **Pull Request Workflows**: Automated testing and validation on PR events
- **Merge Group Workflows**: Final validation before merging to main branch
- **Comprehensive Testing**: Unit tests, integration tests, and performance validation
- **Security Scanning**: Dependency audits and vulnerability checks
- **Multi-Node Testing**: Testing across multiple Node.js versions

## 📋 Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Workflows](#workflows)
- [Setting Up Merge Queue](#setting-up-merge-queue)
- [Testing the Demo](#testing-the-demo)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)

## ✨ Features

### Sample Application
- **Express.js API** with mathematical calculation endpoints
- **Comprehensive error handling** and input validation
- **Health check endpoint** for monitoring
- **Modular architecture** with utility functions

### Testing Suite
- **Unit tests** for utility functions using Jest
- **Integration tests** for API endpoints using Supertest
- **Test coverage reporting**
- **Multiple Node.js version compatibility**

### CI/CD Workflows
- **Pull Request CI**: Runs on PR events with linting, building, testing, and security checks
- **Merge Group CI**: Final validation before merging with comprehensive testing
- **Parallel job execution** for faster feedback
- **Artifact management** and test result reporting

## 🔧 Prerequisites

- **Node.js** 16.x or higher
- **npm** 7.x or higher
- **Git** for version control
- **GitHub repository** with Actions enabled

## 🚀 Quick Start

### 1. Clone and Setup

```bash
# Clone the repository
git clone https://github.com/your-username/merge-queue-demo.git
cd merge-queue-demo

# Install dependencies
npm install

# Run tests to verify setup
npm test
```

### 2. Start the Application

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The application will be available at `http://localhost:3000`

### 3. Test the API

```bash
# Health check
curl http://localhost:3000/health

# Calculate sum
curl -X POST http://localhost:3000/api/sum \
  -H "Content-Type: application/json" \
  -d '{"numbers": [1, 2, 3, 4, 5]}'

# Calculate product
curl -X POST http://localhost:3000/api/product \
  -H "Content-Type: application/json" \
  -d '{"numbers": [2, 3, 4]}'
```

## 📁 Project Structure

```
merge-queue-demo/
├── .github/
│   └── workflows/
│       ├── pull-request.yml    # PR workflow
│       └── merge-group.yml     # Merge group workflow
├── src/
│   ├── index.js               # Main application
│   └── utils.js               # Utility functions
├── tests/
│   ├── api.test.js            # API integration tests
│   └── utils.test.js          # Unit tests
├── package.json               # Dependencies and scripts
└── README.md                  # This file
```

## 🔄 Workflows

### Pull Request Workflow (`.github/workflows/pull-request.yml`)

Triggered on: `pull_request` events (opened, synchronize, reopened)

**Jobs:**
1. **Lint**: Code quality and formatting checks
2. **Build**: Application build verification
3. **Unit Tests**: Run across Node.js 16, 18, 20
4. **Integration Tests**: API endpoint testing
5. **Security**: Dependency audits and vulnerability scans
6. **Performance**: Basic performance validation
7. **Summary**: Consolidated results reporting

### Merge Group Workflow (`.github/workflows/merge-group.yml`)

Triggered on: `merge_group` events (checks_requested)

**Jobs:**
1. **Quick Checks**: Fast syntax and lint validation
2. **Build Verification**: Ensure successful build
3. **Comprehensive Tests**: Full test suite across multiple Node versions
4. **Security & Compliance**: Enhanced security scanning
5. **Performance Validation**: Detailed performance testing
6. **Final Merge Validation**: Pre-merge verification
7. **Summary**: Final approval/rejection decision

## 🛡️ Setting Up Merge Queue

### 1. Enable Merge Queue in Repository Settings

1. Go to your repository **Settings**
2. Navigate to **General** → **Pull Requests**
3. Check **"Allow merge queue"**

### 2. Configure Branch Protection Rules

1. Go to **Settings** → **Branches**
2. Add rule for `main` branch:
   - ✅ Require a pull request before merging
   - ✅ Require status checks to pass before merging
   - ✅ Require branches to be up to date before merging
   - ✅ Require conversation resolution before merging
   - Add required status checks:
     - `Pull Request CI / pr-summary`
     - `Merge Group CI / merge-summary`

### 3. Configure Merge Queue Settings

1. In branch protection rules, enable:
   - ✅ **Require merge queue**
   - Set **merge method** to "Merge commit" or "Squash and merge"
   - Configure **maximum pull requests to build** (recommended: 5)
   - Set **minimum pull requests to merge** (recommended: 1)

## 🧪 Testing the Demo

### 1. Create a Test Pull Request

```bash
# Create a feature branch
git checkout -b feature/test-merge-queue

# Make a simple change
echo "console.log('Testing merge queue');" >> src/test.js

# Commit and push
git add .
git commit -m "Add test file for merge queue demo"
git push origin feature/test-merge-queue
```

### 2. Open Pull Request

1. Create PR from `feature/test-merge-queue` to `main`
2. Watch the **Pull Request CI** workflow execute
3. Review the workflow results and summary

### 3. Test Merge Queue

1. Once PR checks pass, click **"Merge when ready"**
2. The PR will be added to the merge queue
3. Watch the **Merge Group CI** workflow execute
4. If all checks pass, the PR will be automatically merged

### 4. Monitor Workflow Results

- Check the **Actions** tab for detailed workflow logs
- Review the **Summary** section for consolidated results
- Verify merge queue behavior in the PR timeline

## 📚 API Documentation

### Endpoints

#### `GET /`
Returns welcome message and available endpoints.

#### `GET /health`
Health check endpoint returning server status.

#### `POST /api/calculate`
Generic calculation endpoint.
```json
{
  "operation": "sum" | "product",
  "numbers": [1, 2, 3, 4, 5]
}
```

#### `POST /api/sum`
Calculate sum of numbers.
```json
{
  "numbers": [1, 2, 3, 4, 5]
}
```

#### `POST /api/product`
Calculate product of numbers.
```json
{
  "numbers": [2, 3, 4]
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass (`npm test`)
6. Commit your changes (`git commit -m 'Add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

The merge queue will automatically validate your changes!

## 📝 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🔗 Additional Resources

- [GitHub Merge Queue Documentation](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/managing-a-merge-queue)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Express.js Documentation](https://expressjs.com/)
- [Jest Testing Framework](https://jestjs.io/)
