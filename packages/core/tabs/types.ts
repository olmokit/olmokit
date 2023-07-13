export type TabsMap = Record<string, TabsMapItem>;

export type TabsMapItem = {
  $tab?: HTMLElement;
  $panel?: HTMLElement;
};

export type TabsCallbackArg = {
  tabId: string;
  $activeTab?: HTMLElement;
  $activePanel?: HTMLElement;
  $inactiveTabs: HTMLElement[];
  $inactivePanels: HTMLElement[];
};
