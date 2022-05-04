import { gql } from '@apollo/client';
import { initializeApollo, addApolloState } from 'client';
import {
  Header,
  EntryHeader,
  ContentWrapper,
  Footer,
  Main,
  SEO,
} from 'components';
import { FEATURED_IMAGE_PARTS } from 'components/FeaturedImage/FeaturedImage';
import { pageTitle } from 'utils';

export const PAGE_QUERY = gql`
  query Page($id: ID!) {
    generalSettings {
      title
    }
    page(id: $id, idType: URI) {
      title
      content
      ...FeaturedImageParts
    }
  }
  ${FEATURED_IMAGE_PARTS}
`;

export default function Page({ generalSettings, page }) {
  return (
    <>
      <SEO
        title={pageTitle(generalSettings, page?.title)}
        imageUrl={page?.featuredImage?.node?.sourceUrl}
      />
      <Header />
      <Main>
        <EntryHeader title={page?.title} image={page?.featuredImage?.node} />
        <div className="container">
          <ContentWrapper content={page?.content} />
        </div>
      </Main>
      <Footer />
    </>
  );
}

export async function getStaticProps(context) {
  const apolloClient = initializeApollo();
  const { data } = await apolloClient.query({
    query: PAGE_QUERY,
    variables: {
      id: '/' + context?.params?.pageUri,
    },
  });

  return addApolloState(apolloClient, {
    props: {
      generalSettings: data?.generalSettings,
      page: data?.page,
    },
    notFound: !data || !data.page,
  });
}

export function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  };
}
