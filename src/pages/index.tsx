import Link from "next/link";

import Nav from "~/components/Nav";

export default function Index() {
  return (
    <main>
      <form name="contact" data-netlify="true">
        <p>
          <label>Name <input type="text" name="name" /></label>
        </p>
        <p>
          <label>Email <input type="email" name="email" /></label>
        </p>
        <p>
          <button type="submit">Send</button>
        </p>
      </form>
      netlify
      <img src="https://workshop-rc-2024.netlify.app/.netlify/images?url=https://d2w7f1pl8j4yzn.cloudfront.net/growth/onboarding-guide/task-persons/task-expense_policy.png" />
     
      local
      <img src="https://d2w7f1pl8j4yzn.cloudfront.net/growth/onboarding-guide/task-persons/task-expense_policy.png" />
     {/* <img src="https://upload.wikimedia.org/wikipedia/commons/f/ff/Pizigani_1367_Chart_10MB.jpg" /> */}

      <Nav title="Netlify Workshop" />
      <section className="flex columns">
        <div>
          <h2>Rendering strategies</h2>
          <ul>
            <li>
              <Link href="/rendering-strategies/ssg">
                Static site generation (SSG)
              </Link>
            </li>
            <li>
              <Link href="/rendering-strategies/ssr">
                Server-side rendering (SSR)
              </Link>
            </li>
            <li>
              <Link href="/rendering-strategies/swr">
                Stale-while-revalidate (SWR)
              </Link>
            </li>

            <li>
              <Link href="/rendering-strategies/odr">
                On-demand revalidation (ODR)
              </Link>
            </li>
          </ul>
          <h2>Redirects and rewrites</h2>
          <ul>
            <li>
              <Link href="/redirect-example">Redirect example</Link>
            </li>
            <li>
              <Link href="/preview-image">Rewrite example</Link>
            </li>
          </ul>
        </div>
        <div>
          <h2>Core primitives examples</h2>
          <h3>Functions</h3>
          <ul>
            <li>
              <Link href="/primitives/functions/proxy">Proxy to APIs</Link>
            </li>
            <li>
              <Link href="/primitives/functions/combine-and-filter">
                Combine and filter API responses
              </Link>
            </li>
            <li>
              <Link href="/primitives/functions/streams">Streams</Link>
            </li>
          </ul>
          <h3>Edge functions</h3>
          <ul>
            <li>
              <Link href="/primitives/edge-functions/ab-testing">
                A/B testing
              </Link>
            </li>
            <li>
              <Link href="/primitives/edge-functions/geolocation">
                Geolocation
              </Link>
            </li>
          </ul>
          <h3>Blobs</h3>
          <ul>
            <li>
              <Link href="/primitives/blobs/blobs">Access blob storage</Link>
            </li>
          </ul>
          <h3>Image CDN</h3>
          <ul>
            <li>
              <Link href="/primitives/image-cdn/same-origin">
                Same-origin images
              </Link>
            </li>
            <li>
              <Link href="/primitives/image-cdn/remote">Remote images</Link>
            </li>
          </ul>
        </div>
      </section>
    </main>
  );
}
