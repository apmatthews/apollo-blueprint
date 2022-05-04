import * as MENUS from 'constants/menus';

import { initializeApollo, addApolloState } from 'client';
import {
  Header,
  EntryHeader,
  ContentWrapper,
  Footer,
  Main,
  SEO,
} from 'components';
import { pageTitle } from 'utils';
import GetGeneralSettings from 'client/queries/GetGeneralSettings.graphql';
import GetMenuItems from 'client/queries/GetMenuItems.graphql';
import GetPage from 'client/queries/GetPage.graphql';

export default function Page({
  generalSettings,
  primaryMenu,
  footerMenu,
  page,
}) {
  return (
    <>
      <SEO
        title={pageTitle(generalSettings, page?.title)}
        imageUrl={page?.featuredImage?.node?.sourceUrl}
      />
      <Header menuItems={primaryMenu} />
      <Main>
        <EntryHeader title={page?.title} image={page?.featuredImage?.node} />
        <div className="container">
          <ContentWrapper content={page?.content} />
        </div>
      </Main>
      <Footer menuItems={footerMenu} />
    </>
  );
}

export async function getStaticProps(context) {
  const apolloClient = initializeApollo();
  const { data: pageData } = await apolloClient.query({
    query: GetPage,
    variables: {
      id: '/' + context?.params?.pageUri,
      idType: 'URI',
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
      page: pageData?.page,
    },
    notFound: !pageData || !pageData.page,
  });
}

export function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  };
}
