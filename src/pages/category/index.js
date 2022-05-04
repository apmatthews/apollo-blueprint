import * as MENUS from 'constants/menus';

import Link from 'next/link';
import { initializeApollo, addApolloState } from 'client';
import { Footer, Header, EntryHeader, Main, SEO } from 'components';
import { pageTitle } from 'utils';
import GetGeneralSettings from 'client/queries/GetGeneralSettings.graphql';
import GetMenuItems from 'client/queries/GetMenuItems.graphql';
import GetCategories from 'client/queries/GetCategories.graphql';

export default function Page({
  generalSettings,
  primaryMenu,
  footerMenu,
  categories,
}) {
  return (
    <>
      <SEO
        title={pageTitle(
          generalSettings,
          'All Categories',
          generalSettings?.title
        )}
      />

      <Header menuItems={primaryMenu} />

      <Main>
        <EntryHeader title="All Categories" />
        <div className="container">
          <div className="content">
            <h1>All Categories</h1>
            <ul>
              {categories?.map(({ id, name, uri }) => {
                return (
                  <li key={id}>
                    {
                      <Link href={uri ?? '#'}>
                        <a>{name}</a>
                      </Link>
                    }
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </Main>

      <Footer menuItems={footerMenu} />
    </>
  );
}

export async function getStaticProps() {
  const apolloClient = initializeApollo();
  const { data: categoriesData } = await apolloClient.query({
    query: GetCategories,
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
      categories: categoriesData?.categories.nodes || [],
    },
  });
}
