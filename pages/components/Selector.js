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
          label: 'Kimlik Numarası',
        },
        {
          value: 'pasaportNumarasi',
          label: 'Pasaport Numarası',
        },
        {
          value: 'vkn',
          label: 'Vkn',
        },
        {
          value: 'evTel',
          label: 'Ev Telefonu',
        },
        {
          value: 'ilKodu',
          label: 'İl Kodu',
        },
      ]}
    /></Space>
);

export default Selector;
