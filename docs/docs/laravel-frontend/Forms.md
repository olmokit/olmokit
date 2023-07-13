---
title: Forms
sidebar_label: Forms
---

TODO: xxx

## Forms localisation

per ogni option costruisco delle chiavi dinamicamente che seguiranno quest ordine di priorità:

1. `form.{​​​​​​​​formId}​​​​​​​​.{​​​​​​​​fieldName}​​​​​​​​.option.{​​​​​​​​option.value}`
   che sarà per esempio `form.223.countries.option.IT` vado a vedere se esiste una stringa nel csv con questa chiave, se c'è uso quella

2. se no vado a vedere se esiste una stringa globale per quel field con una chiave tipo `form.globals.{​​​​​​​​​​​​​fieldName}​​​​​​​​​​​​​.option.{​​​​​​​​​​​​​fieldvalue}` ​​​​​​​​​​​​​nel nostro caso: `form.globals.countries.option.IT`, se cè nel csv uso quella, in questo modo se si hanno diversi form che usano lo stesso field si riduce la duplicazione nel csv.

3. se non c'è vado a vedere se esiste una stringa nel csv per quel field con una chiave tipo `form.{​​​​​​​​fieldName}​​​​​​​​.option.{​​​​​​​​fieldvalue}`​​​​​​​, nel nostro caso: `form.countries.option.IT`

4. se non c'è nemmeno questa guardo se c'è un valore `option.key` o `option.label` da fill form

se non c'è manco quello non stampo niente
