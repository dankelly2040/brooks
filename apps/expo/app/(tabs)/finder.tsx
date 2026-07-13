import { NotBuilt } from '../../src/components/NotBuilt';

export default function Finder() {
  return (
    <NotBuilt
      title="Shoe Finder"
      spec="LLP 0003#shoe-finder"
      notes={[
        'Brooks’s real quiz is 16 branching steps; the full flow, question wording, and answers are captured in LLP 0003.',
        'Single-select steps should auto-advance with a selection haptic; segmented lime progress bar on an ink track.',
        'The “Take ’em off” barefoot checkpoint is the most Brooks moment in the product — play it full-screen.',
        'Results should name why: “Balanced cushion — you wanted soft and smooth.”',
      ]}
    />
  );
}
