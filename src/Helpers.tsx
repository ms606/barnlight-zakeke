
// import { UndoRedoStep } from 'Interfaces';
import _ from "lodash";
import useStore from "./Store";
import {
  Group,
  Option,
  SellerSettings,
  useZakeke,
} from "zakeke-configurator-react";

export const PRODUCT_FULL_SUIT = "FlexFabrix™ By DA Suit";
export const PRODUCT_BLAZER = "FlexFabrix™ By DA Blazer";
export const PRODUCT_PANT = "FlexFabrix™ By DA Dress Pants";

export const range = (actualIndex: number, maxItems: number, array: any) => {
  let result = [];
  if (actualIndex <= maxItems) {
    for (let i = 0; i < maxItems; i++) {
      result.push(array[i]);
    }
  } else {
    let difference = actualIndex - maxItems;
    for (let k = difference; k < actualIndex; k++) {
      result.push(array[k]);
    }
  }
  return result;
};

export const launchFullscreen = (element: HTMLElement) => {
  const requestFullScreen =
    element.requestFullscreen ||
    (element as any).webkitRequestFullscreen ||
    (element as any).msRequestFullscreen ||
    (element as any).mozRequestFullScreen;

  if (requestFullScreen) requestFullScreen.call(element);
};

export const swap = (group: Group[], i: number, j: number) => {
  let temp = group[i];
  group[i] = group[j];
  group[j] = temp;
  return group;
};

//export const customizeGroup: Group = {
  // id: -2,
  // guid: "0000-0000-0000-0000",
  // name: "LINING TEXT",
  // enabled: true,
  // attributes: [],
  // steps: [],
  // cameraLocationId: "4f500be3-14f3-4226-cfd6-e1bbf4e390d4",
  // displayOrder: 3,
  // direction: 0,
  // attributesAlwaysOpened: false,
  // imageUrl: "",
  // templateGroups: [],
//};

export const useDefinitiveGroups = (
  groups: Group[],
  hasCustomizeEnabled: boolean,
  hasDesignsSaved: boolean,
  sellerSettings: SellerSettings | null
) => {
  const { isEditorMode, isViewerMode, isDraftEditor } = useStore();
  const definitiveGroups: Group[] = [];

  // const customizeGroup: Group = {
  //   id: -2,
  //   guid: "0000-0000-0000-0000",
  //   name: "LINING TEXT",
  //   enabled: true,
  //   attributes: [],
  //   steps: [],
  //   cameraLocationId: "4f500be3-14f3-4226-cfd6-e1bbf4e390d4",
  //   displayOrder: groups.length - 1,
  //   direction: 0,
  //   attributesAlwaysOpened: false,
  //   imageUrl: "",
  //   templateGroups: [],
  // };

  const savedConfigurationsGroup: Group = {
    id: -3,
    name: "Saved designs",
    imageUrl: "../src/assets/icons/saved_designs.svg",
    attributes: [],
    steps: [],
    guid: "",
    enabled: true,
    displayOrder: 0,
    cameraLocationId: null,
    direction: 0,
    attributesAlwaysOpened: false,
    templateGroups: [],
  };

  let groupsFiltered = groups.map((group) => {
    return {
      ...group,
      templateGroups: group.templateGroups,
      attributes: group.attributes
        .filter(
          (attribute) =>
            attribute.enabled && attribute.options.some((opt) => opt.enabled)
        )
        .map((attribute) => ({
          ...attribute,
          options: attribute.options.filter((x) => x.enabled),
        })),
    };
  });

  function filterAttributes(attributes: any[]) {
    let filteredAttributes = _.cloneDeep(attributes);

    for (let attribute of filteredAttributes)
      attribute.options = attribute.options.filter(
        (option: Option) => option.enabled
      );

    filteredAttributes = filteredAttributes.filter(
      (attr) => attr.enabled && attr.options.length > 0
    );

    return filteredAttributes;
  }

  for (const group of groupsFiltered) {
    if (group.enabled) {
      let newGroup = _.cloneDeep(group);

      for (let step of newGroup.steps) {
        step.attributes = filterAttributes(step.attributes);
      }
      newGroup.steps = newGroup.steps.filter(
        (step) => step.attributes.length > 0 || step.templateGroups.length > 0
      );
      newGroup.attributes = filterAttributes(newGroup.attributes);
      let count = newGroup.steps.reduce(
        (count, step) =>
          (count += step.attributes.length + step.templateGroups.length),
        0
      );
      count += newGroup.attributes.length + newGroup.templateGroups.length;

      if (count > 0) definitiveGroups.push(newGroup);
    }
  }

  // if (hasCustomizeEnabled) {
  // 	definitiveGroups.push(customizeGroup);
  //	}
  if (hasDesignsSaved && !isEditorMode && !isViewerMode && !isDraftEditor) {
    definitiveGroups.push(savedConfigurationsGroup);
  }
  return definitiveGroups;
};

export function useActualGroups() {
  const {
    groups,
    isSceneLoading,
    product,
    isAreaVisible,
    draftCompositions,
    sellerSettings,
  } = useZakeke();
  const shouldCustomizerGroupBeVisible =
    !isSceneLoading && product
      ? product.areas.some((area) => isAreaVisible(area.id))
      : false;
  const hasDesignsSaved =
    (groups && draftCompositions && draftCompositions.length > 0) ?? false;

  const actualGroups =
    useDefinitiveGroups(
      groups,
      shouldCustomizerGroupBeVisible,
      hasDesignsSaved,
      sellerSettings
    ) ?? [];
  return actualGroups;
}

export function scrollDownOnClick(checkOnce: boolean | any, setCheckOnce: any) {
  if (checkOnce && window.innerWidth < 500) {
    setCheckOnce(false);
    window.scrollTo({
      top: window.scrollY + 150,
      behavior: "smooth",
    });
  }
}

export interface Translations {
	statics: Map<string, string>;
	dynamics: Map<string, string>;
}

export class T {
	public static translations: Translations  | null = null;

	public static _(str: string, domain: string) {
		if (this.translations?.statics) {
			const keys = Array.from(this.translations?.statics.keys());
			for (let key of keys) {
				if (key.toLowerCase() === str.toLowerCase()) return this.translations.statics.get(key);
			}
		}

		let gt = (window as any).gt;
		return gt ? gt.dgettext(domain, str) : str;
	}

	public static _d(str: string) {
		let string = str;
		if (this.translations?.dynamics) {
			const keys = Array.from(this.translations?.dynamics.keys());
			for (let key of keys) {
				if (key.toLowerCase() === str.toLowerCase()) {
					if (this.translations.dynamics.get(key)) string = this.translations.dynamics.get(key) as string;
				}
			}
		}
		return string;
	}
}


