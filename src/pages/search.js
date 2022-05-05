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
import React, { useState } from 'react';
import styles from 'styles/pages/_Search.module.scss';
import { pageTitle } from 'utils';
import GetGeneralSettings from 'client/queries/GetGeneralSettings.graphql';
import GetMenuItems from 'client/queries/GetMenuItems.graphql';
import SearchContentNodes from 'client/queries/SearchContentNodes.graphql';
import { useQuery } from '@apollo/client';
import appConfig from 'app.config';

export default function Page({ generalSettings, primaryMenu, footerMenu }) {
  const [searchQuery, setSearchQuery] = useState('');

  const { data, error, loading, fetchMore } = useQuery(SearchContentNodes, {
    variables: {
      first: appConfig.postsPerPage,
      after: '',
      search: searchQuery,
    },
    skip: searchQuery === '',
    fetchPolicy: 'network-only',
  });

  return (
    <>
      <SEO title={pageTitle(generalSettings, 'Search')} />

      <Header menuItems={primaryMenu} />

      <Main>
        <div className={styles['search-header-pane']}>
          <div className="container small">
            <h2 className={styles['search-header-text']}>
              {searchQuery && !loading
                ? `Showing results for "${searchQuery}"`
                : `Search`}
            </h2>
            <SearchInput
              value={searchQuery}
              onChange={(newValue) => setSearchQuery(newValue)}
            />
          </div>
        </div>
        <div className="container small">
          {error && (
            <div className="alert-error">
              An error has occurred. Please refresh and try again.
            </div>
          )}

          <SearchResults
            searchResults={data?.contentNodes?.edges?.map(({ node }) => node)}
            isLoading={loading}
          />

          {data?.contentNodes?.pageInfo?.hasNextPage && (
            <div className={styles['load-more']}>
              <Button
                onClick={() => {
                  console.log('hello');
                  fetchMore({
                    variables: {
                      after: data?.contentNodes?.pageInfo?.endCursor,
                    },
                  });
                }}
              >
                Load more
              </Button>
            </div>
          )}

          {/* {!isLoading && searchResults === null && <SearchRecommendations />} */}
        </div>
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
