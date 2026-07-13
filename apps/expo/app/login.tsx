import { NotBuilt } from '../src/components/NotBuilt';

export default function Login() {
  return (
    <NotBuilt
      title="Join Brooks Run Club"
      spec="LLP 0003#login"
      notes={[
        'Membership framing, not a gate. Navy card, lime checkmarks, perks from RUN_CLUB_PERKS.',
        '“Continue as guest” must always be visible.',
        'No Brooks auth endpoint is reachable from an app (LLP 0002) — keep this local to the prototype.',
      ]}
    />
  );
}
