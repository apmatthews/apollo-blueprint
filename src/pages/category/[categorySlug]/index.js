import * as MENUS from 'constants/menus';

import appConfig from 'app.config';
import React from 'react';
import { initializeApollo, addApolloState } from 'client';
import {
  Posts,
  LoadMore,
  Footer,
  Main,
  EntryHeader,
  Header,
  SEO,
} from 'components';
import { pageTitle } from 'utils';
import { useQuery } from '@apollo/client';
import GetGeneralSettings from 'client/queries/GetGeneralSettings.graphql';
import GetMenuItems from 'client/queries/GetMenuItems.graphql';
import GetPosts from 'client/queries/GetPosts.graphql';
import GetCategory from 'client/queries/GetCategory.graphql';

export default function Page({
  generalSettings,
  primaryMenu,
  footerMenu,
  category,
}) {
  const { loading, data, fetchMore } = useQuery(GetPosts, {
    variables: {
      after: '',
      first: appConfig.postsPerPage,
      category: category.slug,
    },
  });

  return (
    <>
      <SEO
        title={pageTitle(generalSettings, 'Posts', generalSettings?.title)}
      />

      <Header menuItems={primaryMenu} />

      <Main>
        <EntryHeader title={`Category: ${category.name}`} />
        <div className="container">
          <Posts posts={data?.posts?.edges?.map(({ node }) => node)} />
          <LoadMore
            className="text-center"
            hasNextPage={data?.posts?.pageInfo?.hasNextPage}
            endCursor={data?.posts?.pageInfo?.endCursor}
            isLoading={loading}
            fetchMore={fetchMore}
          />
        </div>
      </Main>

      <Footer menuItems={footerMenu} />
    </>
  );
}

export async function getStaticProps(context) {
  const apolloClient = initializeApollo();
  // hydrate apollo cache with first page of posts
  await apolloClient.query({
    query: GetPosts,
    variables: {
      first: appConfig.postsPerPage,
      category: context?.params?.categorySlug,
    },
  });

  const { data: categoryData } = await apolloClient.query({
    query: GetCategory,
    variables: {
      id: context?.params?.categorySlug,
      idType: 'SLUG',
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
      category: categoryData?.category,
    },
    notFound: !categoryData?.category,
  });
}

export function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  };
}
