import makeLoc from './make-localized-element';
import {STANDARD_ELEMENT_TYPES} from '../constants';

const Loc = {};

for (elem in STANDARD_ELEMENT_TYPES) {
  const elemName = _.capitalize(elem)
  const attributes = STANDARD_ELEMENT_TYPES[elemName];
  Loc[elemName] = makeLoc(elem, attributes);
}

export default Loc;
