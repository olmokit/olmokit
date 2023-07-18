---
id: index
title: Core
sidebar_label: Overview
slug: /core
---

![](https://img.shields.io/npm/v/@olmokit/core?style=flat-square&color=magenta&label=@olmokit/core%20|%20npm)

For **core** elements we mean components that are very generic and of common use case. They are usually included repeatedly in the same page and across the same website. Their flexibility should allow to use them even without alteration across different projects. They should be in fact responsible of basic and common elements and UI like `forms`, `images`, `buttons`, `typography`, ecc. These components' templates are always automatically syncronised from the library [`@olmokit/core`](https://www.npmjs.com/package/@olmokit/core) with the command `olmo core` who places them directly in the gitignored `resources` folder.

L'idea è quella di avere piccoli componenti facilmente riutilizzabili senza dover sovrascrivere comportamenti CSS o JS nei singoli progetti. Tutto ciò che include questa libreria deve quindi essere scarno e generico e buttar fuori il minor codice possibile.

Quando utilizzi questa libreria è bene quindi selezionare con cura i vari componenti e parti di componenti che si vogliono includere nel progetto in corso.

## Structure

### Styles

Tutta la parte di CSS è scritta in SCSS prediligendo `mixin` e `placeholder` di modo che anche se inclusi non generino codice fino al loro utilizzo esplicito.

### Scripts

Il JavaScript di questa libreria deve rimanere in codice nativo, senza framework o librerie troppo complesse. Nel momento in cui queste sono necessarie l'importante è scrivere la libreria di modo che il tree shaking elimini la possibilità di inclusione involontaria di librerie e grossi blocchi di codice inutili.

### Templates

I componenti che hanno bisogno di un template da usare in Php usano qui un file `.blade.php|.twig|.php` e vengono sincronizzati automaticamente tramite `olmo core`.
