import PropTypes from 'prop-types';

export default function Slicer({
  parameter,
  renderSlicer,
}, {
  read,
  write,
}) {
  return renderSlicer({
    defaultValue: read(parameter),
    onChange: value => write(parameter, value),
  });
}

Slicer.propTypes = {
  parameter: PropTypes.string.isRequired,
  renderSlicer: PropTypes.func.isRequired,
};

Slicer.contextTypes = {
  read: PropTypes.func,
  write: PropTypes.func,
};
