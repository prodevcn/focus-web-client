import React from "react";
import { Route, Switch } from "react-router-dom";
import PublicRoute from "./PublicRoute";
import Home from "../containers/Home";
import SearchResult from "../containers/SearchResult";
import Profile from "../containers/Profile";
import Account from "../containers/Account";
import ProfileEdit from "../containers/ProfileEdit";
import CollectibleDetail from "../containers/CollectibleDetail";
import CollectionItems from "../containers/CollectionList";
import CreateCollectible from "../containers/CreateCollectible";
import NotFound from "../containers/NotFound";

const routes = (props) => {
  return (
    <Switch>
      <PublicRoute exact path="/" component={Home} props={props} />

      <PublicRoute
        exact
        path="/search"
        component={SearchResult}
        props={props}
      />

      <PublicRoute exact path="/profile" component={Profile} props={props} />

      <PublicRoute
        exact
        path="/account/:address"
        component={Account}
        props={props}z
      />

      <PublicRoute
        exact
        path="/profile/edit"
        component={ProfileEdit}
        props={props}
      />

      <PublicRoute
        exact
        path="/collectible/create"
        component={CreateCollectible}
        props={props}
      />

      <PublicRoute
        exact
        path="/collectible/:address/:id"
        component={CollectibleDetail}
        props={props}
      />

      <PublicRoute
        exact
        path="/collection/:address/:id"
        component={CollectionItems}
        props={props}
      />

      <Route component={NotFound} />
    </Switch>
  );
};

export default routes;
