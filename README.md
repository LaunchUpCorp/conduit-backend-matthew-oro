# NodeExpressSQLBackend

## Getting Started

- run `npm install` to install all dependencies
- Create a .env file with a `PORT` variable and a `DATABASE_URL` variable
- run `npm run dev` to start the server
- go to `localhost:4000/api` to see the server running

The server will reload when you make changes.

## Semantic Commit Messages

All commit messages and PR titles need to follow Conventional Commits semantics.

Format: `<type>(<scope>): <subject>`

`<scope>` is optional

### Example

```
feat: add hat wobble
^--^  ^------------^
|     |
|     +-> Summary in present tense.
|
+-------> Type: chore, docs, feat, fix, refactor, style, or test.
```

More Examples:

- `feat`: (new feature for the user, not a new feature for build script)
- `fix`: (bug fix for the user, not a fix to a build script)
- `docs`: (changes to the documentation)
- `style`: (formatting, missing semi colons, etc; no production code change)
- `refactor`: (refactoring production code, eg. renaming a variable)
- `test`: (adding missing tests, refactoring tests; no production code change)
- `chore`: (updating grunt tasks etc; no production code change)
