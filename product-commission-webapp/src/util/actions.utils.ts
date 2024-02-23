import {IndexFiltersProps, TabProps} from "@shopify/polaris";

export const deleteView = (index: number, itemStrings: string[], setItemStrings: Function, setSelected: Function) => {
  const newItemStrings = [...itemStrings];
  newItemStrings.splice(index, 1);
  setItemStrings(newItemStrings);
  setSelected(0);
};

export const duplicateView = async (name: string, itemStrings: string[], setItemStrings: Function, setSelected: Function) => {
  setItemStrings([...itemStrings, name]);
  setSelected(itemStrings.length);
  await sleep(1);
  return true;
};

export const getTabs = (itemStrings: string[], setItemStrings: Function, setSelected: Function): TabProps[] => {
  const tabs: TabProps[] = itemStrings.map((item: string, index: number) => ({
    content: item,
    index,
    onAction: () => {},
    id: `${item}-${index}`,
    isLocked: index === 0,
    actions:
      index === 0
        ? []
        : [
          {
            type: 'rename',
            onAction: () => {},
            onPrimaryAction: async (value: string): Promise<boolean> => {
              const newItemsStrings = tabs.map((item, idx) => {
                if (idx === index) {
                  return value;
                }
                return item.content;
              });
              await sleep(1);
              setItemStrings(newItemsStrings);
              return true;
            },
          },
          {
            type: 'duplicate',
            onPrimaryAction: async (value: string): Promise<boolean> => {
              await sleep(1);
              duplicateView(value, itemStrings, setItemStrings, setSelected);
              return true;
            },
          },
          {
            type: 'edit',
          },
          {
            type: 'delete',
            onPrimaryAction: async () => {
              await sleep(1);
              deleteView(index, itemStrings, setItemStrings, setSelected);
              return true;
            },
          },
        ],
  }));
  return tabs;
}


export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const getSortUptions = (): IndexFiltersProps['sortOptions'] => {
  return [
    {label: 'Order', value: 'order asc', directionLabel: 'Ascending'},
    {label: 'Order', value: 'order desc', directionLabel: 'Descending'},
    {label: 'Customer', value: 'customer asc', directionLabel: 'A-Z'},
    {label: 'Customer', value: 'customer desc', directionLabel: 'Z-A'},
    {label: 'Date', value: 'date asc', directionLabel: 'A-Z'},
    {label: 'Date', value: 'date desc', directionLabel: 'Z-A'},
    {label: 'Total', value: 'total asc', directionLabel: 'Ascending'},
    {label: 'Total', value: 'total desc', directionLabel: 'Descending'},
  ];
}