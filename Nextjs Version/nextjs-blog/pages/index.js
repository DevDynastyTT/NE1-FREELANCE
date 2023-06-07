import Head from 'next/head';
import Layout, { siteTitle } from '../components/layout';
import utilStyles from '../styles/utils.module.css';

export default function Home() {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <p>
            Your software engineering company is a leading provider of custom software solutions. 
            With over 10 years of experience, your company has a proven track record of success. 
            Your team of experienced engineers is passionate about creating innovative solutions 
            that meet the needs of your clients. Your company is committed to providing excellent 
            customer service and is always available to answer your questions and concerns.
          </p>
        <p>
          (This is a sample website - you’ll be building a site like this on{' '}
          <a href="https://nextjs.org/learn">our Next.js tutorial</a>.)
        </p>
      </section>
    </Layout>
  );
}1