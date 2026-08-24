# Contributing to Education CRM

Thank you for contributing to the **Distance Education Consultancy CRM & Lead Generation Platform**.

## 🚀 Development Workflow

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Velametricglobal/education-crm.git
   cd education-crm
   ```

2. **Branching Strategy**:
   Create a new branch from `main` using standard prefixes:
   - `feature/<feature-name>` for new capabilities
   - `fix/<bug-description>` for bug fixes
   - `refactor/<component>` for architectural improvements

3. **Install Dependencies**:
   ```bash
   npm install
   ```

4. **Environment Setup**:
   Copy `.env.example` to `.env` and fill in your Supabase credentials:
   ```bash
   cp .env.example .env
   ```

5. **Run Locally**:
   ```bash
   npm run dev
   ```

6. **Verify Build**:
   Before opening a pull request, run:
   ```bash
   npm run build
   ```

7. **Submit Pull Request**:
   Push your branch and open a pull request targeting `main`.
