import { NotBuilt } from '../src/components/NotBuilt';

export default function Search() {
  return (
    <NotBuilt
      title="Search"
      spec="LLP 0002#constructor-io"
      notes={[
        'This is the one screen that can hit a real Brooks API live from the device.',
        'src/data/constructor.ts is written and ready: search() and autocomplete() against Brooks’s public Constructor.io index.',
        'Autocomplete returns both suggested terms and matching products — debounce ~200ms and show both.',
        'Constructor has no prices (LLP 0002), so join hits back to the local catalog by product id to render a tile.',
      ]}
    />
  );
}
