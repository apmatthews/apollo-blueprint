import * as MENUS from 'constants/menus';

import { initializeApollo, addApolloState } from 'client';
import {
  ContentWrapper,
  Footer,
  Header,
  EntryHeader,
  Main,
  SEO,
  TaxonomyTerms,
} from 'components';
import { pageTitle } from 'utils';
import GetGeneralSettings from 'client/queries/GetGeneralSettings.graphql';
import GetMenuItems from 'client/queries/GetMenuItems.graphql';
import GetPost from 'client/queries/GetPost.graphql';

export default function Page({
  generalSettings,
  primaryMenu,
  footerMenu,
  post,
}) {
  return (
    <>
      <SEO
        title={pageTitle(generalSettings, post?.title, generalSettings?.title)}
        imageUrl={post?.featuredImage?.node?.sourceUrl}
      />

      <Header menuItems={primaryMenu} />

      <Main>
        <EntryHeader
          title={post?.title}
          date={post?.date}
          author={post?.author?.node?.name}
          image={post?.featuredImage?.node}
        />
        <div className="container">
          <ContentWrapper content={post?.content}>
            <TaxonomyTerms post={post} taxonomy={'categories'} />
            <TaxonomyTerms post={post} taxonomy={'tags'} />
          </ContentWrapper>
        </div>
      </Main>

      <Footer menuItems={footerMenu} />
    </>
  );
}

export async function getStaticProps(context) {
  const apolloClient = initializeApollo();
  const { data: postData } = await apolloClient.query({
    query: GetPost,
    variables: {
      id: context?.params?.postSlug,
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
      post: postData?.post,
    },
    notFound: !postData || !postData.post,
  });
}

export function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  };
}
