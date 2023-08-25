import React from 'react';
import { Select, Space } from 'antd';

const Selector = (props) => (
  <Space wrap>
    <Select
      defaultValue="kimlikNumarasi"
      style={{
        width: 200,
      }}
      onChange={props.handleSelectorChange}
      options={[
        {
          value: 'kimlikNumarasi',
          label: 'kimlikNumarasi',
        },
        {
          value: 'pasaportNumarasi',
          label: 'pasaportNumarasi',
        },
        {
          value: 'vkn',
          label: 'vkn',
        },
        {
          value: 'evTel',
          label: 'evTel',
        },
        {
          value: 'ilKodu',
          label: 'ilKodu',
        },
      ]}
    /></Space>
);

export default Selector;
