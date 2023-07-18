---
id: getting-started
title: Getting Started
---

## Quick Start

```sh
npx @olmokit/create-app myproject
cd myproject
npm start
```

Running `npx @olmokit/create-app myproject` command will create a directory called `myproject` inside the current folder. Inside that directory, it will generate the initial project structure and install the transitive dependencies.

### Get Started Immediately

You **don’t** need to install or configure tools like webpack or Babel. They are preconfigured and hidden so that you can focus on the code.

### Node version

**You’ll need to have Node >= 16 on your local development machine** (but it’s not required on the server). You can use [nvm](https://github.com/creationix/nvm#installation) (macOS/Linux) or [nvm-windows](https://github.com/coreybutler/nvm-windows#node-version-manager-nvm-for-windows) to switch Node versions between different projects.

_([npx](https://medium.com/@maybekatz/introducing-npx-an-npm-package-runner-55f7d4bd282b) comes with npm 5.2+ and higher)_

### Selecting a template

At the time of writing the default and also only available starter template is a basic [`template-laravel`](https://gitlab.com/olmokit/olmokit/-/tree/main/packages/template-laravel/template). We might have in a future more specific starter configurations according to common projects typologies.

You can select a custom template by appending `--template [template-name]` to the creation command.

If you don't select a template, we'll create your project with our base template.
Templates are always named in the format `template-laravel-[template-name]`, however you only need to provide the `[template-name]` to the creation command.

```sh
npx @olmokit/create-app myproject --template [template-name]
```

> You can find a list of available templates by searching for ["template-laravel-\*"](https://www.npmjs.com/search?q=template-laravel-*) on npm.

Our [Custom Templates](/custom-templates) documentation describes how you can build your own template.
