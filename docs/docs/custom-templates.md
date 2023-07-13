---
id: custom-templates
title: Custom Templates
---

Custom Templates enable you to select a template to create your project from, while still retaining all of the features of Create Laravel App.

You'll notice that Custom Templates are always named in the format `template-laravel-[template-name]`, however you only need to provide the `[template-name]` to the creation command.

Scoped templates are also supported, under the name `@[scope-name]/template-laravel` or `@[scope-name]/template-laravel-[template-name]`, which can be installed via `@[scope]` and `@[scope]/[template-name]` respectively.

```sh
npx @olmokit/create-app myproject --template [template-name]
```

## Finding custom templates

We ship one template by default:

- [`template-laravel`](https://gitlab.com/olmokit/olmokit/-/tree/main/packages/template-laravel)

However, you can find other templates by searching for ["template-laravel-\*"](https://www.npmjs.com/search?q=template-laravel-*) on npm.

## Building a template

If you're interested in building a custom template, first take a look at how we've built [`template-laravel`](https://gitlab.com/olmokit/olmokit/-/tree/main/packages/template-laravel).

A template should have the following structure:

```bash
template-laravel-[template-name]/
  README.md (for npm)
  template.json
  package.json
  template/
    .vscode/ (optional)
    config/ (optional)
      ...config files
    src/
      ...all files
    composer.json
    gitignore (optional)
    README.md (optional, for projects created from this template)
```

### Testing a template

To test a template locally, pass the file path to the directory of your template source using the `file:` prefix.

```sh
npx @olmokit/create-app myproject --template file:../path/to/your/template/template-laravel-[template-name]
```

### The `template` folder

This folder is copied to the user's app directory as Create Laravel App installs. During this process, the file `gitignore` is renamed to `.gitignore`.

You can add whatever files you want in here, but you must have at least the files specified above.

### The `template.json` file

This is the configuration file for your template. As this is a new feature, more options will be added over time. For now, only a `package` key is supported.

The `package` key lets you provide any keys/values that you want added to the new project's `package.json`, such as dependencies and any custom scripts that your template relies on.

Below is an example `template.json` file:

```json
{
  "package": {
    "dependencies": {
      "eslint-plugin-jsx-a11y": "^6.2.3",
      "serve": "^11.2.0"
    },
    "scripts": {
      "serve": "serve -s build"
    },
    "eslintConfig": {
      "extends": ["plugin:jsx-a11y/recommended"],
      "plugins": ["jsx-a11y"]
    }
  }
}
```

Any values you add for `"dependencies"` and `"scripts"` will be merged with the Create Laravel App defaults. Values for any other keys will be used as-is, replacing any matching Create Laravel App defaults.
