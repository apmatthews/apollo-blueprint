import * as MENUS from 'constants/menus';

import appConfig from 'app.config';
import React from 'react';
import { initializeApollo, addApolloState } from 'client';
import { useQuery } from '@apollo/client';
import {
  Posts,
  Header,
  LoadMore,
  EntryHeader,
  Footer,
  Main,
  SEO,
} from 'components';
import { pageTitle } from 'utils';
import GetGeneralSettings from 'client/queries/GetGeneralSettings.graphql';
import GetMenuItems from 'client/queries/GetMenuItems.graphql';
import GetPosts from 'client/queries/GetPosts.graphql';

export default function Page({ generalSettings, primaryMenu, footerMenu }) {
  const { loading, data, fetchMore } = useQuery(GetPosts, {
    variables: {
      after: '',
      first: appConfig.postsPerPage,
    },
  });

  return (
    <>
      <SEO title={pageTitle(generalSettings)} />

      <Header menuItems={primaryMenu} />

      <Main>
        <EntryHeader title="Latest Posts" />
        <div className="container">
          <Posts
            posts={data?.posts?.edges.map(({ node }) => node)}
            id="posts-list"
          />
          <LoadMore
            className="text-center"
            endCursor={data?.posts?.pageInfo?.endCursor}
            hasNextPage={data?.posts?.pageInfo?.hasNextPage}
            isLoading={loading}
            fetchMore={fetchMore}
          />
        </div>
      </Main>

      <Footer menuItems={footerMenu} />
    </>
  );
}

export async function getStaticProps() {
  const apolloClient = initializeApollo();
  const { data: postsData } = await apolloClient.query({
    query: GetPosts,
    variables: {
      first: appConfig.postsPerPage,
    },
  });

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
      posts: postsData?.posts || [],
    },
  });
}
