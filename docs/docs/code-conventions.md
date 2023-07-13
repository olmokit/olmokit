---
id: code-conventions
title: Code conventions
---

## Class names

### core

`Core` elements are very generic and of common use case. They are usually used repeatedly in the same page and across the same website. Their flexibility should allow to use them even without alteration across different projects. They should be in fact responsible of basic and common elements and UI like `forms`, `images`, `buttons`, `typography`, ecc. Their class naming follows this pattern:

```scss
.myClass
.myClassInner
.myClass--modifier
```

### components

`Components` are quite specific pieces of UI that are usually reused within the same project and can, but not necessarily need, to be reused accross different projects. They should be responsible of specific functionalities and should be configurable from outside enought to allow their reuse in the same project. Usual use cases for components are pieces of UI like the `Header`, the `Footer`, `Card`s, `Slider`s, ecc. Their class naming follows this pattern:

```scss
.Mycomponent:
.Mycomponent:block
.Mycomponent:block--modifier
.Mycomponent:block__element
.Mycomponent:block__elementInner
.Mycomponent:block__element--modifier
```

### routes

`Routes` contain code that is always scoped and outputted only to its specific template. So by default JS and SCSS code written here cannot interfere with other routes/pages. It's often handy to divide a page in sections and namespace them to organize the code. Sections of a page often look like `.intro:`, `.details:`, `.products:`, `.featured:`, etc. Their class naming follows this pattern:

```scss
.pagesection:
.pagesection:block
.pagesection:block--modifier
.pagesection:block__element
.pagesection:block__elementInner
.pagesection:block__element--modifier
```

## Notes

### Class names for state and behaviour

Class names that denote states or behaviour are shorter and descriptive like:

```scss
.is-visible
.has-link
.has-img
.is-doubled
.is-even
.when-vertical
etc.
```

### Regarding the use of colon

In **SCSS** the `:` needs to be escaped by a backslash as such `Mycomponent\:`, while in **JS** using the `$` or `$$` or `escape` functions to deal with DOM selectors the colon `:` is automatically escaped. Otherwise it needs to be escaped as such `querySelector(".Mycomponent\\:")`.
