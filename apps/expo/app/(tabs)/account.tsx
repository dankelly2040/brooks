import { NotBuilt } from '../../src/components/NotBuilt';

export default function Account() {
  return (
    <NotBuilt
      title="Account"
      spec="LLP 0003#login"
      notes={[
        'Frame it as joining Brooks Run Club, never as a gate. Perks are in theme/tokens.ts (RUN_CLUB_PERKS).',
        'Guest path must always be visible — commerce demos that force auth die on stage.',
        'Login is a real screen in the required scope, but no Brooks auth API is reachable (LLP 0002): treat it as local.',
      ]}
    />
  );
}
