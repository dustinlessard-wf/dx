# DX Tools

A set of command line tools to measure and report developer experience metrics.

## Prerequisites

Before you begin, ensure you have installed [Node.js](https://nodejs.org/) and [pnpm](https://pnpm.io/) on your system.

## Getting Started

To start using this CLI TypeScript starter, follow these steps:

### 1. Get Dependencies

```sh
pnpm install
```

### 3. Run a command

```sh
pnpm start prs
```

### 4. Set up environment variables

Create a `.env` file in the root directory and configure your environment variables as needed.

### Running Commands

- In development mode, use `pnpm start [command name]` to run any command. This utilizes `ts-node` for a seamless
  development experience.
- In production, execute the CLI application directly with `dx [command name]` to run the desired
  command from the built project (the name of command should be provided in `package.json` in `bin`).

### Sample Commands

- **`prs`**: Prints information describing a Github user's pull requests.

All commands are located in the `src/commands/` folder. This organization makes it easy to find and modify commands or
add new ones as needed.

### Script Commands

This project comes with several predefined scripts to help with development:

- `pnpm build` - Build the project using `tsup`.
- `pnpm build:watch` - Automatically rebuild the project on file changes.
- `pnpm commit` - run `commitizen` tool for helping with commit messages.
- `pnpm commitlint` - lint commit messages.
- `pnpm compile` - Compile TypeScript files using `tsc`.
- `pnpm clean` - Remove compiled code from the `dist/` directory.
- `pnpm format` - Check files for code style issues using Prettier.
- `pnpm format:fix` - Automatically fix code formatting issues with Prettier.
- `pnpm lint` - Check code for style issues with ESLint.
- `pnpm lint:fix` - Automatically fix code style issues with ESLint.
- `pnpm start [command]` - Run the CLI application using `ts-node`.
- `pnpm start:node [command]` - Run the CLI application from the `dist/` directory.
- `pnpm test` - Run unit tests.
- `pnpm test:watch` - Run tests and watch for file changes.

## CI/CD and Automation

### Automated Version Management and NPM Publishing with Semantic-Release

This project utilizes `semantic-release` to automate version management and the NPM publishing
process. `Semantic-release` automates the workflow of releasing new versions, including the generation of detailed
release notes based on commit messages that follow the conventional commit format.

The publishing process is triggered automatically when changes are merged into the main branch. Here's how it works:

1. **Automated Versioning:** Based on the commit messages, `semantic-release` determines the type of version change (
   major, minor, or patch) and updates the version accordingly.
2. **Release Notes:** It then generates comprehensive release notes detailing new features, bug fixes, and any breaking
   changes, enhancing clarity and communication with users.
3. **NPM Publishing:** Finally, `semantic-release` publishes the new version to the NPM registry and creates a GitHub
   release with the generated notes.

To ensure a smooth `semantic-release` process:

- Merge feature or fix branches into the main branch following thorough review and testing.
- Use conventional commit messages to help `semantic-release` accurately determine version changes and generate
  meaningful release notes.
- Configure an NPM access token as a GitHub secret under the name `NPM_TOKEN` for authentication during the publication
  process.

By integrating `semantic-release`, this project streamlines its release process, ensuring that versions are managed
efficiently and that users are well-informed of each update through automatically generated release notes.

## Development

To contribute to this project or customize it for your needs, consider the following guidelines:

1. **Code Styling:** Follow the predefined code style, using Prettier for formatting and ESLint for linting, to ensure
   consistency.
2. **Commit Messages:** We use `commitizen` and `commitlint` to ensure our commit messages are consistent and follow the
   conventional commit format, recommended by `@commitlint/config-conventional`. To make a commit, you can
   run `pnpm commit`, which will guide you through creating a conventional commit message.
3. **Testing:** Write unit tests for new features or bug fixes using Jest. Make sure to run tests before pushing any
   changes.
4. **Environment Variables:** Use the `.env` file for local development. For production, ensure you configure the
   environment variables in your deployment environment.
5. **Husky Git Hooks:** This project utilizes Husky to automate linting, formatting, and commit message verification via
   git hooks. This ensures that code commits meet our quality and style standards without manual checks. The hooks set
   up include pre-commit hooks for running ESLint and Prettier, and commit-msg hooks for validating commit messages
   with `commitlint`.

## Contributing

Contributions are welcome! If you'd like to improve this CLI , please follow the standard
fork-and-pull request workflow. Here are a few guidelines to keep in mind:

- Make sure your code adheres to the project's coding standards, including using Prettier for code formatting and ESLint
  for linting.
- Follow the conventional commit format for your commit messages. This project uses `commitizen` and `commitlint` with
  the `@commitlint/config-conventional` configuration, enforced by Husky git hooks.
- Include tests for new features or bug fixes when applicable.
- Ensure your changes are properly formatted and linted before submitting a pull request.

By adhering to these guidelines, you help maintain the quality and consistency of the project, making it easier for
others to contribute and for users to understand and utilize the project effectively.

## Adding a new commmand

To add a new command,

1. Create a new file within `src/commands` named as the command you seek to add
2. Add a reference to this file within the `commands` constant in `src/commands/index.ts`

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## Author

**Dustin Pauze**

- GitHub: [@dustinlessard-wf](https://github.com/dustinlessard-wf)

This project is build on [CLI TypeScript Starter](https://github.com/kucherenko/cli-typescript-starter)
