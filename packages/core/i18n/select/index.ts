// import { post } from "@olmokit/core/ajax/laravel";
// FIXME: somehow the $$ deeper import does not work
import { $$ } from "@olmokit/dom";
import { $ } from "@olmokit/dom/$";
import { forEach } from "@olmokit/dom/forEach";
import { off } from "@olmokit/dom/off";
import { on } from "@olmokit/dom/on";

/**
 * I18n switch select, a normal form that automatically submits on change
 *
 * @param rootSelector Selector to scope the intialisation
 */
export function I18nSelect(rootSelector = "") {
  const $forms = $$<HTMLFormElement>(
    `${rootSelector ? rootSelector + " " : ""}.i18nSelect`
  );
  const unbinders: { el: HTMLSelectElement; fn: (event: Event) => void }[] = [];

  forEach<HTMLFormElement>($forms, ($form) => {
    const $select = $<HTMLSelectElement>(".formControl", $form);
    const current = $select.value;
    // const $options = $$(".selectOption", $select);

    unbinders.push({ el: $select, fn: handleChange });

    on($select, "change", handleChange);

    function handleChange(event: Event) {
      // @ts-expect-error FIXME: core types
      const url = event.target?.value;
      // const $option = $options[$select.selectedIndex];
      // if ($option) {
      //   const url = option.value;
      //   const locale = getDataAttr($option, "locale");
      //   document.location = url;
      // }

      // handleSubmit()

      if (url && current !== url) {
        // document.location.href = url;
        $form.submit();
      }
    }
  });

  return {
    destroy() {
      unbinders.forEach(({ el, fn }) => off(el, "change", fn));
    },
  };

  // function handleSubmit(url) {
  //   post("/_/i18n/switch", {
  //     data: { url }
  //   })
  // }
}
