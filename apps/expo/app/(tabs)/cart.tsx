import { NotBuilt } from '../../src/components/NotBuilt';

export default function Cart() {
  return (
    <NotBuilt
      title="Bag"
      spec="LLP 0003#cart"
      notes={[
        'The cart store is already built and persists to AsyncStorage (src/store/cart.tsx) — useCart() gives items, subtotal, shipping, and a free-shipping threshold.',
        'It builds the real Brooks variant id (e.g. 1104981D197.090) that Cart-AddProduct accepts — see LLP 0002.',
        'Patterns to build: swipe-to-delete with undo, quantity steppers, free-shipping progress bar.',
        'Empty state, in Brooks’s own voice: “There’s nothing in your cart. Let’s remedy that, shall we?”',
      ]}
    />
  );
}
