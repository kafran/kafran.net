---
title: "Github repo cleanup"
excerpt: "Cleaning github repos using github's API."
date: 2026-02-01 21:56:00 -0300
image: "/assets/images/drawings/the-software-smith/the-software-smith.jpeg"
tags: 
  - github
  - git
---

Github's web interface does not offer an option to bulk delete deployments and action runs. But it's possible to do so through the CLI tool.

## Clean up deployments

```sh
user=<user> repo=<repo>; gh api repos/$user/$repo/deployments --paginate -q '.[].id' | xargs -n1 -I % gh api --silent repos/$user/$repo/deployments/% -X DELETE
```

## Clean up action runs

```sh
user= repo=; gh api repos/$user/$repo/actions/runs --paginate -q '.workflow_runs[] | select(.head_branch != "master") | "\(.id)"' | xargs -n1 -I % gh api --silent repos/$user/$repo/actions/runs/% -X DELETE
```
