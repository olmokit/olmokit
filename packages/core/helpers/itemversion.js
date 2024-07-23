import { forEach } from "@olmokit/dom/forEach";
import { globalConf } from "../data";

export function availableItem(
  product = null,
  attr,
  lenght,
  index,
  interact,
  typepage
) {
  const api = globalConf?.api.name;

  if (api != "olmo") {
    const item = product ? product : null;
    const versions = product ? product.versions : null;
    let available = true;
    const attrs = attr.params;
    const arrayOfObj = Object.entries(attrs).map((e) => ({
      name: e[0],
      value: e[1],
    }));

    if (versions) {
      for (let i = 0; i < versions.length; i++) {
        let counter = 0;
        for (let n = 0; n < versions[i].properties.length; n++) {
          for (let x = 0; x < arrayOfObj.length; x++) {
            if (versions[i].properties[n].name == arrayOfObj[x].name) {
              for (let z = 0; z < versions[i].properties[n].items.length; z++) {
                if (
                  versions[i].properties[n].items[z].id == arrayOfObj[x].value
                ) {
                  counter++;
                }
                if (counter + 1 > arrayOfObj.length) {
                  available = versions[i].available ? false : true;
                  counter = 0;
                }
              }
            }
          }
        }
      }
    } else if (item) {
      available = product.available;
    }

    return available;
  } else {
    if ((0 == index || interact) && typepage == "singlepage") {
      const itemsOrproperty = product?.property ? true : false;
      const props = attr.properties.map(function (num) {
        return parseInt(num);
      });
      let counter = 0;

      if (!itemsOrproperty) {
        const items = product.items;

        forEach(items, (item) => {
          const properties = item.property;
          let counter = 0;
          forEach(properties, (property) => {
            if (props.includes(property.id)) {
              counter++;
            }
            if (counter == properties.length) {
              const quantity = item.qty == 0 ? false : true;
              return quantity;
            }
          });
        });

        return false;
      } else {
        // console.error("Build me please!");
      }
    }
  }
}
