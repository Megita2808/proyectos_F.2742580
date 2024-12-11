import React, { useEffect, useState } from 'react';
import { Flex, Switch, Table, Tag, Transfer } from 'antd';
import type { GetProp, TableColumnsType, TableProps, TransferProps } from 'antd';
import { fetchPermissions } from '@/api/fetchs/get_permissions';
import { Permiso } from '@/types/admin/Permiso';
import "./styles.css"
import LoaderBasic from '../Loaders/LoaderBasic';

type TransferItem = GetProp<TransferProps, 'dataSource'>[number];
type TableRowSelection<T extends object> = TableProps<T>['rowSelection'];

interface DataType {
  key: string;
  title: string;
  description: string;
}

interface TableTransferProps extends TransferProps<TransferItem> {
  dataSource: DataType[];
  leftColumns: TableColumnsType<DataType>;
  rightColumns: TableColumnsType<DataType>;
}

// Customize Table Transfer
const TableTransfer: React.FC<TableTransferProps> = (props) => {
  const { leftColumns, rightColumns, ...restProps } = props;
  return (
    <Transfer style={{ width: '100%' }} {...restProps}>
      {({
        direction,
        filteredItems,
        onItemSelect,
        onItemSelectAll,
        selectedKeys: listSelectedKeys,
        disabled: listDisabled,
      }) => {
        const columns = direction === 'left' ? leftColumns : rightColumns;
        const rowSelection: TableRowSelection<TransferItem> = {
          getCheckboxProps: () => ({ disabled: listDisabled }),
          onChange(selectedRowKeys) {
            onItemSelectAll(selectedRowKeys, 'replace');
          },
          selectedRowKeys: listSelectedKeys,
          selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT, Table.SELECTION_NONE],
        };

        return (
          <Table
            rowSelection={rowSelection}
            columns={columns}
            dataSource={filteredItems}
            size="small"
            style={{ pointerEvents: listDisabled ? 'none' : undefined }}
            onRow={({ key, disabled: itemDisabled }) => ({
              onClick: () => {
                if (itemDisabled || listDisabled) {
                  return;
                }
                onItemSelect(key, !listSelectedKeys.includes(key));
              },
            })}
          />
        );
      }}
    </Transfer>
  );
};

const columns: TableColumnsType<DataType> = [
  {
    dataIndex: 'title',
    title: 'Nombre',
  },
  {
    dataIndex: 'description',
    title: 'Descripcion',
  },
];

const filterOption = (input: string, item: DataType) =>
  item.title?.includes(input) || item.description?.includes(input);

const TransferBasic: React.FC<{ setSelectedPermissions: (permissions: any[]) => void, row? : any }> = ({ setSelectedPermissions, row }) => {
    const [targetKeys, setTargetKeys] = useState<TransferProps['targetKeys']>();
    const [disabled, setDisabled] = useState(false);
    const [permissions, setPermissions] = useState<Permiso[]>([]);
    const [mockData, setMockData] = useState<TransferItem[]>([]);
    const [loadingTransfer, setLoadingTransfer] = useState(true);
  
    useEffect(() => {
      const fetchData = async () => {
        const permisos = await fetchPermissions();
        const mocks = permisos.map((per) => ({
          key: per.id_permission,
          title: per.name,
          description: per.description,
        }));
        setMockData(mocks);
        setPermissions(permisos);
        if (row) {
          const pastPermissions = await Promise.all(row.permissions.map((per : any) => {
            return per.id_permission
          }));
          if (pastPermissions) {
            setTargetKeys(pastPermissions)
          }
        }
      };
      fetchData();
      setLoadingTransfer(false);
    }, []);
  
    useEffect(() => {
        let selectedItems = [];
        if (targetKeys) {
            selectedItems = mockData.filter((item) => targetKeys.includes(item.key));
        }
        setSelectedPermissions(selectedItems);
    }, [targetKeys, mockData, setSelectedPermissions]);
  
    const onChange: TableTransferProps['onChange'] = (nextTargetKeys) => {
      setTargetKeys(nextTargetKeys);
    };
  
    const toggleDisabled = (checked: boolean) => {
      setDisabled(checked);
    };
  
    return (
      <div>

      
      {loadingTransfer? (
            <LoaderBasic />
          ): (
            <Flex align="start" gap="middle" vertical>
              <div className="flex w-full justify-center rounded-[7px] bg-primary/[.2] dark:bg-white/10 p-[13px] font-medium text-white hover:bg-opacity-90">
                <TableTransfer
                  dataSource={mockData}
                  targetKeys={targetKeys}
                  disabled={disabled}
                  showSearch
                  showSelectAll={false}
                  onChange={onChange}
                  filterOption={filterOption}
                  leftColumns={columns}
                  rightColumns={columns}
                />
              </div>
            </Flex>
          )}
          

        </div>
      
    );
  };

export default TransferBasic;