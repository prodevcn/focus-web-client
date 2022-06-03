import React from 'react';
import PropTypes from 'prop-types';
import { Redirect, Route } from 'react-router-dom';

const PublicRoute = ({ component: C, props: cProps, ...rest }) => (
  <Route
    {...rest}
    render={(props) => (!cProps.user ? (
      <C {...props} {...cProps} match={rest.computedMatch} />
    ) : (
      <Redirect to="/" />
    ))}
  />
);

PublicRoute.propTypes = {
  component: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.func,
  ]).isRequired,
  props: PropTypes.object.isRequired,
};

export default PublicRoute;
