# Component Generator

A [Yeoman](http://yeoman.io/) generator for components at Lost My Name.

To use:

```
npm install -g yo @lostmyname/generator-lmn-component
yo lmn-component
```

## Updating existing components

When the gulpfile in this repository is changed, you can use the generator
to update it:

```
yo lmn-component:update
```

Remember to update `lmn-component` using `npm update -g lmn-component`.

If there are new dependencies, they won't be installed—you'll have to do that
bit yourself.

## GitHub support

The generator will always create a git repository for you. You can also get it
to create a GitHub repository for you, and at this point you will be prompted
for a "Personal access token", which you can create in [Settings ->
Applications](https://github.com/settings/applications).

This will be stored, so you only need to provide it the first time. Default
permissions are fine, as long as it has either "repo" or "public_repo" access.
