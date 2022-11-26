import {FlatList} from 'react-native';
import React, {useCallback} from 'react';
import {useSelector} from 'react-redux';
import {RootState} from '../store/reducer';
import {OrderReturnType} from '../../types';
import EachOrder from '../components/EachOrder';

function Orders() {
  const orders = useSelector((state: RootState) => state.order.orders);
  const renderItem = useCallback(({item}: {item: OrderReturnType}) => {
    return <EachOrder item={item} />;
  }, []);

  return (
    <FlatList
      data={orders}
      keyExtractor={item => item.orderId}
      renderItem={renderItem}
    />
  );
}

export default Orders;
