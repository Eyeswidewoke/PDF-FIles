# Security Policy

## Reporting a vulnerability

If you discover a security issue (XSS, path traversal, sensitive data exposure, etc.), do not post exploit details in a public issue.

Open a private security advisory in GitHub:

- `Security` tab -> `Advisories` -> `Report a vulnerability`

Include:

- affected file/path
- reproduction steps
- impact
- suggested fix (if available)

## Scope

This project is a static-site archive, but still treat the following as security-relevant:

- exposed secrets or credentials
- accidental disclosure of private/local system data
- script injection or unsafe rendering behavior
- supply-chain compromise in deployment workflow

## Response goals

- Triage quickly
- Remove active exposure paths first
- Publish minimal, clear remediation notes after fix
