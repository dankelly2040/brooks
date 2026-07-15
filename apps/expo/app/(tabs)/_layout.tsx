import { NativeTabs } from 'expo-router/unstable-native-tabs';

import { useCart } from '../../src/store/cart';

export default function TabLayout() {
  const { count } = useCart();

  return (
    <NativeTabs minimizeBehavior="onScrollDown">
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Icon
          sf={{ default: 'house', selected: 'house.fill' }}
          md="home"
        />
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="shop">
        <NativeTabs.Trigger.Icon
          sf={{ default: 'storefront', selected: 'storefront.fill' }}
          md="storefront"
        />
        <NativeTabs.Trigger.Label>Shop</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="finder" role="search">
        <NativeTabs.Trigger.Label>Shoe Finder</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="cart">
        <NativeTabs.Trigger.Icon
          sf={{ default: 'bag', selected: 'bag.fill' }}
          md="shopping_bag"
        />
        <NativeTabs.Trigger.Label>Bag</NativeTabs.Trigger.Label>
        {count > 0 && (
          <NativeTabs.Trigger.Badge>
            {count > 9 ? '9+' : count}
          </NativeTabs.Trigger.Badge>
        )}
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="account">
        <NativeTabs.Trigger.Icon
          sf={{ default: 'person', selected: 'person.fill' }}
          md="person"
        />
        <NativeTabs.Trigger.Label>Account</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
