import * as MENUS from 'constants/menus';

import { initializeApollo, addApolloState } from 'client';
import { Button, Footer, Header, EntryHeader, Main, SEO } from 'components';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { pageTitle } from 'utils';
import styles from 'styles/pages/_404.module.scss';
import GetGeneralSettings from 'client/queries/GetGeneralSettings.graphql';
import GetMenuItems from 'client/queries/GetMenuItems.graphql';

export default function Page({ generalSettings, primaryMenu, footerMenu }) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <>
      <SEO title={pageTitle(generalSettings, generalSettings.title)} />

      <Header menuItems={primaryMenu} />

      <Main>
        <EntryHeader title="Not found, error 404" />
        <div className="container small">
          <p className="text-center">
            Oops, the page you are looking for does not exist or is no longer
            available. Everything is still awesome. Just use the search form to
            find your way.
          </p>

          <form
            className={styles.form}
            onSubmit={(e) => {
              e.preventDefault();

              router.push({
                pathname: '/search',
                query: { searchQuery: searchQuery },
              });
            }}
          >
            <label htmlFor="404-search-input" className="sr-only">
              Search
            </label>
            <input
              id="404-search-input"
              name="404-search-input"
              className={styles['search-input']}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <Button styleType="secondary" role="submit">
              Search
            </Button>
          </form>
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
      generalSettings: generalSettingsData?.generalSettings,
      primaryMenu: primaryMenuData?.menuItems?.nodes || [],
      footerMenu: footerMenuData?.menuItems?.nodes || [],
    },
  });
}
