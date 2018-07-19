import PropTypes from 'prop-types';
import { Localized } from 'fluent-react/compat';

export function formatVars(l10nVars) {
  return _.reduce(
    l10nVars,
    (vars, value, key) => {
      vars[`$${key}`] = value;
      return vars;
    },
    {}
  );
}

function makeLoc(Elem, attrs) {
  const Loc = (props) => {
    const { l10nId, l10nVars, l10nJsx, children, ...otherProps } = props;
    const formattedVars = formatVars(l10nVars);
    return (
      <Localized id={l10nId} attrs={attrs} {...l10nJsx} {...formattedVars}>
        <Elem {...otherProps}>{children}</Elem>
      </Localized>
    );
  };

  Loc.propTypes = {
    l10nId: PropTypes.string.isRequired
  };

  return Loc;
}

export default makeLoc;
