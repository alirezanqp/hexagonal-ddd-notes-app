## Continuous Integration with GitHub Actions  

This project uses GitHub Actions to automate continuous integration tasks, including building the application, running lint checks, and executing unit tests. The workflow ensures code quality and stability with every commit and pull request.

### Workflow Overview  

The GitHub Actions workflow is triggered in two scenarios:  
1. **On every push** to any branch (`'**'` matches all branches).  
2. **Manually** via the Actions tab using the `workflow_dispatch` event.  

### Jobs in the Workflow  

The workflow defines three jobs:  

#### 1. **Build**  
- **Purpose**: Install dependencies and build the application.  
- **Runs on**: `ubuntu-latest`.  
- **Steps**:  
  - Checkout the code using `actions/checkout@v3`.  
  - Set up the specified Node.js version (currently `20.x`) using `actions/setup-node@v3`.  
  - Cache `npm` dependencies for faster builds.  
  - Install dependencies with `npm ci`.  
  - Build the project using `npm run build`, if a build script exists.  

#### 2. **Code Quality (Linting)**  
- **Purpose**: Check the code for linting issues to ensure consistency and quality.  
- **Runs on**: `ubuntu-latest`.  
- **Steps**:  
  - Checkout the code using `actions/checkout@v3`.  
  - Set up the specified Node.js version (`20.x`) using `actions/setup-node@v3`.  
  - Cache `npm` dependencies.  
  - Run the linting process with `npm run lint`.  

#### 3. **Unit Tests**  
- **Purpose**: Run unit tests to ensure the correctness of the application.  
- **Runs on**: `ubuntu-latest`.  
- **Steps**:  
  - Checkout the code using `actions/checkout@v3`.  
  - Set up the specified Node.js version (`20.x`) using `actions/setup-node@v3`.  
  - Cache `npm` dependencies.  
  - Run unit tests with `npm run test`.  

---

### How to Use  

The workflow will automatically run on every push to any branch or can be triggered manually from the Actions tab. You can monitor the status of each job (Build, Lint, and Test) and view detailed logs from the GitHub Actions interface.

