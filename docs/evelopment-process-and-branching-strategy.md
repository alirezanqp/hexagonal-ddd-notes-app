# Development Process Documentation  

This document outlines the standardized workflow for managing development processes, ensuring consistency and efficiency.

---

## Workflow Steps  

### 1. **Creating an Issue**  
1. **Open an Issue**:  
   - Navigate to the **Issues** tab in the GitHub repository.  
   - Create a new issue and fill in the description with a detailed explanation of the task or bug.  
2. **Assign the Task**:  
   - Assign the issue to the responsible team member.  
3. **Project Board**:  
   - Add the issue to the appropriate GitHub Project board for tracking (e.g., Backlog, In Progress).  
4. **Labels**:  
   - Add relevant labels, such as:  
     - **enhancement**: for new features.  
     - **bug**: for bug fixes.  
     - **refactor**: for code improvements.  

---

### 2. **Creating a Branch**  
1. Branch Naming Convention:  
   Use the format:  
   ```bash
   issue-number-branch-name
   ```  
   - Example:  
     ```bash
     135-refactor-event-base
     ```  
2. Always create feature or bug branches from the `dev` branch.  

---

### 3. **Pull Requests (PR)**  
1. Create a Pull Request:  
   - Open a PR when the development task is complete.  
   - Ensure the PR name follows the naming pattern:  
     ```bash
     [issue-number-TYPE]: pr name
     ```  
     - Example:  
       ```bash
       [135-REFACTOR]: domain events
       ```  
2. Assign a Reviewer:  
   - Select one or more reviewers responsible for reviewing the code.  

3. Validation:  
   - Ensure all pipelines (CI/CD checks) pass before requesting a merge.  

4. Approval and Merge:  
   - The PR can only be merged after receiving approval from the assigned reviewers.  

---

## GitHub Branching Strategy  

1. **Main**:  
   - Contains the stable production code.  
   - Only deployable code is merged into this branch.  

2. **Staging**:  
   - Used for testing and integration.  
   - Pull requests from `dev` are merged here for pre-production validation.  

3. **Dev**:  
   - The main development branch.  
   - All feature and bug fix branches are created from this branch.  

4. **Feature/Bug Branches**:  
   - Created from the `dev` branch for specific issues.  
   - Example:  
     ```bash
     git checkout -b 135-refactor-event-base dev
     ```  

---

## Summary  

### Naming Conventions  
- **Branches**:  
  - Format: `issue-number-branch-name`  
  - Example: `135-refactor-event-base`  

- **Pull Requests**:  
  - Format: `[issue-number-TYPE]: pr name`  
  - Example: `[135-REFACTOR]: domain events`  

### Workflow Summary  
1. Create an issue and assign it.  
2. Create a branch for the issue from the `dev` branch.  
3. Open a pull request with proper naming.  
4. Assign a reviewer and ensure all CI/CD pipelines pass.  
5. Merge to `dev` (or `staging`/`main` as applicable).  

This process ensures transparency, traceability, and high-quality code integration.