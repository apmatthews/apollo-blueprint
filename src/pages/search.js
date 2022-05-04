import * as MENUS from 'constants/menus';

import { initializeApollo, addApolloState } from 'client';
import {
  Button,
  Footer,
  Header,
  Main,
  SearchInput,
  SearchRecommendations,
  SearchResults,
  SEO,
} from 'components';
// import useSearch from 'hooks/useSearch';
import React from 'react';
import styles from 'styles/pages/_Search.module.scss';
import { pageTitle } from 'utils';
import GetGeneralSettings from 'client/queries/GetGeneralSettings.graphql';
import GetMenuItems from 'client/queries/GetMenuItems.graphql';

export default function Page({ generalSettings, primaryMenu, footerMenu }) {
  // const {
  //   searchQuery,
  //   setSearchQuery,
  //   searchResults,
  //   loadMore,
  //   isLoading,
  //   pageInfo,
  //   error,
  // } = useSearch();

  return (
    <>
      <SEO title={pageTitle(generalSettings, 'Search')} />

      <Header menuItems={primaryMenu} />

      <Main>
        <h1>TODO: Search</h1>
        {/* <div className={styles['search-header-pane']}>
          <div className="container small">
            <h2 className={styles['search-header-text']}>
              {searchQuery && !isLoading
                ? `Showing results for "${searchQuery}"`
                : `Search`}
            </h2>
            <SearchInput
              value={searchQuery}
              onChange={(newValue) => setSearchQuery(newValue)}
            />
          </div>
        </div> */}
        {/* <div className="container small">
          {error && (
            <div className="alert-error">
              An error has occurred. Please refresh and try again.
            </div>
          )}

          <SearchResults searchResults={searchResults} isLoading={isLoading} />

          {pageInfo?.hasNextPage && (
            <div className={styles['load-more']}>
              <Button onClick={() => loadMore()}>Load more</Button>
            </div>
          )}

          {!isLoading && searchResults === null && <SearchRecommendations />}
        </div> */}
      </Main>

      <Footer menuItems={footerMenu} />
    </>
  );
}

export async function getStaticProps() {
  const apolloClient = initializeApollo();
  const { data: generalSettingsData } = await apolloClient.query({
    query: GetGeneralSettings,
  });

  const { data: primaryMenuData } = await apolloClient.query({
    query: GetMenuItems,
    variables: {
      location: MENUS.PRIMARY_LOCATION,
    },
  });

  const { data: footerMenuData } = await apolloClient.query({
    query: GetMenuItems,
    variables: {
      location: MENUS.FOOTER_LOCATION,
    },
  });

  return addApolloState(apolloClient, {
    props: {
      generalSettings: generalSettingsData?.generalSettings || [],
      primaryMenu: primaryMenuData?.menuItems.nodes || [],
      footerMenu: footerMenuData?.menuItems?.nodes || [],
    },
  });
}
