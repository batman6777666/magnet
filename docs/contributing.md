# Contributing

## How to Contribute

We welcome contributions to the Magnet project. This can include bug fixes, new features, documentation improvements, or performance optimizations.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Make your changes
4. Run the project locally to verify
5. Submit a pull request

## Code Review Process

- All pull requests require at least one review before merging
- Reviews focus on correctness, security, maintainability, and adherence to existing patterns
- The reviewer may request changes or ask clarifying questions
- Once approved, the author merges the PR (squash merge preferred)

## Pull Request Checklist

Before submitting a PR, ensure:

- [ ] Code follows existing style conventions (2-space indentation, semicolons, single quotes for JS)
- [ ] No secrets, keys, or credentials are committed
- [ ] Environment variables are documented in `.env.example` if new ones are added
- [ ] The PR description clearly explains the change and motivation
- [ ] The PR targets the `main` branch
- [ ] The branch is up to date with `main`
- [ ] No new warnings or errors in server logs
- [ ] Extraction still works for at least one movie and one series title
- [ ] Docker build completes successfully (if Docker-related changes)

## Commit Message Conventions

Use conventional commit format:

```
type(scope): description

feat(extractor): add support for new stream provider
fix(browserPool): handle disconnected browser during acquire
docs(api): document inspect endpoint response format
refactor(store): extract key validation to separate function
chore(deps): update puppeteer to v23
```

Types: `feat`, `fix`, `docs`, `refactor`, `perf`, `test`, `chore`, `ci`

## Issue Reporting

When reporting issues, include:

- A clear, descriptive title
- Steps to reproduce (what you did, what you expected, what happened)
- Environment details (OS, Node.js version, Docker version)
- Relevant logs or error messages
- API request/response payloads (redact API keys)

Submit issues at the [GitHub Issues](https://github.com/your-username/magnet/issues) page.

## Feature Requests

Feature requests are welcome. When proposing a feature:

- Explain the use case and how it benefits the project
- Suggest an implementation approach if possible
- Discuss in an issue before submitting a PR for significant changes

## Adding New Stream Providers

To add a new stream server provider (beyond RPM, P2P, UPN):

1. Add a regex pattern in `backend/src/config/constants.js` under `STREAM_PATTERNS`
2. Add a key to `SERVER_KEY_MAP` in `backend/src/services/extractor/domExtractor.js`
3. Update the response schema documentation in `docs/api-reference.md`

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
