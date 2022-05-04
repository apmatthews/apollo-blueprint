import * as MENUS from 'constants/menus';

import React from 'react';
import { gql } from '@apollo/client';
import { initializeApollo, addApolloState } from 'client';
import { FaArrowRight } from 'react-icons/fa';
import {
  Posts,
  Header,
  Footer,
  EntryHeader,
  Main,
  Button,
  Heading,
  CTA,
  SEO,
} from 'components';
import styles from 'styles/pages/_Home.module.scss';
import { pageTitle } from 'utils';
import { POSTS_COMPONENT } from 'components/Posts/Posts';
import { NAVIGATION_MENU_ITEM } from 'components/NavigationMenu/NavigationMenu';

const postsPerPage = 3;

const HOME_QUERY = gql`
  query Home(
    $first: Int!
    $primaryMenu: MenuLocationEnum
    $footerMenu: MenuLocationEnum
  ) {
    generalSettings {
      title
    }
    ...PostsComponent
    primaryMenu: menuItems(where: { location: $primaryMenu }) {
      nodes {
        ...NavigationMenuItem
      }
    }
    footerMenu: menuItems(where: { location: $footerMenu }) {
      nodes {
        ...NavigationMenuItem
      }
    }
  }
  ${POSTS_COMPONENT}
  ${NAVIGATION_MENU_ITEM}
`;

export default function Page({
  generalSettings,
  primaryMenu,
  footerMenu,
  posts,
}) {
  const mainBanner = {
    sourceUrl: '/static/banner.jpeg',
    mediaDetails: { width: 1200, height: 600 },
    altText: 'Blog Banner',
  };

  return (
    <>
      <SEO
        title={pageTitle(generalSettings)}
        imageUrl={mainBanner?.sourceUrl}
      />

      <Header menuItems={primaryMenu} />

      <Main className={styles.home}>
        <EntryHeader image={mainBanner} />
        <div className="container">
          <section className="hero text-center">
            <Heading className={styles.heading} level="h1">
              Welcome to your Blueprint
            </Heading>
            <p className={styles.description}>
              Achieve unprecedented performance with modern frameworks and the
              world&apos;s #1 open source CMS in one powerful headless platform.{' '}
            </p>
            <div className={styles.actions}>
              <Button styleType="secondary" href="/contact-us">
                GET STARTED
              </Button>
              <Button styleType="primary" href="/about">
                LEARN MORE
              </Button>
            </div>
          </section>
          <section className="cta">
            <CTA
              Button={() => (
                <Button href="/posts">
                  Get Started <FaArrowRight style={{ marginLeft: `1rem` }} />
                </Button>
              )}
            >
              <span>
                Learn about Core Web Vitals and how Atlas can help you reach
                your most demanding speed and user experience requirements.
              </span>
            </CTA>
          </section>
          <section className={styles.posts}>
            <Heading className={styles.heading} level="h2">
              Latest Posts
            </Heading>
            <Posts posts={posts?.nodes} id="posts-list" />
          </section>
          <section className="cta">
            <CTA
              Button={() => (
                <Button href="/posts">
                  Get Started <FaArrowRight style={{ marginLeft: `1rem` }} />
                </Button>
              )}
            >
              <span>
                Learn about Core Web Vitals and how Atlas can help you reach
                your most demanding speed and user experience requirements.
              </span>
            </CTA>
          </section>
        </div>
      </Main>

      <Footer menuItems={footerMenu} />
    </>
  );
}

export async function getStaticProps() {
  const apolloClient = initializeApollo();
  const { data } = await apolloClient.query({
    query: HOME_QUERY,
    variables: {
      first: postsPerPage,
      primaryMenu: MENUS.PRIMARY_LOCATION,
      footerMenu: MENUS.FOOTER_LOCATION,
    },
  });

  return addApolloState(apolloClient, {
    props: {
      generalSettings: data?.generalSettings || [],
      posts: data?.posts || [],
      primaryMenu: data?.primaryMenu?.nodes || [],
      footerMenu: data?.footerMenu?.nodes || [],
    },
  });
}
