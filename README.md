# action-milestone-comment

GitHub Action to Comment on Milestone Issues and Pull Requests

## Usage

Comment on all issues and pull requests after closing a milestone.

```yaml
name: Closed Milestones

on:
  milestone:
    types: [closed]

permissions:
  issues: write
  pull-requests: write

jobs:
  Comment:
    runs-on: ubuntu-latest
    steps:
      - uses: bflad/action-milestone-comment@v1
        with:
          body: |
            This functionality has been released in ${{ github.event.milestone.title }}.

            For further feature requests or bug reports with this functionality, please create a [new GitHub issue](https://github.com/${{ github.repository }}/issues/new/choose) following the template. Thank you!
```

### Inputs

| Input | Description | Default |
|-------|-------------|---------|
| `body` | Content of comment for issues and pull requests. | |
| `milestone` | Numeric identifier of milestone. | `${{ github.event.milestone.number }}` |
| `state` | Issue and pull request state. Only those in this state will receive a comment. Valid values are `all`, `closed`, or `open`. | `all` |
| `token` | GitHub token to perform actions. | `${{ github.token }}` |

### Outputs

| Output | Description |
|-------|-------------|
| `ids` | Identifiers of all issues and pull requests that received comments. |

## Development

Install the dependencies

```bash
npm install
```

Run the tests :heavy_check_mark:

```bash
npm run test
```

### Packaging for Distribution

Packaging assembles the code into one file (`dist/index.js`) that can be checked in to Git, enabling fast and reliable execution and preventing the need to check in `node_modules`.

Run build

```bash
npm run build
```
