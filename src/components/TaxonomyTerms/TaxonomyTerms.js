import Link from 'next/link';

import styles from './TaxonomyTerms.module.scss';
/**
 * Renders a list of taxonomy terms and term links for a given post
 * @param {Props} props The props object.
 * @param {Post} props.post The Post GraphQL Node.
 * @param {string} props.taxonomy The taxonomy type.
 * @returns {React.ReactElement} The TaxonomyTerms component
 */
export default function TaxonomyTerms({ post, taxonomy }) {
  const termLinks = post?.[taxonomy]?.nodes?.map((node, index) => {
    const { name, uri } = node;
    return (
      uri && (
        <Link key={index} href={uri}>
          {name}
        </Link>
      )
    );
  });

  if (!termLinks || 0 === termLinks.length) {
    return null;
  }

  return (
    <div>
      <span className={styles['taxonomy']}>{taxonomy}:</span>
      <span className={styles['term-links']}>{termLinks}</span>
    </div>
  );
}
