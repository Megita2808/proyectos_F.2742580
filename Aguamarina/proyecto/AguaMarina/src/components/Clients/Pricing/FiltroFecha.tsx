import type { ConfigProviderProps } from 'antd';
import { DatePicker, Space, ConfigProvider } from 'antd';
import es_ES from 'antd/es/locale/es_ES';
import { RangePickerProps } from 'antd/es/date-picker';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

interface FechaProps {
  onDateChange: (dates: [string, string] | null) => void;
  customClasses ?: string;
}

const Fecha: React.FC<FechaProps> = ({ onDateChange, customClasses }) => {
  const disabledDate = (current: any) => {
    return current && current.isBefore(dayjs().startOf('day'), 'day');
  };
  
  const dates = JSON.parse(sessionStorage.getItem("dates") || "null");


  const handleDateChange: RangePickerProps['onChange'] = (dates, dateStrings) => {
    if (dates) {
      onDateChange([dateStrings[0], dateStrings[1]]);
      sessionStorage.setItem('dates', JSON.stringify(dates));
    } else {
      onDateChange(null);
      sessionStorage.removeItem('dates');
    }
    
  };

  return (
    <ConfigProvider
      locale={es_ES}
      theme={{
        token: {
          colorPrimary: '#5750f1',
        },
      }}
    >
      <Space direction="vertical" size={12}>
        <RangePicker
          placeholder={["Fecha Inicial", "Fecha Final"]}
          size="large"
          onChange={handleDateChange}
          disabledDate={disabledDate}  
          defaultValue={dates && dates.length === 2 ? [dayjs(dates[0]), dayjs(dates[1])] : undefined}
          className={`input rounded-xl border-gray-300 px-5 dark:bg-dark-4 text-dark-7 py-3 shadow-lg transition-all w-64 focus:border custom-range-picker ${customClasses}`}
        />
      </Space>
    </ConfigProvider>
  );
};

export default Fecha;
