"use client";
import {
  TextField,
  IndexTable,
  Card,
  IndexFilters,
  useSetIndexFiltersMode,
  useIndexResourceState,
  Text,
  ChoiceList,
  Button, RangeSlider,
} from '@shopify/polaris';
import type {IndexFiltersProps, TabProps} from '@shopify/polaris';
import {useState, useCallback, useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {getProducts, product, selectProducts} from "../redux/features/product.slice";
import {AppDispatch} from "../redux/store";
import styles from "../styles/product.module.css";
import {getSortUptions, getTabs, sleep} from "../util/actions.utils";

const Products = (): JSX.Element => {
  const dispatch: AppDispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  const products = useSelector(selectProducts);


  const [bulkPercent, setBulkPercent] = useState(0);
  const [bulkActionBtn, setBulkActionBtn] = useState(true);

  const [itemStrings, setItemStrings] = useState([
    'All'
  ]);

  const [selected, setSelected] = useState(0);

  const tabs: TabProps[] = getTabs(itemStrings, setItemStrings, setSelected);


  const onHandleSave = async () => {
    await sleep(1);
    return true;
  };



  const [sortSelected, setSortSelected] = useState(['order asc']);

  const {mode, setMode} = useSetIndexFiltersMode();
  const onHandleCancel = () => {};

  const handleChangeBulkPercent = useCallback((value: any) => {
    setBulkPercent(value)
    setBulkActionBtn(false)
  }, []);


  const onCreateNewView = async (value: string) => {
    await sleep(500);
    setItemStrings([...itemStrings, value]);
    setSelected(itemStrings.length);
    return true;
  };

  const primaryAction: IndexFiltersProps['primaryAction'] = selected === 0
    ? {
      type: 'save-as',
      onAction: onCreateNewView,
      disabled: false,
      loading: false,
    }
    : {
      type: 'save',
      onAction: onHandleSave,
      disabled: false,
      loading: false,
    };

  const [accountStatus, setAccountStatus] = useState<string[] | undefined>(
    undefined,
  );
  const [moneySpent, setMoneySpent] = useState<[number, number] | undefined>(
    undefined,
  );
  const [taggedWith, setTaggedWith] = useState('');
  const [queryValue, setQueryValue] = useState('');

  const handleAccountStatusChange = useCallback(
    (value: string[]) => setAccountStatus(value),
    [],
  );
  const handleMoneySpentChange = useCallback(
    (value: [number, number]) => setMoneySpent(value),
    [],
  );
  const handleTaggedWithChange = useCallback(
    (value: string) => setTaggedWith(value),
    [],
  );
  const handleFiltersQueryChange = useCallback(
    (value: string) => setQueryValue(value),
    [],
  );
  const handleAccountStatusRemove = useCallback(
    () => setAccountStatus(undefined),
    [],
  );
  const handleMoneySpentRemove = useCallback(
    () => setMoneySpent(undefined),
    [],
  );
  const handleTaggedWithRemove = useCallback(() => setTaggedWith(''), []);

  const handleQueryValueRemove = useCallback(() => setQueryValue(''), []);

  const handleFiltersClearAll = useCallback(() => {
    handleAccountStatusRemove();
    handleMoneySpentRemove();
    handleTaggedWithRemove();
    handleQueryValueRemove();
  }, [
    handleAccountStatusRemove,
    handleMoneySpentRemove,
    handleQueryValueRemove,
    handleTaggedWithRemove,
  ]);


  const sortOptions = getSortUptions();

  const filters = [
    {
      key: 'accountStatus',
      label: 'Account status',
      filter: (
        <ChoiceList
          title="Account status"
          titleHidden
          choices={[
            {label: 'Enabled', value: 'enabled'},
            {label: 'Not invited', value: 'not invited'},
            {label: 'Invited', value: 'invited'},
            {label: 'Declined', value: 'declined'},
          ]}
          selected={accountStatus || []}
          onChange={handleAccountStatusChange}
          allowMultiple
        />
      ),
      shortcut: true,
    },
    {
      key: 'taggedWith',
      label: 'Tagged with',
      filter: (
        <TextField
          label="Tagged with"
          value={taggedWith}
          onChange={handleTaggedWithChange}
          autoComplete="off"
          labelHidden
        />
      ),
      shortcut: true,
    },
    {
      key: 'moneySpent',
      label: 'Money spent',
      filter: (
        <RangeSlider
          label="Money spent is between"
          labelHidden
          value={moneySpent || [0, 500]}
          prefix="$"
          output
          min={0}
          max={2000}
          step={1}
          onChange={handleMoneySpentChange}
        />
      ),
    },
  ];

  const appliedFilters: IndexFiltersProps['appliedFilters'] = [];

  if (accountStatus && !isEmpty(accountStatus)) {
    const key = 'accountStatus';
    appliedFilters.push({
      key,
      label: disambiguateLabel(key, accountStatus),
      onRemove: handleAccountStatusRemove,
    });
  }
  if (moneySpent) {
    const key = 'moneySpent';
    appliedFilters.push({
      key,
      label: disambiguateLabel(key, moneySpent),
      onRemove: handleMoneySpentRemove,
    });
  }
  if (!isEmpty(taggedWith)) {
    const key = 'taggedWith';
    appliedFilters.push({
      key,
      label: disambiguateLabel(key, taggedWith),
      onRemove: handleTaggedWithRemove,
    });
  }

  const resourceName = {
    singular: 'product',
    plural: 'products',
  };

  const {selectedResources, allResourcesSelected, handleSelectionChange} = useIndexResourceState(products);


  // const handleCommissionPercentChange = useCallback(
  //   (value) => setCommissionPercentChange(value),
  //   []
  // )

  const rowMarkup = products?.map(({id, product_name, product_type, product_price, product_percent}, index) => (
      <IndexTable.Row
        id={id}
        key={id}
        selected={selectedResources.includes(id)}
        position={index}
      >
        <IndexTable.Cell>
          <Text variant="bodyMd" fontWeight="bold" as="span">
            {product_name}
          </Text>
        </IndexTable.Cell>
        <IndexTable.Cell>{product_type}</IndexTable.Cell>
        <IndexTable.Cell>{product_price}</IndexTable.Cell>
        <IndexTable.Cell>
          <TextField
            label="commission percent"
            labelHidden={true}
            type="number"
            autoComplete="off"
            value={product_percent.toString()}
            // onChange={handleCommissionPercentChange}
          />
        </IndexTable.Cell>
      </IndexTable.Row>
    ),
  );

  return (
    <Card>
      <IndexFilters
        sortOptions={sortOptions}
        sortSelected={sortSelected}
        queryValue={queryValue}
        queryPlaceholder="Searching in all"
        onQueryChange={handleFiltersQueryChange}
        onQueryClear={() => setQueryValue('')}
        onSort={setSortSelected}
        primaryAction={primaryAction}
        cancelAction={{
          onAction: onHandleCancel,
          disabled: false,
          loading: false,
        }}
        tabs={tabs}
        selected={selected}
        onSelect={setSelected}
        canCreateNewView
        onCreateNewView={onCreateNewView}
        filters={filters}
        appliedFilters={appliedFilters}
        onClearAll={handleFiltersClearAll}
        mode={mode}
        setMode={setMode}
      />
      <IndexTable
        resourceName={resourceName}
        itemCount={products?.length}
        selectedItemsCount={
          allResourcesSelected ? 'All' : selectedResources.length
        }
        onSelectionChange={handleSelectionChange}
        headings={[
          {title: 'Product Name'},
          {title: 'Product Type'},
          {title: 'Product Price'},
          {title: 'Product Percent', alignment: 'start'},
        ]}
      >
        {rowMarkup}
      </IndexTable>
      {selectedResources.length > 0 && <Card>
        <div className={styles.bulkActionSection}>
          <TextField
              label="percent"
              labelHidden={true}
              type={"number"}
              autoComplete="off"
              value={bulkPercent.toString()}
              onChange={(value, id) => handleChangeBulkPercent(value)}
          />
          <Button onClick={() => {}} disabled={bulkActionBtn}>Apply to selected products</Button>
          <Button disabled={true}>Remove from plan</Button>
          <Button disabled={bulkActionBtn}>cancel</Button>
        </div>
      </Card>}
    </Card>
  );

  function disambiguateLabel(key: string, value: string | any[]): string {
    switch (key) {
      case 'moneySpent':
        return `Money spent is between $${value[0]} and $${value[1]}`;
      case 'taggedWith':
        return `Tagged with ${value}`;
      case 'accountStatus':
        return (value as string[]).map((val) => `Customer ${val}`).join(', ');
      default:
        return value as string;
    }
  }

  function isEmpty(value: string | any[]) {
    if (Array.isArray(value)) {
      return value.length === 0;
    } else {
      return value === '' || value == null;
    }
  }
}

export default Products;