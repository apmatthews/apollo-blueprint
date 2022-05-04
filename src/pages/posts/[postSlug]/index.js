import { gql } from '@apollo/client';
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
import { FEATURED_IMAGE_PARTS } from 'components/FeaturedImage/FeaturedImage';
import { pageTitle } from 'utils';

export const POST_QUERY = gql`
  query Page($id: ID!) {
    generalSettings {
      title
    }
    post(id: $id, idType: URI) {
      title
      content
      author {
        node {
          name
        }
      }
      date
      ...FeaturedImageParts
    }
  }
  ${FEATURED_IMAGE_PARTS}
`;

export default function Page({ generalSettings, post }) {
  return (
    <>
      <SEO
        title={pageTitle(generalSettings, post?.title, generalSettings?.title)}
        imageUrl={post?.featuredImage?.node?.sourceUrl}
      />

      <Header />

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

      <Footer />
    </>
  );
}

export async function getStaticProps(context) {
  const apolloClient = initializeApollo();
  const { data } = await apolloClient.query({
    query: POST_QUERY,
    variables: {
      id: '/posts/' + context?.params?.postSlug,
    },
  });

  return addApolloState(apolloClient, {
    props: {
      generalSettings: data?.generalSettings,
      post: data?.post,
    },
    notFound: !data || !data.post,
  });
}

export function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  };
}
